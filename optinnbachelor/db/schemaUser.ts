import { pgTable, text,  integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters"
// Users Table
export const user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  salt:text("salt")
});
// Accounts Table
export const account = pgTable("account",  {
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
},
(account) => ({
  compositePk: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}))
