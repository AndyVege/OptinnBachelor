import { NextResponse } from "next/server";
import { dbGenerelt } from "@/db";
import { locations } from "@/db/schema";

export async function GET() {
  const allLocations = await dbGenerelt.select().from(locations);
  return NextResponse.json(allLocations);
}