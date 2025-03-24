import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schemaUser.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_USER!,
  },
});