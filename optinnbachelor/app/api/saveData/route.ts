import { NextResponse } from "next/server";
import { save_BefolkningData } from "@/app/api/save_data/save_BefolkningData";
import { save_BedriftData } from "../save_data/save_BedriftData";

export async function GET() {
  try {
    // Save Befolkning Data
    const success_Befolkning = await save_BefolkningData();
    if (!success_Befolkning) {
      return NextResponse.json({ error: "Failed to save Befolkning data." }, { status: 500 });
    }

    // Save Bedrift Data
    const success_BedriftData = await save_BedriftData();
    if (!success_BedriftData) {
      return NextResponse.json({ error: "Failed to save Bedrift data." }, { status: 500 });
    }

    // If both saves are successful
    return NextResponse.json({ message: "Data saved successfully!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in API route:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
