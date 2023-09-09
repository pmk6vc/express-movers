import { sql } from "drizzle-orm";
import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { entitySchema } from "./EntitySchema";

const ORGANIZATION_TABLE = "organization";

export const orgTableDef = entitySchema.table(ORGANIZATION_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  persistedAt: timestamp("persisted_at")
    .default(sql`now() at time zone 'utc'`)
    .notNull(),
});
