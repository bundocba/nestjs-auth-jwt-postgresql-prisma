import { Module } from '@nestjs/common'
import {AuthService} from "@auth/services/auth.service";
import {JwtService, SessionService} from "@auth/services";
import {JwtModule} from "@nestjs/jwt";
import {UserAuthController} from "@auth/controllers/auth.controller";
import {SharedModule} from "@modules/shared";
import {UserModule} from "@modules/user/user.module";

@Module({
  imports: [JwtModule, SharedModule, UserModule],
  controllers: [UserAuthController],
  exports: [
    AuthService,
    SessionService,
    JwtService,
  ],
  providers: [
    AuthService,
    SessionService,
    JwtService,
  ],
})
export class AuthModule {}
