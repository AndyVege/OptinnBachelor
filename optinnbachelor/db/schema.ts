import { pgTable, serial ,text, integer } from "drizzle-orm/pg-core";

// Define the Kommune table
export const Kommune = pgTable("kommune", {
  postNr: text("postNr").primaryKey(),
  kommune: text("kommune").notNull(),
});

// Define the Befolkning table with a foreign key reference to Kommune
export const Befolkning = pgTable("befolkning", {
  id: serial("id").primaryKey(),
  postNr: text("postNr").notNull().references(() => Kommune.postNr, { onDelete: "cascade" }),
  år: integer("år").notNull(),
  antall: integer("antall").notNull(),
});

