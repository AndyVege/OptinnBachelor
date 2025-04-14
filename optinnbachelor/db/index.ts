import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql1 = neon(process.env.DATABASE_USER!); 
const sql2 = neon(process.env.DATABASE_GENERELT!);
const sql3 = neon(process.env.DATABASE_URL!);


export const dbUser = drizzle({ client: sql1 });
export const dbGenerelt = drizzle({ client: sql2 });
export const dbHelse = drizzle({ client: sql3 });
