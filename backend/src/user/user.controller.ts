import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GenericQueryDto } from 'src/common/dto/offset-query.dto';
import { FileReaderService } from 'src/common/services/file-reader.service';
import { CursorQueryDto } from 'src/common/dto/cursor-query.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileReaderService,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  getAllUsers(@Query() queries: CursorQueryDto) {
    return this.userService.getUsers(queries);
  }

  @Get('/count/')
  getUsersCount() {
    return this.userService.getUsersCount();
  }

  @Get('/avatars/')
  getAvailableAvatars() {
    return this.fileService.getFileNames();
  }

  @UseGuards(AuthGuard)
  @Get('/suggestions/')
  getUserSuggestions(@Request() request, @Query() queries: GenericQueryDto) {
    return this.userService.getUserSuggestions(request.user.id, queries);
  }
  @UseGuards(AuthGuard)
  @Get('/me/')
  getCurrentUser(@Request() request) {
    return this.userService.getUserById(request.user.id);
  }
}
