import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register/')
  registerUser(@Body(ValidationPipe) user: CreateUserDto) {
    return this.authService.createUser(user);
  }

  @Post('/login/')
  loginUser(@Body() user: LoginUserDto) {
    return this.authService.loginUser(user);
  }
}
