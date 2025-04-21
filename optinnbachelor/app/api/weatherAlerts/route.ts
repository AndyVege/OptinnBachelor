import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { weatherData } from "@/db/schemaWeather";
import { desc } from "drizzle-orm";

let lastId = 0;

export async function GET() {
  try {
    const latest = await db.select().from(weatherData).orderBy(desc(weatherData.id)).limit(1);

    if (latest.length === 0) {
      return NextResponse.json({ message: "No weather data yet" });
    }

    const item = latest[0];

    if (item.id <= lastId) {
      return NextResponse.json({ message: "No new data" });
    }

    lastId = item.id;

    const alerts = [];

    if (item.windSpeed > 50) {
      alerts.push({
        title: "Kraftig vind – nivå 2",
        description: `Sterk vind registrert: ${item.windSpeed} km/h. Ta forholdsregler.`,
        priority: "high",
        category: "Vær",
      });
    }

    if (item.condition?.toLowerCase().includes("flom")) {
      alerts.push({
        title: "Flomfare – nivå 3",
        description: "Kraftig nedbør har ført til økt vannstand.",
        priority: "high",
        category: "Vær",
      });
    }

    if (item.condition?.toLowerCase().includes("skred")) {
      alerts.push({
        title: "Skredfare – nivå 2",
        description: "Fare for jord- eller snøskred i området.",
        priority: "high",
        category: "Vær",
      });
    }

    if (alerts.length === 0) {
      return NextResponse.json({ message: "No extreme weather detected" });
    }

    return NextResponse.json({ alerts });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
