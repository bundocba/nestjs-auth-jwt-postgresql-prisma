import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService as BaseJwtService } from '@nestjs/jwt'
import { Configuration } from '@config'
import { instanceToPlain } from 'class-transformer'
import jwt from 'jsonwebtoken'
import { JwtSession } from '../interfaces'

@Injectable()
export class JwtService {
  private readonly jwtOptions: Configuration['jwt'];
  constructor(
    private readonly configService: ConfigService,
    private jwtService: BaseJwtService,
  ) {
    this.jwtOptions = configService.get<Configuration['jwt']>('jwt')
  }
  async generateToken(payload: JwtSession): Promise<string> {
    const { secret, issuer, expiresIn } = this.jwtOptions;
    return await this.jwtService.signAsync(instanceToPlain(payload), {
      secret,
      issuer,
      expiresIn,
    })
  }

  async verifyToken<T extends object>(
    token: string,
  ): Promise<{ valid: boolean; data: T | null }> {
    const { secret, issuer } = this.jwtOptions;
    try {
      return {
        valid: true,
        data: await this.jwtService.verifyAsync<T>(token, { secret, issuer }),
      }
    } catch (ex) {
      return {
        valid: false,
        data: null,
      }
    }
  }

  decodeToken<T>(token: string, options?: jwt.DecodeOptions) {
    return this.jwtService.decode<T>(token, options)
  }
}
