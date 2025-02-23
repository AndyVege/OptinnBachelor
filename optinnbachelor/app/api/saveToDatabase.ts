import { db } from "@/db"; // Import the database connection
import { Kommune , Befolkning} from "@/db/schema";
import { fetchData } from "./fetchData";


export async function saveToDatabase(): Promise<boolean> {
  try {
    const apiData:any = await fetchData(); 

    const regionCodes = Object.keys(apiData.dimension.Region.category.label);
    const regionNames = apiData.dimension.Region.category.label;
    const years = Object.keys(apiData.dimension.Tid.category.label);
    const values = apiData.value;

    let index = 0;
    const kommuneData = [];
    const befolkningData = [];

    for (const regionCode of regionCodes) {
      kommuneData.push({
        postNr: regionCode,
        kommune: regionNames[regionCode],
      });

      for (const year of years) {
        befolkningData.push({
          postNr: regionCode,
          år: parseInt(year),
          antall: values[index] ?? 0,
        });
        index++;
      }
    }
    await db.delete(Befolkning);
    await db.delete(Kommune);


    await db.insert(Kommune).values(kommuneData).onConflictDoNothing();
    await db.insert(Befolkning).values(befolkningData).onConflictDoNothing();

    console.log("Data successfully inserted into the database.");
    return true
  } 
  catch (error) {
    console.error("Error inserting data:", error);
    return false
  }
}

saveToDatabase();
