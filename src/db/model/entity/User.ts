import { sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/pg-core";
import { entitySchema } from "./EntitySchema";

const USER_TABLE = "user";

export const userTableDef = entitySchema.table(USER_TABLE, {
  uid: varchar("uid", { length: 128 }).primaryKey(),
  persistedAt: timestamp("persisted_at")
    .default(sql`(now() at time zone 'utc')`)
    .notNull(),
});

export type NewUser = typeof userTableDef.$inferInsert;
