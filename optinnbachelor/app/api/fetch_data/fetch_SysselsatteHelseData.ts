export async function fetch_SysselsatteHelseData() {
    const url_Helse = "https://data.ssb.no/api/v0/no/table/07940/";
  
    const payload = {
      query: [
        {
          code: "Region",
          selection: {
            filter: "agg:KommSummer",
            values: ["K-3230", "K-0301", "K-3909"]
          }
        },
        {
          code: "UtdHelse",
          selection: {
            filter: "vs:UtdNivaa2",
            values: ["01", "02", "03"]
          }
        },
        {
          code: "Alder",
          selection: {
            filter: "item",
            values: ["999A"]
          }
        },
        {
          code: "NACE2007",
          selection: {
            filter: "item",
            values: ["86-87"]
          }
        },
        {
          code: "ContentsCode",
          selection: {
            filter: "item",
            values: ["Sysselsatte"]
          }
        },
        {
          code: "Tid",
          selection: {
            filter: "item",
            values: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"]
          }
        }
      ],
      response: {
        format: "json-stat2"
      }
    };
  
    try {
      const response = await fetch(url_Helse, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching SysselsatteHelse data:", error);
      return null;
    }
  }
  