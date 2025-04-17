import { NextResponse } from "next/server";
import { dbHelse } from "@/db";
import { SysselsatteHelse } from "@/db/schemaHelse";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kommune = searchParams.get("kommune");

  if (!kommune) {
    return NextResponse.json({ error: "Missing kommune parameter" }, { status: 400 });
  }

  try {
    const data = await dbHelse
      .select()
      .from(SysselsatteHelse)
      .where(eq(SysselsatteHelse.kommuneId, kommune));

    return NextResponse.json({ sysselsatteHelse: data });
  } catch (error) {
    console.error("Error fetching sysselsatteHelse data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
