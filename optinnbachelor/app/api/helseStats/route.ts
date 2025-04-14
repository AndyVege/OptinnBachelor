import { NextResponse } from "next/server";
import { dbHelse } from "@/db";
import { Sykefravaer } from "@/db/schemaHelse";
import { eq, and } from "drizzle-orm";

// GET /api/helseStats?kommune=0301&kvartal=20244
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kommune = searchParams.get("kommune");
  const kvartal = searchParams.get("kvartal");

  if (!kommune || !kvartal) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const data = await dbHelse
      .select()
      .from(Sykefravaer)
      .where(
        and(
          eq(Sykefravaer.kommuneId, kommune),
          eq(Sykefravaer.kvartal, parseInt(kvartal))
        )
      );

    return NextResponse.json({ sykefravaer: data });
  } catch (error) {
    console.error("Error fetching sykefravær data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
