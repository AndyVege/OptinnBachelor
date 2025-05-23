import { dbHelse } from "@/db";
import { SysselsatteHelse } from "@/db/schemaHelse";
import { fetch_SysselsatteHelseData } from "../fetch_data/fetch_SysselsatteHelseData";
import { Kommune } from "@/db/schemaHelse";

type FetchedData = {
  dimension: {
    Region: { category: { label: Record<string, string> } };
    UtdHelse: { category: { label: Record<string, string> } };
    Tid: { category: { label: Record<string, string> } };
  };
  value: number[];
};

export async function save_SysselsatteHelseData(): Promise<boolean> {
  try {
    const apiData: FetchedData | null = await fetch_SysselsatteHelseData();
    if (!apiData) return false;

    const regionCodes = Object.keys(apiData.dimension.Region.category.label); 
    const utdanningLevels = Object.keys(apiData.dimension.UtdHelse.category.label); 
    const years = Object.keys(apiData.dimension.Tid.category.label);

    const values = apiData.value;
    const dataToInsert = [];

    let index = 0;

    for (const regionCode of regionCodes) {
      const kommuneId = regionCode.replace("K-", ""); 

      for (const utd of utdanningLevels) {
        for (const year of years) {
          const antall = values[index] ?? 0;

          dataToInsert.push({
            sysselsatteHelseId: index,
            kommuneId,
            utdanningsnivå: utd,
            år: parseInt(year),
            antallSysselsatte: antall
          });

          index++;
        }
      }
    }

    await dbHelse.insert(Kommune).values([
      { kommuneId: "3203", kommunenavn: "Asker" },
      { kommuneId: "0301", kommunenavn: "Oslo" },
      { kommuneId: "3301", kommunenavn: "Drammen" },
      { kommuneId: "3303", kommunenavn: "Kongsberg" },
      { kommuneId: "4601", kommunenavn: "Bergen" },
    ]).onConflictDoNothing();

    await dbHelse.insert(SysselsatteHelse).values(dataToInsert).onConflictDoNothing();
    console.log("SysselsatteHelse data saved successfully.");
    return true;
  } catch (error) {
    console.error("Error saving SysselsatteHelse data:", error);
    return false;
  }
}
