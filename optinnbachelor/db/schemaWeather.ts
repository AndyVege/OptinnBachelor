import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  temperature: integer("temperature"),
  windSpeed: integer("windSpeed").notNull(),
  condition: text("condition"),
  priority: text("priority")
});
