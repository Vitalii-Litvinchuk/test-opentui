import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

const sqlite = new Database('local.db');

export const db = drizzle(sqlite, { schema });
