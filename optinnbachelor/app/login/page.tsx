"use client";

import { Kommune } from "@/db/schema";
import { useEffect, useState } from "react";

// Define a type for the data structure
interface BefolkningStats {
  postNr: number;
  år: number;
  antall:number
  kommuneNavn:string
  id:number
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<BefolkningStats[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data: BefolkningStats[]) => setStats(data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  return (
    <div>
      <h1>Top 5 Kommuner med flest bedrifter</h1>
      <ul>
        {stats.map((kommune) => (
          <li key={kommune.id}>
            {kommune.kommuneNavn }: antall:{kommune.antall}
          </li>
        ))}
      </ul>
    </div>
  );
}
