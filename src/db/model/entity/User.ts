import { sql } from "drizzle-orm";
import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { rolesTableDef } from "../auth/Roles";
import { entitySchema } from "./EntitySchema";
import { orgTableDef } from "./Organization";

const USER_TABLE = "user";

export const userTableDef = entitySchema.table(USER_TABLE, {
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
    .default(sql`now() at time zone 'utc'`)
    .notNull(),
});

export type NewUser = typeof userTableDef.$inferInsert;
