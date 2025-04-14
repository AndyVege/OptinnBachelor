"use client";

import React, { useEffect, useState } from "react";

interface FlomData {
  dato: string;
  flomsannsynlighet: string; // Merk: CSV-data blir ofte lest som string
}

export default function FlomProjeksjon() {
  const [data, setData] = useState<FlomData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/flomprojeksjon");
        if (!res.ok) {
          throw new Error("Feil ved henting av flomprojeksjonsdata");
        }
        const json: FlomData[] = await res.json();
        // Sorter dataene etter flomsannsynlighet (høyeste først)
        const sorted = json.sort(
          (a, b) => Number(b.flomsannsynlighet) - Number(a.flomsannsynlighet)
        );
        // Ta topp 10 dagene
        setData(sorted.slice(0, 10));
      } catch (error) {
        console.error("Henting av flomprojeksjonsdata feilet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Laster flomprojeksjon...</div>;

  if (data.length === 0) return <div>Ingen flomprojeksjonsdata tilgjengelig.</div>;

  return (
    <div className="bg-blue-50 rounded-lg p-4 mt-4">
      <h3 className="text-xl font-bold mb-2">Topp 10 projiserte flomdager</h3>
      <ul>
        {data.map((item, idx) => (
          <li key={idx} className="border-b py-2">
            <strong>{new Date(item.dato).toLocaleDateString()}</strong> –{" "}
            {(Number(item.flomsannsynlighet) * 100).toFixed(2)}% sannsynlighet
          </li>
        ))}
      </ul>
    </div>
  );
}
