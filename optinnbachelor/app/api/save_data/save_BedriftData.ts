import { db } from "@/db"; 
import { Bedrift } from "@/db/nsb/schema";
import { fetch_BedriftData } from "../fetch_data/fetch_BedriftData";

export async function save_BedriftData(): Promise<boolean> {
  try {
    const apiData: any = await fetch_BedriftData(); 

    const regionCodes = Object.keys(apiData.dimension.Region.category.label);
    const years = Object.keys(apiData.dimension.Tid.category.label);
    const values = apiData.value;

    let index=0;
    const bedriftData: any = [];

    for (const regionCode of regionCodes) {
      const formattedRegionCode = regionCode.replace(/-/g, "_");

      for (const year of years) {

        const totalbedrifter=values[index]
        const uoppgittbedrifter=values[index+90]

        const ansattFordeling_totalbedrifter : any = {
            "ingen_ansatt": values[index+10] ?? 0,
            "1-4_ansatt": values[index+20] ?? 0,
            "5-9_ansatt": values[index+30] ?? 0,
            "10-19_ansatt": values[index+40] ?? 0,
            "20-49_ansatt": values[index+50] ?? 0,
            "50-99_ansatt": values[index+60] ?? 0,
            "100-249_ansatt": values[index+70] ?? 0,
            "250+_ansatt": values[index+80] ?? 0,
          };

          const ansattFordeling_Uoppgittbedrifter : any = {
            "ingen_ansatt": values[index+100] ?? 0,
            "1-4_ansatt": values[index+110] ?? 0,
            "5-9_ansatt": values[index+120] ?? 0,
            "10-19_ansatt": values[index+130] ?? 0,
            "20-49_ansatt": values[index+140] ?? 0,
            "50-99_ansatt": values[index+150] ?? 0,
            "100-249_ansatt": values[index+160] ?? 0,
            "250+_ansatt": values[index+170] ?? 0,
          };
          const ansattFordeling={
            "No Employees": ["ingen_ansatt"].reduce((sum, key) => sum + (ansattFordeling_Uoppgittbedrifter[key] ?? 0) + (ansattFordeling_totalbedrifter[key] ?? 0), 0),
            "1-19 Employees":  ["1-4_ansatt", "5-9_ansatt","10-19_ansatt"].reduce((sum, key) => sum + (ansattFordeling_Uoppgittbedrifter[key] ?? 0) + (ansattFordeling_totalbedrifter[key] ?? 0), 0),
            "20-99 Employees": ["20-49_ansatt", "50-99_ansatt"].reduce((sum, key) => sum + (ansattFordeling_Uoppgittbedrifter[key] ?? 0) + (ansattFordeling_totalbedrifter[key] ?? 0), 0),
            "100+ Employees":  ["100-249_ansatt", "250+_ansatt"].reduce((sum, key) => sum + (ansattFordeling_Uoppgittbedrifter[key] ?? 0) + (ansattFordeling_totalbedrifter[key] ?? 0), 0),

          }

        bedriftData.push({
            bedriftId:index,
            kommuneId: formattedRegionCode,
            år: parseInt(year),
            antallBedrifter: totalbedrifter + uoppgittbedrifter ,
            fordeling: ansattFordeling,
        }); 
        index++
      }
      index += 170;  
    }

    await db.insert(Bedrift).values(bedriftData).onConflictDoNothing();
    console.log("Data successfully inserted into the database.");

    return true;
  } 
  catch (error) {
    console.error("Error inserting data:", error);
    return false
    ;
  }
}
