import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'Username must contain only letters and numbers, without spaces or special characters',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
