import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_Varsling!, // ✅ Not DATABASE_USER
  },
});

console.log("DB URL:", process.env.DATABASE_URL);


