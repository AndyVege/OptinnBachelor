import { NextResponse } from "next/server";

export async function POST() {
    const url_Bedrift = "https://data.ssb.no/api/v0/no/table/07091/";
 
    const payload_BedriftData = {
        "query": [
          { "code": "Region", "selection": { "filter": "agg:KommSummer", "values": ["K-3203", "K-0301", "K-3301", "K-3303", "K-4601"] } },
          { "code": "NACE2007", "selection": { "filter": "item", "values": ["01-99", "00"] } },
          { "code": "AntAnsatte", "selection": { "filter": "item", "values": ["99", "00", "01", "02", "03", "04", "05", "15", "16"] } },
          { "code": "Tid", "selection": { "filter": "item", "values": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"] } }
        ],
        "response": { "format": "json-stat2" }
      }
      
    try {
        const api_BedriftData = await fetch(url_Bedrift, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload_BedriftData),
            })

        if (!api_BedriftData.ok) {
            throw new Error( 'HTTP error! Status: ${api_BedriftData.status}');
            }
          
        const data_bedrift = await api_BedriftData.json(); 
       return NextResponse.json(data_bedrift)

    } 
    catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}