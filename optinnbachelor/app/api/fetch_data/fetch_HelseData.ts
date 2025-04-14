export async function fetch_HelseData() {
    const url_Helse = "https://data.ssb.no/api/v0/no/table/12451/";

const payload = {
  query: [
    {
      code: "Region",
      selection: {
        filter: "agg_single:KommGjeldende",
        values: ["3203", "0301", "3301", "3303", "4601"]
      }
    },
    {
      code: "Kjonn",
      selection: {
        filter: "item",
        values: ["2", "1"]
      }
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["Sykefraversprosent"]
      }
    },
    {
      code: "Tid",
      selection: {
        filter: "item",
        values: [
          "2024K1",
          "2024K2",
          "2024K3",
          "2024K4"
        ]
      }
    }
  ],
  response: { format: "json-stat2" }
};

      
  
    try {
      const response = await fetch(url_Helse, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  