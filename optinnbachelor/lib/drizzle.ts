import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

<<<<<<< Updated upstream
// Replace with your actual database URL
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export const db = drizzle(sql);
=======
const client = postgres(process.env.DATABASE_URL!); // Make sure DATABASE_URL is set in .env

export const db = drizzle(client);
>>>>>>> Stashed changes
