import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export type DatabaseService = NodePgDatabase<typeof schema>;
export const DRIZZLE = Symbol('drizzle-connection');
