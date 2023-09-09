import { primaryKey, uuid } from "drizzle-orm/pg-core";
import { entitySchema } from "./EntitySchema";
import {
  MovingBidPermissionsEnum,
  MovingBusinessEmployeePermissionsEnum,
  MovingBusinessPermissionsEnum,
  MovingCustomerPermissionsEnum,
  MovingJobPermissionsEnum,
  permissionsTableDef,
} from "./Permissions";
import { RolesEnum, rolesTableDef } from "./Roles";

const ROLES_PERMISSIONS_TABLE = "roles_permissions";

export const rolesPermissionsMap = new Map([
  [
    RolesEnum.MOVING_CUSTOMER,
    [
      MovingCustomerPermissionsEnum.READ_CUSTOMER,
      MovingCustomerPermissionsEnum.UPDATE_CUSTOMER,
      MovingCustomerPermissionsEnum.DELETE_CUSTOMER,
      MovingJobPermissionsEnum.CREATE_JOB,
      MovingJobPermissionsEnum.READ_JOB,
      MovingJobPermissionsEnum.UPDATE_JOB,
      MovingJobPermissionsEnum.DELETE_JOB,
      MovingBidPermissionsEnum.READ_BID,
      MovingBidPermissionsEnum.ACCEPT_BID,
      MovingBidPermissionsEnum.REJECT_BID,
    ],
  ],
  [
    RolesEnum.MOVING_BUSINESS_EMPLOYEE,
    [
      MovingJobPermissionsEnum.READ_JOB,
      MovingBidPermissionsEnum.CREATE_BID,
      MovingBidPermissionsEnum.READ_BID,
      MovingBidPermissionsEnum.UPDATE_BID,
      MovingBidPermissionsEnum.DELETE_BID,
    ],
  ],
  [
    RolesEnum.MOVING_BUSINESS_ADMIN,
    [
      MovingBusinessEmployeePermissionsEnum.CREATE_EMPLOYEE,
      MovingBusinessEmployeePermissionsEnum.READ_EMPLOYEE,
      MovingBusinessEmployeePermissionsEnum.UPDATE_EMPLOYEE,
      MovingBusinessEmployeePermissionsEnum.DELETE_EMPLOYEE,
      MovingBusinessPermissionsEnum.READ_BUSINESS,
      MovingJobPermissionsEnum.READ_JOB,
      MovingBidPermissionsEnum.CREATE_BID,
      MovingBidPermissionsEnum.READ_BID,
      MovingBidPermissionsEnum.UPDATE_BID,
      MovingBidPermissionsEnum.DELETE_BID,
    ],
  ],
  [
    RolesEnum.SUPER_USER,
    [
      MovingCustomerPermissionsEnum.CREATE_CUSTOMER,
      MovingCustomerPermissionsEnum.READ_CUSTOMER,
      MovingCustomerPermissionsEnum.UPDATE_CUSTOMER,
      MovingCustomerPermissionsEnum.DELETE_CUSTOMER,
      MovingBusinessEmployeePermissionsEnum.CREATE_EMPLOYEE,
      MovingBusinessEmployeePermissionsEnum.READ_EMPLOYEE,
      MovingBusinessEmployeePermissionsEnum.UPDATE_EMPLOYEE,
      MovingBusinessEmployeePermissionsEnum.DELETE_EMPLOYEE,
      MovingBusinessPermissionsEnum.CREATE_BUSINESS,
      MovingBusinessPermissionsEnum.READ_BUSINESS,
      MovingBusinessPermissionsEnum.UPDATE_BUSINESS,
      MovingBusinessPermissionsEnum.DELETE_BUSINESS,
      MovingJobPermissionsEnum.CREATE_JOB,
      MovingJobPermissionsEnum.READ_JOB,
      MovingJobPermissionsEnum.UPDATE_JOB,
      MovingJobPermissionsEnum.DELETE_JOB,
      MovingBidPermissionsEnum.CREATE_BID,
      MovingBidPermissionsEnum.READ_BID,
      MovingBidPermissionsEnum.UPDATE_BID,
      MovingBidPermissionsEnum.DELETE_BID,
      MovingBidPermissionsEnum.ACCEPT_BID,
      MovingBidPermissionsEnum.REJECT_BID,
    ],
  ],
]);

export const rolesPermissionsTableDef = entitySchema.table(
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

export type RolePermission = typeof rolesPermissionsTableDef.$inferSelect;
export type NewRolePermission = typeof rolesPermissionsTableDef.$inferInsert;
