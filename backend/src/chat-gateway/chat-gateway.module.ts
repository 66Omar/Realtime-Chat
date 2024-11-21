import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ChatModule, AuthModule],
  providers: [ChatGateway],
})
export class ChatGatewayModule {}
