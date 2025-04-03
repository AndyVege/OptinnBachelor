import { NextRequest, NextResponse } from "next/server";
import { dbGenerelt } from "@/db";
import { forecasts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");

  if (!locationId) {
    return NextResponse.json({ error: "locationId er påkrevd" }, { status: 400 });
  }

  const result = await dbGenerelt
    .select()
    .from(forecasts)
    .where(eq(forecasts.locationId, parseInt(locationId)));

  return NextResponse.json(result);
}