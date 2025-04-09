import { pgTable, serial, numeric, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm"



// MET Tables:

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

// Table for weather data for notifications

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  temperature: integer("temperature").notNull(),
  windSpeed: integer("wind_speed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SSB Tables:

export const Kommune = pgTable("Kommune", {
  kommuneId: varchar("kommuneId").notNull().primaryKey(),
  kommunenavn: varchar("kommunenavn").notNull(),
});

export const Befolkning = pgTable("Befolkning", {
  befolkningId: integer("befolkning_id").primaryKey(),
  kommuneId: varchar("kommuneId").references(() => Kommune.kommuneId, { onDelete: "cascade" }).notNull(),
  år: integer("år").notNull(),
  antallBefolkning: integer("antall_befolkning").notNull(),
  født: integer("født").notNull(),
  døde: integer("døde").notNull(),
  aldersfordeling: jsonb("aldersfordeling"),
});

export const Bedrift = pgTable("Bedrift", {
  bedriftId: integer("bedriftId").primaryKey(),
  kommuneId: varchar("kommuneId").references(() => Kommune.kommuneId, { onDelete: "cascade" }).notNull(),
  år: integer("år").notNull(),
  antallBedrifter: integer("antallBedrifter").notNull(),
  fordeling: jsonb("fordeling").notNull(),
});

export const Arbeidsledighet = pgTable("Arbeidsledighet", {
  arbeidsledighetId: integer("arbeidsledighet_id").primaryKey(),
  kommuneId: varchar("kommuneId").references(() => Kommune.kommuneId, { onDelete: "cascade" }).notNull(),
  år: integer("år").notNull(),
  antallArbeidsledighet: integer("antallArbeidsledighet").notNull(),
  antallMenn: integer("antallMenn").notNull(),
  antallKvinner: integer("antallKvinner").notNull(),
  aldersfordeling: jsonb("aldersfordeling").notNull(),
});
