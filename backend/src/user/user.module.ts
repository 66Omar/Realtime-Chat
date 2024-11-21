import { Module } from '@nestjs/common';
import { FileReaderService } from 'src/common/services/file-reader.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, FileReaderService],
})
export class UserModule {}
