"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

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
  const [openInfo, setOpenInfo] = useState<string | null>(null);

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
        return sorted.find((f: Forecast) => {
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
      <div className="relative bg-white rounded-[30px] shadow-md pt-5 px-5 pb-1 w-1/2 max-w-3xl">
      <div className="relative mb-4">
        <FontAwesomeIcon 
          icon={faCircleInfo} 
          className="absolute right-0 top-0 w-5 h-5 cursor-pointer" 
          onClick={() => setOpenInfo(openInfo === "weather" ? null : "weather")}
        />
        {openInfo === "weather" && (
          <div className="absolute top-5 right-3 z-50 bg-[#1E3528] text-white p-4 rounded-[8px] shadow-lg w-150 text-sm">
            <a href="https://api.met.no">{"Data hentet fra MET API"}</a>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-4 text-center">Værmelding</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
        {forecasts.map((f, idx) => (
          <div key={idx} className="pt-5 px-3 pb-2 border rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-md h-[232px]">
            <p className="font-semibold text-xl">
              {new Date(f.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <img
              src={`https://api.met.no/images/weathericons/svg/${f.weatherSymbol}.svg`}
              alt={f.weatherSymbol}
              className="w-14 h-14 mx-auto mb-2"
            />
            <div className="text-lg">
              <p>{Math.round(f.temperature)}°C</p>
              <p>{f.windSpeed} m/s</p>
              <p>{f.precipitation} mm</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}