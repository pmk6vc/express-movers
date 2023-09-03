import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { convertStringEnumsToPgEnum } from "../../util/DatabaseHelperFunctions";
import { authSchema } from "./AuthSchema";

const PERMISSIONS_TABLE = "permissions";

enum MovingCustomerPermissionsEnum {
  "Create:Customer" = "create:customer",
  "Read:Customer" = "read:customer",
  "Update:Customer" = "update:customer",
  "Delete:Customer" = "delete:customer",
}
enum MovingBusinessEmployeePermissionsEnum {
  "Create:Employee" = "create:employee",
  "Read:Employee" = "read:employee",
  "Update:Employee" = "update:employee",
  "Delete:Employee" = "delete:employee",
}
enum MovingBusinessPermissionsEnum {
  "Create:Business" = "create:business",
  "Read:Business" = "read:business",
  "Update:Business" = "update:business",
  "Delete:Business" = "delete:business",
}
enum MovingJobPermissionsEnum {
  "Create:Job" = "create:job",
  "Read:Job" = "read:job",
  "Update:Job" = "update:job",
  "Delete:Job" = "delete:job",
  "Accept:Job" = "accept:job",
  "Reject:Job" = "reject:job",
}

export const permissionsPgEnum = convertStringEnumsToPgEnum("permission", [
  MovingCustomerPermissionsEnum,
  MovingBusinessEmployeePermissionsEnum,
  MovingBusinessPermissionsEnum,
  MovingJobPermissionsEnum,
]);

export const permissionsTableDef = authSchema.table(PERMISSIONS_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  permission: permissionsPgEnum("permission").notNull().unique(),
});

export type Permission = typeof permissionsTableDef.$inferSelect;
