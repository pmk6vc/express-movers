import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const ORGANIZATION_TABLE = "organization";

export const orgTableDef = pgTable(ORGANIZATION_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  persistedAt: timestamp("persisted_at")
    .default(sql`(now() at time zone 'utc')`)
    .notNull(),
});
