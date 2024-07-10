import {
  Body,
  Controller,
  Post,
} from '@nestjs/common'
import {BaseController} from "@common/bases";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthService} from "@auth/services/auth.service";
import {LoginPayload, RegisterDto} from "@auth/dtos";
import { Authorize } from '../decorators';
import {AuthResponse} from "@modules/auth";

@ApiTags('Auth')
@Controller('user/auth')
export class UserAuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
  ) {
    super()
  }

  @Post('login')
  async login(@Body() payload: LoginPayload) {
    return this.authService.signIn(payload)
  }

  @Authorize()
  @ApiBearerAuth()
  @Post('logout')
  async logout() {
    return await this.authService.signOut()
  }

  @Post('signup')
  async register(
      @Body() payload: RegisterDto
  ): Promise<AuthResponse> {
    if (payload.password !== payload.password_confirmation) {
      throw new Error('Passwords do not match');
    }
    delete payload.password_confirmation;
    return await this.authService.signUp(payload)
  }
}
