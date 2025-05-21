
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { weatherData } from "@/db/schemaWeather";
import { asc } from "drizzle-orm";
import { generateWeatherAlerts } from "@/lib/generateWeatherAlerts";

export async function GET() {
  // 1) Hent rå data
  const rows = await db
    .select()
    .from(weatherData)
    .orderBy(asc(weatherData.id));

  // 2) Generer et flat array av alle alerts
  const notifications = rows.flatMap((row) =>
    generateWeatherAlerts({
      id: row.id,
      temperature: row.temperature,
      windSpeed: row.windSpeed,
      condition: row.condition,
    }).map((alert, idx) => ({
      // unik ID slik at React kan key’e riktig
      id: `${row.id}-${alert.priority}-${idx}`,
      title: alert.title,
      description: alert.description,
      priority: alert.priority,
      category: alert.category,
      // gir frontenden noe å vise på dato
      timestamp: new Date().toISOString(),
    }))
  );

  return NextResponse.json({ notifications });
}
