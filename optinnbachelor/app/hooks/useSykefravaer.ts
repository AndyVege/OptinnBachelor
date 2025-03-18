import { useState, useEffect } from 'react';
import { SykefravaerData } from './types';

const useSykefravaer = () => {
  const [data, setData] = useState<SykefravaerData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://data.ssb.no/api/v0/no/table/12452/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: [
              {
                code: "Kjonn",
                selection: {
                  filter: "item",
                  values: ["0"]
                }
              },
              {
                code: "Yrke",
                selection: {
                  filter: "vs:NYK08yrkeregsys1",
                  values: ["0-9"]
                }
              },
              {
                code: "Tid",
                selection: {
                  filter: "item",
                  values: ["2024K3"]
                }
              }
            ],
            response: {
              format: "json-stat2"
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();

        const formattedData: SykefravaerData[] = [
          {
            kvartal: rawData.dimension.Tid.category.label['2024K3'],
            sykefraversprosent: rawData.value[0] ?? 0,
            prosentEndring: rawData.value[1] ?? 0
          }
        ];

        setData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useSykefravaer;
