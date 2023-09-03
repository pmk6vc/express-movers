import { sql } from "drizzle-orm";
import { pgEnum, uuid } from "drizzle-orm/pg-core";
import { authSchema } from "./AuthSchema";

const ROLE_TABLE = "role";
export const roleEnum = pgEnum("role", [
  "MOVING_CUSTOMER",
  "MOVING_CUSTOMER_VIEWER",
  "MOVING_BUSINESS_EMPLOYEE",
  "MOVING_BUSINESS_ADMIN",
  "SUPER_USER",
]);
export const roleTableDef = authSchema.table(ROLE_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  role: roleEnum("role").notNull().unique(),
});

export type Role = typeof roleTableDef.$inferSelect;
export type NewRole = typeof roleTableDef.$inferInsert;
