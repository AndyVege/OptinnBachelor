// scripts/testing.ts

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL er ikke satt i .env.local");
}

console.log("🧪 DB:", process.env.DATABASE_URL);

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { weatherData } from "../db/schemaWeather.js"; // Legg til .js dersom kompilatoren krever det

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

const testData = {
  temperature: 25,
  windSpeed: 78,
  condition: "Skred"
};

async function seed() {
  try {
    await db.insert(weatherData).values(testData);
    console.log("Inserted:", testData);
  } catch (error) {
    console.error("SEED ERROR:", error);
  }
}

seed();
