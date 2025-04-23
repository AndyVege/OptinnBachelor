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

    // Flomnivåer
    if (item.condition?.toLowerCase().includes("flom")) {
      if (item.windSpeed >= 75) {
        alerts.push({
          title: "Flomvarsel – nivå 3",
          description: "Det er meldt om økt vannstand i elver og bekker i nærheten av din lokasjon.",
          priority: "high",
          category: "Vær",
        });
      } else if (item.windSpeed >= 50) {
        alerts.push({
          title: "Flomvarsel – nivå 2",
          description: "Forhøyet vannstand registrert. Følg med på lokale oppdateringer.",
          priority: "medium",
          category: "Vær",
        });
      } else {
        alerts.push({
          title: "Flomvarsel – nivå 1",
          description: "Normalt vannstandsnivå med liten risiko. Observer området ved endringer.",
          priority: "low",
          category: "Vær",
        });
      }
    }

    // Skrednivåer
    if (item.condition?.toLowerCase().includes("skred")) {
      if (item.windSpeed >= 75) {
        alerts.push({
          title: "Skredvarsel – nivå 3",
          description: "Høy fare for jord- eller snøskred. Unngå utsatte områder.",
          priority: "high",
          category: "Vær",
        });
      } else if (item.windSpeed >= 50) {
        alerts.push({
          title: "Skredvarsel – nivå 2",
          description: "Moderat fare for skred. Vær aktsom i skråninger og bratt terreng.",
          priority: "medium",
          category: "Vær",
        });
      } else {
        alerts.push({
          title: "Skredvarsel – nivå 1",
          description: "Lite sannsynlighet for skred. Normale forhold i området.",
          priority: "low",
          category: "Vær",
        });
      }
    }

    // Skogbrannnivåer
    if (item.condition?.toLowerCase().includes("skogbrann")) {
      if (item.windSpeed >= 75) {
        alerts.push({
          title: "Skogbrannfare – nivå 3",
          description: "Ekstrem fare for skogbrann grunnet høy temperatur og sterk vind. Unngå all åpen ild.",
          priority: "high",
          category: "Vær",
        });
      } else if (item.windSpeed >= 50) {
        alerts.push({
          title: "Skogbrannfare – nivå 2",
          description: "Moderat fare for skogbrann. Unngå grilling og bål i skog og utmark.",
          priority: "medium",
          category: "Vær",
        });
      } else {
        alerts.push({
          title: "Skogbrannfare – nivå 1",
          description: "Liten risiko for skogbrann. Vis vanlig forsiktighet med ild utendørs.",
          priority: "low",
          category: "Vær",
        });
      }
    }

    if (alerts.length === 0) {
      return NextResponse.json({ message: "No extreme weather detected" });
    }

    return NextResponse.json({ alerts });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
