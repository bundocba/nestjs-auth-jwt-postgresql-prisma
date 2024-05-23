import {IsEmail, IsNotEmpty, IsString} from 'class-validator'

export class LoginPayload {
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
