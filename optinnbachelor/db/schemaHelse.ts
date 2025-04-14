import { integer, varchar, numeric, pgTable } from "drizzle-orm/pg-core"

export const Kommune = pgTable("Kommune", {
    kommuneId: varchar("kommuneId").notNull().primaryKey(),
    kommunenavn: varchar("kommunenavn").notNull(),
  });

  export const Sykefravaer = pgTable("Sykefravaer", {
    sykefravaerId: integer("sykefravaer_id").primaryKey(),
    kommuneId: varchar("kommuneId").references(() => Kommune.kommuneId, { onDelete: "cascade" }).notNull(),
    antallMenn: numeric("antallMenn").notNull().$type<number>(),     // 👈 merk dette!
    antallKvinner: numeric("antallKvinner").notNull().$type<number>(), // 👈 og dette!
    kvartal: integer("kvartal").notNull(),
  });

  export const SysselsatteHelse = pgTable("SysselsatteHelse", {
    sysselsatteHelseId: integer("sysselsatte_helse_id").primaryKey(),
    kommuneId: varchar("kommuneId").references(() => Kommune.kommuneId, { onDelete: "cascade" }).notNull(),
    år: integer("år").notNull(),
    utdanningsnivå: varchar("utdanningsnivå").notNull(), // F.eks. "01", "02", "03"
    antallSysselsatte: integer("antall_sysselsatte").notNull()
  });
  
