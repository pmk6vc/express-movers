import { sql } from "drizzle-orm";
import { boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { entitySchema } from "./EntitySchema";

const USER_TABLE = "user";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  address?: string;
  dateOfBirth?: string;
}

export const userTableDef = entitySchema.table(USER_TABLE, {
  uid: varchar("uid", { length: 128 }).primaryKey(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  profile: jsonb("profile").$type<UserProfile>().default({}).notNull(),
  persistedAt: timestamp("persisted_at")
    .default(sql`(now() at time zone 'utc')`)
    .notNull(),
  disabled: boolean("is_disabled").default(false).notNull(),
});

export type NewUser = typeof userTableDef.$inferInsert;
