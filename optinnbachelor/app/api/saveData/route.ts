import { NextResponse } from "next/server";
import { saveToDatabase } from "@/app/api/saveToDatabase";

export async function GET() {
  try {
    const success = await saveToDatabase();
    if (success) {
      return NextResponse.json({ message: "Data saved successfully!" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to save data." }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Error in API route:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
