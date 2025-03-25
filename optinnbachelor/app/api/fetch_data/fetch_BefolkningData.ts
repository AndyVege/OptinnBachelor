type FetchedData = {
  data_Befolkning: {
    dimension: {
      Region: {
        category: {
          label: Record<string, string>;
        };
      };
      Tid: {
        category: {
          label: Record<string, string>; 
        };
      };
    };
    value: number[];
  };
  data_Alderfordeling: {
    dimension: {
      Region: {
        category: {
          label: Record<string, string>;
        };
      };
      Tid: {
        category: {
          label: Record<string, string>; 
        };
      };
    };
    value: number[];
  };

};
export async function fetch_BefolkningData(): Promise<FetchedData> {
  const url_Befolkning = "https://data.ssb.no/api/v0/no/table/06913/";
  const url_Alderfordelig="https://data.ssb.no/api/v0/no/table/07459/";
    
  const payload_Alderfordeling = {
    query: [
      { code: "Region", selection: { filter: "agg:KommSummer", values: [ "K-3203", "K-0301", "K-3301", "K-3303", "K-4601" ] } },
      { code: "Alder", selection: { filter: "agg:Funksjonell6a", values: [ "F340", "F341", "F342", "F343", "F344", "F345" ] } },
      { code: "Tid", selection: { filter: "item", values: [ "2016", "2017", "2018","2019","2020","2021","2022","2023","2024","2025" ] } },
    ],
    response: { format: "json-stat2"},
  };
        
  const payload_Befolkning = {
    query: [
      { code: "Region", selection: { filter: "agg:KommSummerHist", values: ["K_3203", "K_0301", "K_3301","K_3303", "K_4601"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["Folkemengde", "Levende", "Dode"] } },
      { code: "Tid", selection: { filter: "item", values: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]} }
      ],
      response: { format: "json-stat2" }
  };
    
  try {
    const [response_Befolkning, response_Alderfordeling] = await Promise.all([
      fetch(url_Befolkning, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload_Befolkning),
        }),
      fetch(url_Alderfordelig, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload_Alderfordeling),
        })
    ]);
  
  
    const [data_Befolkning, data_Alderfordeling] = await Promise.all([
        response_Befolkning.json(),
        response_Alderfordeling.json(),
      ]);

    return {data_Befolkning,data_Alderfordeling} as FetchedData
    
      } 
  catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch population data");
  }
}
    