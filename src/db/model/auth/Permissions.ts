import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { convertStringEnumToPgEnum } from "../../util/DatabaseHelperFunctions";
import { authSchema } from "./AuthSchema";

const PERMISSIONS_TABLE = "permissions";

export enum PermissionsEnum {
  CREATE_CUSTOMER = "create:customer",
  READ_CUSTOMER = "read:customer",
  UPDATE_CUSTOMER = "update:customer",
  DELETE_CUSTOMER = "delete:customer",
  CREATE_EMPLOYEE = "create:employee",
  READ_EMPLOYEE = "read:employee",
  UPDATE_EMPLOYEE = "update:employee",
  DELETE_EMPLOYEE = "delete:employee",
  CREATE_BUSINESS = "create:business",
  READ_BUSINESS = "read:business",
  UPDATE_BUSINESS = "update:business",
  DELETE_BUSINESS = "delete:business",
  CREATE_JOB = "create:job",
  READ_JOB = "read:job",
  UPDATE_JOB = "update:job",
  DELETE_JOB = "delete:job",
  CREATE_BID = "create:bid",
  READ_BID = "read:bid",
  UPDATE_BID = "update:bid",
  DELETE_BID = "delete:bid",
  ACCEPT_BID = "accept:bid",
  REJECT_BID = "reject:bid",
}

export const permissionsPgEnum = convertStringEnumToPgEnum(
  "permission",
  PermissionsEnum,
);

export const permissionsTableDef = authSchema.table(PERMISSIONS_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  permission: permissionsPgEnum("permission").notNull().unique(),
});
