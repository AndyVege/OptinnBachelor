// lib/generateWeatherAlerts.ts
import {
  WEATHER_ALERTS_CONFIG,
  Priority,
  WeatherAlertConfig,
} from "./weatherAlertsConfig";

export interface WeatherDataRow {
  id: number;
  temperature: number | null;
  windSpeed: number;
  condition: string | null;
}

export interface WeatherAlert {
  title: string;
  description: string;
  priority: Priority;
  category: "Vær";
}

export function generateWeatherAlerts(item: WeatherDataRow): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const cond = item.condition?.toLowerCase() ?? "";
  const wind = item.windSpeed;
  const temp = item.temperature ?? 0;

  for (const cfg of WEATHER_ALERTS_CONFIG) {
    if (!cond.includes(cfg.keyword)) continue;

    // 1) Beregn nivå fra vind
    let level: Priority;
    if (wind >= cfg.thresholds.windSpeed.high) level = "high";
    else if (wind >= cfg.thresholds.windSpeed.medium) level = "medium";
    else level = "low";

    // 2) Hvis cfg har temperatur‐terskler, vurder også dem
    if (cfg.thresholds.temperature) {
      const thT = cfg.thresholds.temperature;
      const levelT: Priority =
        temp >= thT.high
          ? "high"
          : temp >= thT.medium
          ? "medium"
          : "low";
      // Bruk høyeste av vind‐ og temperatur‐nivå
      if (
        (levelT === "high" && level !== "high") ||
        (levelT === "medium" && level === "low")
      ) {
        level = levelT;
      }
    }

    const idx = level === "high" ? 3 : level === "medium" ? 2 : 1;
    alerts.push({
      title: `${cfg.name} – nivå ${idx}`,
      description: cfg.descriptions[level],
      priority: level,
      category: "Vær",
    });
  }

  return alerts;
}
