// app/api/weatherAlerts/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";   // Drizzle-kobling
import { weatherData } from "@/db/schemaWeather";
import { desc } from "drizzle-orm";

let lastId = 0;

export async function GET() {
  try {
    // Hent siste værdata
    const latest = await db.select().from(weatherData).orderBy(desc(weatherData.id)).limit(1);

    if (latest.length === 0) {
      return NextResponse.json({ message: "No weather data yet" });
    }

    const item = latest[0];
    // Hvis vind > 50 og id er ny
    if (item.id > lastId && item.windSpeed > 50) {
      lastId = item.id;
      return NextResponse.json({
        alert: `Extreme wind detected: ${item.windSpeed} km/h`
      });
    }

    return NextResponse.json({ message: "No extreme weather detected" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

