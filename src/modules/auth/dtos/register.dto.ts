import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class RegisterDto  {

    @IsString()
    @IsOptional()
    phone?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    profilePicture?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(60)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(60)
    password_confirmation: string;

}