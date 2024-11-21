import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { DEFAULT_SECRET_KEY } from 'src/common/constants';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('SECRET_KEY') || DEFAULT_SECRET_KEY,
  signOptions: {
    expiresIn: '1d',
  },
});
