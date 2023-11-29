import { primaryKey, uuid } from "drizzle-orm/pg-core";
import { authSchema } from "./AuthSchema";
import { PermissionsEnum, permissionsTableDef } from "./Permissions";
import { RolesEnum, rolesTableDef } from "./Roles";

const ROLES_PERMISSIONS_TABLE = "roles_permissions";

export const rolesPermissionsMap = new Map([
  [
    RolesEnum.MOVING_CUSTOMER,
    [
      PermissionsEnum.READ_CUSTOMER,
      PermissionsEnum.UPDATE_CUSTOMER,
      PermissionsEnum.DELETE_CUSTOMER,
      PermissionsEnum.CREATE_JOB,
      PermissionsEnum.READ_JOB,
      PermissionsEnum.UPDATE_JOB,
      PermissionsEnum.DELETE_JOB,
      PermissionsEnum.READ_BID,
      PermissionsEnum.ACCEPT_BID,
      PermissionsEnum.REJECT_BID,
    ],
  ],
  [
    RolesEnum.MOVING_BUSINESS_EMPLOYEE,
    [
      PermissionsEnum.READ_JOB,
      PermissionsEnum.CREATE_BID,
      PermissionsEnum.READ_BID,
      PermissionsEnum.UPDATE_BID,
      PermissionsEnum.DELETE_BID,
    ],
  ],
  [
    RolesEnum.MOVING_BUSINESS_ADMIN,
    [
      PermissionsEnum.CREATE_EMPLOYEE,
      PermissionsEnum.READ_EMPLOYEE,
      PermissionsEnum.UPDATE_EMPLOYEE,
      PermissionsEnum.DELETE_EMPLOYEE,
      PermissionsEnum.READ_BUSINESS,
      PermissionsEnum.READ_JOB,
      PermissionsEnum.CREATE_BID,
      PermissionsEnum.READ_BID,
      PermissionsEnum.UPDATE_BID,
      PermissionsEnum.DELETE_BID,
    ],
  ],
  [
    RolesEnum.SUPER_USER,
    [
      PermissionsEnum.CREATE_CUSTOMER,
      PermissionsEnum.READ_CUSTOMER,
      PermissionsEnum.UPDATE_CUSTOMER,
      PermissionsEnum.DELETE_CUSTOMER,
      PermissionsEnum.CREATE_EMPLOYEE,
      PermissionsEnum.READ_EMPLOYEE,
      PermissionsEnum.UPDATE_EMPLOYEE,
      PermissionsEnum.DELETE_EMPLOYEE,
      PermissionsEnum.CREATE_BUSINESS,
      PermissionsEnum.READ_BUSINESS,
      PermissionsEnum.UPDATE_BUSINESS,
      PermissionsEnum.DELETE_BUSINESS,
      PermissionsEnum.CREATE_JOB,
      PermissionsEnum.READ_JOB,
      PermissionsEnum.UPDATE_JOB,
      PermissionsEnum.DELETE_JOB,
      PermissionsEnum.CREATE_BID,
      PermissionsEnum.READ_BID,
      PermissionsEnum.UPDATE_BID,
      PermissionsEnum.DELETE_BID,
      PermissionsEnum.ACCEPT_BID,
      PermissionsEnum.REJECT_BID,
    ],
  ],
]);

export const rolesPermissionsTableDef = authSchema.table(
  ROLES_PERMISSIONS_TABLE,
  {
    roleId: uuid("role_id")
      .references(() => rolesTableDef.id, {
        onUpdate: "cascade",
        onDelete: "restrict",
      })
      .notNull(),
    permissionId: uuid("permission_id")
      .references(() => permissionsTableDef.id, {
        onUpdate: "cascade",
        onDelete: "restrict",
      })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.roleId, table.permissionId),
    };
  }
);

export type NewRolePermission = typeof rolesPermissionsTableDef.$inferInsert;
