"use client";
import LinkVidere from "./linkVidere";
import { useEffect, useState } from "react";

type Forecast = {
  id: number;
  locationId: number;
  time: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  weatherSymbol: string;
};

export default function WeatherForecastModule({ locationId }: { locationId: number | null }) {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;

      // Hent data fra eksternt API og lagre i databasen
      
      await fetch(`/api/getForecasts?locationId=${locationId}`);

      const res = await fetch(`/api/weather?locationId=${locationId}`);
      const json = await res.json();

      const sorted = json.sort(
        (a: Forecast, b: Forecast) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );

      const now = new Date();
      const forecastsByHour = [0, 4, 8].map(offset => {
        return sorted.find(f => {
          const forecastTime = new Date(f.time);
          const targetTime = new Date(now.getTime() + offset * 60 * 60 * 1000);
          return Math.abs(forecastTime.getTime() - targetTime.getTime()) < 60 * 60 * 1000;
        });
      }).filter(Boolean) as Forecast[];

      setForecasts(forecastsByHour);
    };

    fetchData();
  }, [locationId]);

  return (
    <div className="relative bg-white rounded-[30px] shadow-md p-5 w-1/3 max-w-md">
      <div className="absolute top-5 right-5">
        
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Værmelding</h2>
      <div className="flex justify-around text-center">
        {forecasts.map((f, idx) => (
          <div key={idx} className="p-3 border rounded-xl shadow-sm w-1/3 mx-1 transition-shadow duration-300 hover:shadow-md">
            <p className="font-semibold">
              {new Date(f.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <img
              src={`https://api.met.no/images/weathericons/svg/${f.weatherSymbol}.svg`}
              alt={f.weatherSymbol}
              className="w-10 h-10 mx-auto mb-2"
            />
            <p>{Math.round(f.temperature)}°C</p>
            <p>{f.windSpeed} m/s</p>
            <p>{f.precipitation} mm</p>
          </div>
        ))}
      </div>
    </div>
  );
}