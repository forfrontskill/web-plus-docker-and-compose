import { IsEmail, IsUrl, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  username: string;

  @IsUrl()
  avatar: string;

  @Length(2, 200)
  about?: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
