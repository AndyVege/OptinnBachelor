import { pgTable, serial, varchar, integer, jsonb, timestamp, text} from "drizzle-orm/pg-core";

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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  // Store hashed passwords here (never plaintext!)
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
