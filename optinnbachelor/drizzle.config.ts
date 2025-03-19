import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export default defineConfig({
  out: './db/migrations',
  schema: './db/met/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});