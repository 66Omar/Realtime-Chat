import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seed.module';
import { AuthService } from 'src/auth/auth.service';
import { fakerEN } from '@faker-js/faker';
import { getRandomAvatarNumber } from 'src/common/utils';

export class Seeder {
  private authService: AuthService;

  async bootstrap() {
    const app = await NestFactory.createApplicationContext(SeederModule);

    this.authService = app.get(AuthService);

    try {
      Array.from({ length: 10 }, (_, i: number) =>
        this.authService.createUser({
          username: `${fakerEN.person.firstName()}F${i}`,
          password: 'test1234',
          re_password: 'test1234',
          avatar: `/static/avatars/${getRandomAvatarNumber()}.png`,
        }),
      );
      await app.close();
    } catch (error) {
      console.error('Seed failed:', error);
      await app.close();
      process.exit(1);
    }
  }
}

async function bootstrap() {
  const seeder = new Seeder();
  await seeder.bootstrap();
}

bootstrap();
