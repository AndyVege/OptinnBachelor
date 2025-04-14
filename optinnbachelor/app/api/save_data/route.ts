import { NextResponse } from "next/server";
import { save_BefolkningData } from "@/app/api/save_data/save_BefolkningData";
import { save_BedriftData } from "./save_BedriftData";
import { save_HelseData } from "./save_HelseData";
import { save_SysselsatteHelseData } from "./save_SysselsatteHelseData"; // 👈 ny import

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

    // Save Helse Data
    const success_HelseData = await save_HelseData();
    if (!success_HelseData) {
      return NextResponse.json({ error: "Failed to save Helse data." }, { status: 500 });
    }

    // Save Sysselsatte i Helse- og sosialnæringer Data
    const success_SysselsatteHelse = await save_SysselsatteHelseData();
    if (!success_SysselsatteHelse) {
      return NextResponse.json({ error: "Failed to save SysselsatteHelse data." }, { status: 500 });
    }

    return NextResponse.json({ message: "All data saved successfully!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in API route:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
