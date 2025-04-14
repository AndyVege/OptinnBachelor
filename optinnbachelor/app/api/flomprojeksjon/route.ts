// app/api/flomprojeksjon/route.ts

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import csv from "csvtojson";

// GET /api/flomprojeksjon
export async function GET() {
  try {
    // Finn mappen "data" i prosjektets rot
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "latest_projisert_flom.csv");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: "Ingen projiserte flomdata funnet." },
        { status: 404 }
      );
    }

    // Konverter CSV til JSON
    const jsonArray = await csv().fromFile(filePath);

    return NextResponse.json(jsonArray);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Feil ved henting av data", error: error.message },
      { status: 500 }
    );
  }
}
