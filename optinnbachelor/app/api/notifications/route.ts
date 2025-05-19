
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { weatherData } from "@/db/schemaWeather";
import { asc } from "drizzle-orm";

export async function GET() {
  const all = await db
    .select()
    .from(weatherData)
    .orderBy(asc(weatherData.id));
  return NextResponse.json({ notifications: all });
}
