import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Koble til Neon med SSL (påkrevd)
const client = postgres(process.env.DATABASE_Varsling!, { ssl: "require" });

export const db = drizzle(client);
