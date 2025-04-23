import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";


// Example weather data schema
export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  temperature: integer("temperature"),
  windSpeed: integer("wind_speed"),
  condition: text("condition"),
});
