import { RedisCacheService } from '@cache'
import { Configuration } from '@config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Session } from '~/common'
type TokenType = 'ACCESS_TOKEN' | 'REFRESH_TOKEN'

@Injectable()
export class SessionService {
  private readonly expiresIn: number;
  constructor(
    private readonly cacheService: RedisCacheService,
    private readonly configService: ConfigService,
  ) {
    this.expiresIn =
      this.configService.get<Configuration['jwt']>('jwt').expiresIn
  }

  get(
    userId: string | number,
    token: string,
    type: TokenType,
  ): Promise<Session> {
    let key = token;
    if (type === 'ACCESS_TOKEN') key = `USER_${userId}__A:${key}`;
    else key = `USER_${userId}__R:${key}`;

    return this.cacheService.get<Session>(key)
  }

  set(token: string, sessionData: Session, type: TokenType) {
    let key = token;
    let sessionExpire = this.expiresIn;
    if (type === 'ACCESS_TOKEN') {
      key = `USER_${sessionData.userId}__A:${key}`;
    } else {
      key = `USER_${sessionData.userId}__R:${key}`;
      sessionExpire += 300 // REFRESH_TOKEN Expires in AccessToken + 5 mins.
    }
    return this.cacheService.set(key, sessionData, sessionExpire, 'NX')
  }

  async revokeAllSessions(userId: string | number) {
    await this.cacheService.delete(`USER_${userId}*`)
  }

  remove(token: string, type: TokenType) {
    let key = token
    if (type === 'ACCESS_TOKEN') key = `A:${key}`;
    else key = `R:${key}`;

    return this.cacheService.delete(key)
  }
}
