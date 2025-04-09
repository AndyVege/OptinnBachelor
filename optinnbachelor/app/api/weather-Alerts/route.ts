import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { weatherData } from "@/lib/schema";


let lastWeatherId = 0; // Store last processed ID

export async function GET() {
  try {
    // Fetch the latest weather record
    const latestWeather = await db
      .select()
      .from(weatherData)
      .orderBy(weatherData.id.desc())
      .limit(1);

    if (!latestWeather.length) {
      return NextResponse.json({ message: "No data yet" });
    }

    const latestEntry = latestWeather[0];

    // If new data and wind speed > 50, send alert
    if (latestEntry.id > lastWeatherId && latestEntry.windSpeed > 50) {
      lastWeatherId = latestEntry.id; // Update last processed ID
      return NextResponse.json({
        alert: `🌪️ Extreme wind detected: ${latestEntry.windSpeed} km/h`,
      });
    }

    return NextResponse.json({ message: "No extreme weather detected" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}
