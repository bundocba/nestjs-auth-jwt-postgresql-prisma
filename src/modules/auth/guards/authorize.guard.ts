import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { UnauthorizedException } from '~/common'
import { LOCAL_AUTHORIZE_KEY } from '../constants'
import { JwtSession } from '../interfaces'
import { JwtService, SessionService } from '../services'

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private ref: Reflector,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const localAuthData: { permission: string; moduleCode: string } =
      this.ref.get(LOCAL_AUTHORIZE_KEY, context.getHandler());
    // case public
    if (!localAuthData) return true;

    const request: Request = context.switchToHttp().getRequest();
    const { accessToken } = request.scopeVariable;
    if (!accessToken) throw new UnauthorizedException();

    const { valid, data: jwtData } =
      await this.jwtService.verifyToken<JwtSession>(accessToken);
    if (!valid) throw new UnauthorizedException();

    const session = await this.sessionService.get(
      jwtData.userId,
      accessToken,
      'ACCESS_TOKEN',
    );
    if (!session) throw new UnauthorizedException();

    request.scopeVariable.session = session;

    const { permission } = localAuthData;
    // For only authorized
    if (!permission) return true
  }
}
