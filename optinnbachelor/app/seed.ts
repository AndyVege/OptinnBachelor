import "dotenv/config";
import { dbGenerelt } from "@/db";
import { locations } from "@/db/schema";

async function seedLocations() {
  await dbGenerelt.insert(locations).values([
    {
      id: 1,
      name: "Oslo",
      latitude: 59.9139,
      longitude: 10.7522,
    },
    {
      id: 2,
      name: "Gjerdrum",
      latitude: 60.0617,
      longitude: 11.0364,
    },
    {
      id: 3,
      name: "Larvik",
      latitude: 59.0533,
      longitude: 10.0352,
    },
  ]);

  console.log("🗺️ Locations lagt inn!");
}

seedLocations();