export async function fetch_HelseData() {
    const url_Helse = "https://data.ssb.no/api/v0/no/table/12448/";
  
    const payload = {
      "query": [
        { "code": "Region", "selection": { "filter": "vs:Kommune", "values": ["3032", "0301", "3805"] } },
        { "code": "Kjonn", "selection": { "filter": "item", "values": ["2", "1"] } },
        { "code": "Alder", "selection": { "filter": "item", "values": ["00"] } },
        { "code": "ContentsCode", "selection": { "filter": "item", "values": ["Sykefraversprosent"] } },
        { "code": "Tid", "selection": { "filter": "item", "values": [
          "2020K1", "2020K2", "2020K3", "2020K4", "2021K1", "2021K2", "2021K3", "2021K4",
          "2022K1", "2022K2", "2022K3", "2022K4", "2023K1", "2023K2", "2023K3", "2023K4",
          "2024K1", "2024K2", "2024K3", "2024K4"
        ] } }
      ],
      "response": { "format": "json-stat2" }
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
  