import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
console.log("DATABASE_USER:", process.env.DATABASE_USER);
console.log("DATABASE_GENERELT:", process.env.DATABASE_GENERELT);
const sql1 = neon(process.env.DATABASE_USER!); 
const sql2 = neon(process.env.DATABASE_GENERELT!);

export const dbUser = drizzle({ client: sql1 });
export const dbGenerelt = drizzle({ client: sql2 });