import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { convertStringEnumsToPgEnum } from "../../util/DatabaseHelperFunctions";
import { entitySchema } from "./EntitySchema";

const ROLES_TABLE = "roles";

export enum RolesEnum {
  MOVING_CUSTOMER = "MOVING_CUSTOMER",
  MOVING_BUSINESS_EMPLOYEE = "MOVING_BUSINESS_EMPLOYEE",
  MOVING_BUSINESS_ADMIN = "MOVING_BUSINESS_ADMIN",
  SUPER_USER = "SUPER_USER",
}

export const rolesPgEnum = convertStringEnumsToPgEnum("role", [RolesEnum]);
export const rolesTableDef = entitySchema.table(ROLES_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  role: rolesPgEnum("role").notNull().unique(),
});

export type Role = typeof rolesTableDef.$inferSelect;
