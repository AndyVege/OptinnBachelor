"use client";

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

export default function WeatherForecastModule() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/weather");
      const json = await res.json();
      // Sorter etter tid og vis kun de 3 første
      const sorted = json.sort(
        (a: Forecast, b: Forecast) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
      setForecasts(sorted.slice(0, 3));
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-[30px] shadow-md p-5 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Værmelding</h2>
      <div className="flex justify-around text-center">
        {forecasts.map((f, idx) => (
          <div key={idx} className="p-3 border rounded-xl shadow-sm w-1/4">
            <p className="font-semibold">
              {new Date(f.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p>🌡️ {f.temperature}°C</p>
            <p>💨 {f.windSpeed} m/s</p>
            <p>🌧️ {f.precipitation} mm</p>
          </div>
        ))}
      </div>
    </div>
  );
}