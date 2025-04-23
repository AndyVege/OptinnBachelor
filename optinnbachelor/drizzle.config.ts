import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schemaWeather.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // ✅ Not DATABASE_USER
  },
});

console.log("DB URL:", process.env.DATABASE_URL);


