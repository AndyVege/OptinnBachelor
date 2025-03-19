import { db } from "@/db"; // Import the database connection
import { Kommune , Befolkning} from "@/db/nsb/schema";
import { fetch_BefolkningData } from "../fetch_data/fetch_BefolkningData";


export async function save_BefolkningData(): Promise<boolean> {
  try {
    const { data_Befolkning, data_Alderfordeling }: any = await fetch_BefolkningData();

      const regionCodes = Object.keys(data_Befolkning.dimension.Region.category.label);
      const regionNames = data_Befolkning.dimension.Region.category.label;
      const years = Object.keys(data_Befolkning.dimension.Tid.category.label);
      const values = data_Befolkning.value;
      const values_alder=data_Alderfordeling.value

      let index=0;
      let indexalder=0
      const kommuneData: any = [];
      const befolkningData: any = [];
  

      for (const regionCode of regionCodes) {
        kommuneData.push({
          kommuneId: regionCode,
          kommunenavn: regionNames[regionCode], 
        });

        for (const year of years) {
          const folkemengde = values[index] ?? 0; 
          const fodt = values[index+10] ?? 0;    
          const dode = values[index+20] ?? 0;    
          const aldersfordeling = {
            "0-15": values_alder[indexalder] ?? 0,
            "16-18": values_alder[indexalder+10] ?? 0,
            "19-34": values_alder[indexalder+20] ?? 0,
            "35-66": values_alder[indexalder+30] ?? 0,
            "67+": values_alder[indexalder+40] + values_alder[indexalder+50] ,
          };
          
          befolkningData.push({
            befolkningId:index,
            kommuneId: regionCode,
            år: parseInt(year),  
            antallBefolkning: folkemengde, 
            født: fodt,  
            døde: dode,  
            aldersfordeling:aldersfordeling ,  
          }); 
          index++
          indexalder++
        }
        index += 20;
        indexalder +=50;
        
      }
      
      await db.insert(Kommune).values(kommuneData).onConflictDoNothing();
      await db.insert(Befolkning).values(befolkningData).onConflictDoNothing();
  
      console.log("Data successfully inserted into the database.");
  
      return true;
    } 
    catch (error) {
      console.error("Error inserting data:", error);
      return false;
    }
  }

