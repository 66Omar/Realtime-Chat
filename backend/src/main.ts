import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { GlobalExceptionFilter } from './exceptions/global.exception';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5175'],
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
