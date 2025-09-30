import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:pipelines.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Initialize database tables
await client.batch([
  `CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    value REAL NOT NULL,
    stage TEXT NOT NULL,
    probability INTEGER NOT NULL DEFAULT 50,
    contact_name TEXT,
    contact_title TEXT,
    contact_id TEXT,
    expected_close_date TEXT,
    description TEXT,
    last_activity TEXT,
    days_in_stage INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    mobile_phone TEXT,
    work_phone TEXT,
    fax TEXT,
    company TEXT,
    job_title TEXT,
    birthday TEXT,
    location TEXT,
    linkedin_url TEXT,
    whatsapp TEXT,
    contact_frequency TEXT,
    last_contacted_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`
], 'write').catch(() => {
  // Tables might already exist, ignore error
});

export { opportunities, contacts } from './schema';
export type { Opportunity, NewOpportunity, Contact, NewContact } from './schema';
