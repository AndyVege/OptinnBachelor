
import { NextResponse } from "next/server";
import { dbGenerelt } from "@/db";
import { forecasts } from "@/db/schema";

export async function GET() {
  const result = await dbGenerelt.select().from(forecasts).limit(20); // ev. .orderBy(...) og join med locations
  return NextResponse.json(result);
}