
export type Priority = "low" | "medium" | "high";

export interface WeatherAlertConfig {
  name: string;
  keyword: string;
  descriptions: {
    low: string;
    medium: string;
    high: string;
  };
  thresholds: {
    windSpeed: { high: number; medium: number };
    temperature?: { high: number; medium: number };
  };
}

export const WEATHER_ALERTS_CONFIG: WeatherAlertConfig[] = [
  {
    name: "Flomvarsel",
    keyword: "flom",
    descriptions: {
      low: "Normalt vannstandsnivå med liten risiko. Observer området ved endringer.",
      medium: "Forhøyet vannstand registrert. Følg med på lokale oppdateringer.",
      high: "Det er meldt om økt vannstand i elver og bekker i nærheten av din lokasjon.",
    },
    thresholds: { windSpeed: { high: 75, medium: 50 } },
  },
  {
    name: "Skredvarsel",
    keyword: "skred",
    descriptions: {
      low: "Lite sannsynlighet for skred. Normale forhold i området.",
      medium: "Moderat fare for skred. Vær aktsom i skråninger og bratt terreng.",
      high: "Høy fare for jord- eller snøskred. Unngå utsatte områder.",
    },
    thresholds: { windSpeed: { high: 75, medium: 50 } },
  },
  {
    name: "Skogbrannfare",
    keyword: "skogbrann",
    descriptions: {
      low: "Liten risiko for skogbrann. Vis vanlig forsiktighet med ild utendørs.",
      medium: "Moderat fare for skogbrann. Unngå grilling og bål i skog og utmark.",
      high: "Ekstrem fare for skogbrann grunnet høy temperatur og sterk vind. Unngå all åpen ild.",
    },
    thresholds: {
      windSpeed: { high: 75, medium: 50 },
      temperature: { high: 30, medium: 20 },
    },
  },


];
