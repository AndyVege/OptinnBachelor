import { NextResponse } from "next/server";
import { db } from "@/db";
import { Kommune,Befolkning} from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db.select({
    postNr: Befolkning.postNr,
    år: Befolkning.år,
    antall: Befolkning.antall,
    kommuneNavn: Kommune.kommune,
    id: Befolkning.id,
  })
  .from(Befolkning)
  .innerJoin(Kommune, eq(Befolkning.postNr, Kommune.postNr))
  .where(
    eq(
      Befolkning.antall,
      db
        .select({ maxAntall: sql`MAX(${Befolkning.antall})` })
        .from(Befolkning)
        .where(eq(Befolkning.postNr, Kommune.postNr))
    )
  )
  .orderBy(Kommune.kommune);


    console.log("Fetched Data:", results);
    // Deletes all records from the table

    return NextResponse.json(results, { status: 200 });
  } 
  catch (error) {
    console.error("❌ Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
