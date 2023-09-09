import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orgTableDef } from "./Organization";
import { rolesTableDef } from "./Roles";

const USER_TABLE = "user";

export const userTableDef = pgTable(USER_TABLE, {
  uid: varchar("uid", { length: 128 }).primaryKey(),
  roleId: uuid("role_id")
    .references(() => rolesTableDef.id, {
      onUpdate: "cascade",
      onDelete: "restrict",
    })
    .notNull(),
  organizationId: uuid("organization_id").references(() => orgTableDef.id, {
    onUpdate: "cascade",
    onDelete: "restrict",
  }),
  persistedAt: timestamp("persisted_at")
    .default(sql`(now() at time zone 'utc')`)
    .notNull(),
});

export type NewUser = typeof userTableDef.$inferInsert;
