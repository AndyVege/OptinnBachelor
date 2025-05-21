import { pgTable, serial, numeric, text, timestamp, integer } from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm"


// Table for locations
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Midlertidige steder: "Oslo", "Gjerdrum", "Larvik"
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
});

// Table for weather forecasts
export const forecasts = pgTable("forecasts", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").references(() => locations.id).notNull(),
  time: timestamp("time").notNull(),
  temperature: numeric("temperature"), // grader C
  windSpeed: numeric("wind_speed"), // m/s
  precipitation: numeric("precipitation"), // mm
  weatherSymbol: text("weather_symbol"), // MET Værsymbolerosv ugh
});