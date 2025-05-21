// scripts/testing.ts

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// --- SLIK VELGER DU TEST‐DATA — endre her: ---
const testData = {
  // Velg én av: "flom", "skred" eller "skogbrann"
  condition:  "Skred",

  // Sett vindhastighet (km/t):
  windSpeed:  20,

  // Sett temperatur (°C):
  // (kun relevant for skogbrann, men må alltid oppgis)
  temperature: 20,
};
// ------------------------------------------------

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { weatherData } from "../db/schemaWeather.js";
import { generateWeatherAlerts } from "../lib/generateWeatherAlerts.js";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL er ikke satt i .env.local");

console.log("🧪 Kobler til DB:", url);
console.log("🌦 Tester med data:", testData);

const client = postgres(url);
const db = drizzle(client);

async function seedAndRun() {
  try {
    // 1) Seed i databasen
    await db.insert(weatherData).values(testData);
    console.log("✅ Inserted:", testData);

    // 2) Generer lokalt uten å hente fra DB
    const fakeRow = { id: 0, ...testData };
    const alerts = generateWeatherAlerts(fakeRow);

    // 3) Vis resultatet
    if (alerts.length === 0) {
      console.log("ℹ️ Ingen varsler generert for denne kombinasjonen.");
    } else {
      console.log("⚠️ Genererte varsler:");
      for (const a of alerts) {
        console.log(` • ${a.title} [${a.priority}]: ${a.description}`);
      }
    }
  } catch (err) {
    console.error("❌ SEED/TEST ERROR:", err);
  } finally {
    await client.end();
  }
}

seedAndRun();
