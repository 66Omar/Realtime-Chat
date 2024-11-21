import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGatewayModule } from './chat-gateway/chat-gateway.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      useFactory: () => [
        {
          rootPath: join(__dirname, '..', '..', 'static'),
          serveRoot: '/static',
        },
      ],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ChatGatewayModule,
    UserModule,
    AuthModule,
    ChatModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
