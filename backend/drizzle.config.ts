import { DEFAULT_DOCKER_DB } from 'src/common/constants';

export default {
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle',
  url: process.env.DATABASE_URL || DEFAULT_DOCKER_DB,
};
