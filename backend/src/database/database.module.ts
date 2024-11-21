import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { DRIZZLE } from '.';
import { DEFAULT_DOCKER_DB } from 'src/common/constants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databasURL = configService.get<string>('DATABASE_URL') || DEFAULT_DOCKER_DB;
        const pool = new Pool({
          connectionString: databasURL,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
