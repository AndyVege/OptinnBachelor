import { NextResponse } from "next/server";
import { dbGenerelt } from "@/db";
import { Kommune,Befolkning, Bedrift} from "@/db/schema";
import { and, eq, gte, lte,desc} from "drizzle-orm";

async function getKommuneNames() {
  return await dbGenerelt.selectDistinct({
    kommuneNavn: Kommune.kommunenavn,
  })
  .from(Kommune)
}

async function getBedriftByLast5Years(year: number, kommune: string | null ) {
  const kommuneName = kommune ?? "";
  return await dbGenerelt
    .select({
      antallBedrifter: Bedrift.antallBedrifter,
      fordeling: Bedrift.fordeling,
      year: Bedrift.år, // Include the year in the response
    })
    .from(Bedrift)
    .innerJoin(Kommune, eq(Bedrift.kommuneId, Kommune.kommuneId))
    .where(
      and(
        gte(Bedrift.år, year - 4), // Year >= inputYear - 4
        lte(Bedrift.år, year), // Year <= inputYear
        eq(Kommune.kommunenavn, kommuneName) // Filter by kommune name
      )
    )
    .orderBy(Bedrift.år); // Order by year ascending
}
async function getBefolkningByLast5Years(year: number, kommune: string | null ) {
  const kommuneName = kommune ?? "";
  return await dbGenerelt
    .select({
      antallBefolkning: Befolkning.antallBefolkning,
      fordeling: Befolkning.aldersfordeling,
      year: Befolkning.år, // Include the year in the response
    })
    .from(Befolkning)
    .innerJoin(Kommune, eq(Befolkning.kommuneId, Kommune.kommuneId))
    .where(
      and(
        gte(Befolkning.år, year - 4), // Year >= inputYear - 4
        lte(Befolkning.år, year), // Year <= inputYear
        eq(Kommune.kommunenavn, kommuneName) // Filter by kommune name
      )
    )
    .orderBy(Befolkning.år); // Order by year ascending
}

async function getAllTheYears() {
  return await dbGenerelt
    .selectDistinct({ year: Befolkning.år }) // Selecting only the 'år' column
    .from(Befolkning)
    .orderBy(desc(Befolkning.år)); // Orders the years
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = Number(searchParams.get("year"));
    const kommune   = searchParams.get("kommune");
  
    const [kommuneNames, befolkningByLast5Years,allTheYears,bedriftByLast5Years] = await Promise.all([
      getKommuneNames(),
      getBefolkningByLast5Years(year,kommune),
      getAllTheYears(),
      getBedriftByLast5Years(year,kommune),
    ]);

    // Send the results back in one response
    return NextResponse.json({ kommuneNames, befolkningByLast5Years ,allTheYears, bedriftByLast5Years}, { status: 200 });
  } catch (error) {
    console.error(" Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
