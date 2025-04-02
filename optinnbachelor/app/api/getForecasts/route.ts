import { NextResponse } from "next/server";
import { dbGenerelt } from "@/db"; 
import { forecasts, locations } from "@/db/schema"; 
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Hent alle stedene fra databasen
    const locationList = await dbGenerelt.select().from(locations);
    console.log("📍 Antall locations:", locationList.length);

    for (const location of locationList) {
      const lat = location.latitude as unknown as number;
      const lon = location.longitude as unknown as number;

      const response = await fetch(
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
        {
          headers: {
            "User-Agent": "OptinnBachelor/1.0 (s374187@oslomet.no)",
          },
        }
      );

      const data = await response.json();
      console.log("🌦️ Fikk forecast for", location.name, "-", data.properties.timeseries.length, "perioder");

      const weatherData = data.properties.timeseries.map((entry: any) => ({
        locationId: location.id,
        time: new Date(entry.time),
        temperature: entry.data.instant.details.air_temperature,
        windSpeed: entry.data.instant.details.wind_speed,
        precipitation: entry.data.next_1_hours?.details?.precipitation_amount || 0,
        weatherSymbol: entry.data.next_1_hours?.summary?.symbol_code || "unknown",
      }));

      // Sletter gamle forecasts for denne location
      await dbGenerelt.delete(forecasts).where(eq(forecasts.locationId, location.id));

      // Setter inn nye forecasts
      console.log("✅ Setter inn", weatherData.length, "rader for", location.name);
      await dbGenerelt.insert(forecasts).values(weatherData);
    }

    return NextResponse.json({ message: "Forecast-henting er vellykket." });
  } catch (error) {
    console.error("Feil ved henting av forecasts:", error);
    return NextResponse.json({ error: "Noe gikk galt under oppdatering av forecasts" }, { status: 500 });
  }
}