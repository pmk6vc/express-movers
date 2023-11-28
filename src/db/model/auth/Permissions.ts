import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { convertStringEnumsToPgEnum } from "../../util/DatabaseHelperFunctions";
import { authSchema } from "./AuthSchema";

const PERMISSIONS_TABLE = "permissions";

export enum PermissionsEnum {
  CREATE_CUSTOMER = "customer:create",
  READ_CUSTOMER = "customer:read",
  UPDATE_CUSTOMER = "customer:update",
  DELETE_CUSTOMER = "customer:delete",
  CREATE_EMPLOYEE = "employee:create",
  READ_EMPLOYEE = "employee:read",
  UPDATE_EMPLOYEE = "employee:update",
  DELETE_EMPLOYEE = "employee:delete",
  CREATE_BUSINESS = "business:create",
  READ_BUSINESS = "business:read",
  UPDATE_BUSINESS = "business:update",
  DELETE_BUSINESS = "business:delete",
  CREATE_JOB = "job:create",
  READ_JOB = "job:read",
  UPDATE_JOB = "job:update",
  DELETE_JOB = "job:delete",
  CREATE_BID = "bid:create",
  READ_BID = "bid:read",
  UPDATE_BID = "bid:update",
  DELETE_BID = "bid:delete",
  ACCEPT_BID = "bid:accept",
  REJECT_BID = "bid:reject",
}

export const permissionsPgEnum = convertStringEnumsToPgEnum("permission", [
  PermissionsEnum,
]);

export const permissionsTableDef = authSchema.table(PERMISSIONS_TABLE, {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  permission: permissionsPgEnum("permission").notNull().unique(),
});
