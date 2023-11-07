import { primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { orgTableDef } from "../entity/Organization";
import { userTableDef } from "../entity/User";
import { authSchema } from "./AuthSchema";
import { rolesTableDef } from "./Roles";

const USER_ORG_ROLE_TABLE = "user_organization_role";
export const userOrgRoleTableDef = authSchema.table(
  USER_ORG_ROLE_TABLE,
  {
    uid: varchar("uid", { length: 128 })
      .references(() => userTableDef.uid, {
        onUpdate: "cascade",
        onDelete: "restrict",
      })
      .notNull(),
    organizationId: uuid("organization_id")
      .references(() => orgTableDef.id, {
        onUpdate: "cascade",
        onDelete: "restrict",
      })
      .notNull(),
    roleId: uuid("role_id")
      .references(() => rolesTableDef.id, {
        onUpdate: "cascade",
        onDelete: "restrict",
      })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.uid, table.organizationId, table.roleId),
    };
  }
);

export type NewUserOrgRole = typeof userOrgRoleTableDef.$inferInsert;
