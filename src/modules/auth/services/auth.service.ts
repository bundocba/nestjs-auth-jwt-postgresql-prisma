import {Configuration} from "@common/config";
import {Injectable, Logger} from "@nestjs/common";
import {BaseService} from "@common/bases";
import {BusinessException} from "@common/exception";
import {UserRepository} from "@modules/shared";
import * as dayjs from 'dayjs'
import {CommonHelpers} from "@common/helpers";
import {Session} from "@common/memories";
import { SessionService } from './session.service'
import { JwtService } from './jwt.service'
import { User } from '@prisma/client';
import {AuthResponse, Login} from "@auth/interfaces";
import {ConfigService} from "@nestjs/config";
import {RegisterDto} from "@auth/dtos";
import {UserService} from "@modules/user";

@Injectable()
export class AuthService extends BaseService {
  private readonly authConfig: Configuration['authConfig'];
  private readonly logger: Logger;
  constructor(
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService,
      private readonly userRepository: UserRepository,
      private readonly sessionService: SessionService,
      private readonly userService: UserService,
  ) {
    super();
    this.authConfig =
        configService.get<Configuration['authConfig']>('authConfig');
    this.logger = new Logger(AuthService.name)
  }

  signIn = async (payload: Login) => {
    if (!payload) throw new BusinessException('REQUEST_EMPTY');
    const { email, password } = payload;
    const user = await this.userRepository.getByEmail(email, true);
    if (!user) throw new BusinessException('AUTH_WRONG_PASSWORD');
    const now = dayjs();
    if (
        user.wrongPasswordAttempts >= this.authConfig.retryAttempts &&
        dayjs(user.lockTime).diff(now) > 0
    ) {
      throw new BusinessException('ACCOUNT_LOCKED');
    }
    const passwordHash = CommonHelpers.sha256(password, user.securePassword);
    if (passwordHash !== user.password) {
      const wrongPasswordAttempts = user.wrongPasswordAttempts + 1;
      let lockTime = user.lockTime;

      if (wrongPasswordAttempts >= this.authConfig.retryAttempts)
        lockTime = dayjs().add(this.authConfig.lockTime, 'minutes').toDate();

      await this.userRepository.update({
        where: {
          uuid: user.uuid,
        },
        data: {
          wrongPasswordAttempts,
          lockTime,
        },
      });
      throw new BusinessException('AUTH_WRONG_PASSWORD')
    }

    await this.userRepository.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        wrongPasswordAttempts: 0,
        lockTime: null,
      },
    });

    return await this.createSession(
        user,
        !this.authConfig.allowMultiLoginDevices,
    )
  };

  private async createSession(
      user: User,
      isRevokeAllSession: boolean,
  ): Promise<AuthResponse> {
    if (!user) return;
    const session = new Session({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      avatar: user.profilePicture,
      registrationDate: user.createdAt,
    });
    if (isRevokeAllSession)
      await this.sessionService.revokeAllSessions(session.userId);
    const accessToken = await this.jwtService.generateToken({
      userId: user.id,
    });

    const refreshToken = CommonHelpers.sha256(
        CommonHelpers.uuid().replace(/-/g, '').toUpperCase(),
        user.securePassword,
    );
    await Promise.all([
      this.sessionService.set(accessToken, session, 'ACCESS_TOKEN'),
      this.sessionService.set(refreshToken, session, 'REFRESH_TOKEN'),
    ]);

    return {
      accessToken,
      refreshToken,
      userInfo: session,
    }
  }

  signOut = async () => {
    const userId = this.currentSession?.userId;
    return await this.sessionService.revokeAllSessions(userId)
  };

  signUp = async (payload: RegisterDto) => {
    return await this.createSession(
        await this.userService.registerUser(payload),
        !this.authConfig.allowMultiLoginDevices,
    )
  }
}
