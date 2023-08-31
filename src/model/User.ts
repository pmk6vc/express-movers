import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const USER_TABLE = "user";
export const userTableDef = pgTable(USER_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }),
});

export type User = typeof userTableDef.$inferSelect;
export type NewUser = typeof userTableDef.$inferInsert;