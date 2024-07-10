import {Controller, Get} from '@nestjs/common';
import {BaseController} from "@common/bases";
import {UserRepository} from "@modules/shared";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import { Authorize } from '@auth/decorators'

@ApiTags('User')
@Controller('user')
export class UserController extends BaseController {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
        super();
    }

    @Authorize()
    @ApiBearerAuth()
    @Get('info')
    async getInfo() {
        const userId = this.currentSession.userId;
        return this.userRepository.getById(userId);
    }

    @Get('by-email')
    async getUserByEmail(email: string){
        return this.userRepository.getByEmail(email, undefined);
    }
}