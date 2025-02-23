import { NextRequest, NextResponse } from "next/server";

export async function fetchData() {
  const url = "https://data.ssb.no/api/v0/no/table/06913";

  const payload = {
    query: [
      { code: "Region",selection: {filter: "agg:KommSummerHist",values: ["K_3203", "K_0301", "K_3301", "K_4601", "K_5001"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["Folkemengde"] } },
      { code: "Tid", selection: { filter: "item", values: ["2015","2016","2017","2018","2019","2020","2021","2022","2023","2024"] } }
    ],
    response: { format: "json-stat2" }
  };
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data

  } catch (error) {
    console.error(" Error fetching data:", error);
    return error
  }
}
