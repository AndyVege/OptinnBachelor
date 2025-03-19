import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {neon} from "@neondatabase/serverless";
import {config} from "dotenv";

config({ path: ".env.local"})

const db = drizzle(process.env.DATABASE_URL!);

export {db};
