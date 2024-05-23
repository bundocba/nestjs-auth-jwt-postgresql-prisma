import {BaseService} from "@common/bases";
import {Injectable} from "@nestjs/common";
import {RegisterDto} from "@auth/dtos";
import {BusinessException} from "@common/exception";
import {UserRepository} from "@modules/shared";
import {
    User,
} from '@prisma/client'
import {CommonHelpers} from "@common/helpers";

@Injectable()
export class UserService extends BaseService {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
        super()
    }

    async registerUser(
        payload: RegisterDto,
    ): Promise<User> {
        if (!payload) throw new BusinessException('INVALID_DATA');
        const userExists = await this.userRepository.getByEmail(payload.email, undefined);
        if (userExists) throw new BusinessException('USER_EXISTED');
        try {
            const passwordKey = CommonHelpers.uuid();
            return await this.userRepository.create({
                data : {
                    ...payload,
                    uuid: CommonHelpers.uuid(),
                    securePassword: passwordKey,
                    password: CommonHelpers.sha256(payload.password, passwordKey),
                }
            })
        } catch (error) {
            throw error
        }
    }
}