import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { weatherData } from "@/db/schemaWeather";
import { desc } from "drizzle-orm";
import { generateWeatherAlerts } from "@/lib/generateWeatherAlerts";

export async function GET() {
  try {
    const latest = await db
      .select()
      .from(weatherData)
      .orderBy(desc(weatherData.id))
      .limit(1);

    if (latest.length === 0) {
      return NextResponse.json({ alerts: [] });
    }

    const item = latest[0];
    const rawAlerts = generateWeatherAlerts(item);

    // Attach a stable id per alert so we can dedupe in the hook
    const alerts = rawAlerts.map((alert, idx) => ({
      // e.g. "123-flom", "123-skred", etc.
      id: `${item.id}-${alert.title.replace(/\s+/g, "_")}`,  
      ...alert,
    }));

    return NextResponse.json({ alerts });
  } catch (err) {
    console.error("weatherAlerts error:", err);
    return NextResponse.json({ alerts: [] }, { status: 500 });
  }
}
