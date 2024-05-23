import { Module } from '@nestjs/common';
import {UserService} from "@modules/user/services";
import {UserController} from "@modules/user/controllers";

@Module({
    imports: [

    ],
    controllers: [UserController],
    providers: [ UserService],
    exports: [
        UserService
    ],
})
export class UserModule {}
