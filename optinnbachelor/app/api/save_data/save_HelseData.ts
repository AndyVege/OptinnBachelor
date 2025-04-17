import { dbHelse } from "@/db"; 
import { Sykefravaer } from "@/db/schemaHelse";
import { fetch_HelseData } from "../fetch_data/fetch_HelseData";
import { Kommune } from "@/db/schemaHelse";

type FetchedData = {
  dimension: {
    Region: { category: { label: Record<string, string> } };
    Kjonn: { category: { label: Record<string, string> } };
    Tid: { category: { label: Record<string, string> } };
  };
  value: number[];
};

export async function save_HelseData(): Promise<boolean> {
  try {
    console.log("🟡 Startet lagring av HelseData");
    const apiData: FetchedData | null = await fetch_HelseData();
    if (!apiData){ 
        console.log("❌ Ingen data fra fetch_HelseData");
        return false;
    }

    const regionCodes = Object.keys(apiData.dimension.Region.category.label);
    const tids = Object.keys(apiData.dimension.Tid.category.label);
    const values = apiData.value;

    console.log("Regioner:", regionCodes);
    console.log("Kvartaler:", tids);
    console.log("Verdier hentet:", values.length);  

    let index = 0;
    const helseEntries = [];

    for (const kommuneId of regionCodes) {
      for (const kvartalLabel of tids) {
        const menn = Number(values[index]);
        const kvinner = Number(values[index + 1]);


        const kvartal = kvartalLabel.replace("K", ""); // "2024K1" -> "20241"

        helseEntries.push({
          sykefravaerId: index,
          kommuneId,
          kvartal: parseInt(kvartal),
          antallMenn: menn ?? 0,
          antallKvinner: kvinner ?? 0,
        });

        index += 2;
      }
    }

    await dbHelse.insert(Kommune).values([
        { kommuneId: "3203", kommunenavn: "Asker" },
        { kommuneId: "0301", kommunenavn: "Oslo" },
        { kommuneId: "3301", kommunenavn: "Drammen" },
        { kommuneId: "3303", kommunenavn: "Kongsberg" },
        { kommuneId: "4601", kommunenavn: "Bergen" }
      ]).onConflictDoNothing();
      

    await dbHelse.insert(Sykefravaer).values(helseEntries).onConflictDoNothing();
    console.log("Helse data inserted successfully.");
    return true;
  } catch (error) {
    console.error("Error saving helse data:", error);
    return false;
  }
}
