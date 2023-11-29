import { eq } from "drizzle-orm";
import DatabaseClient from "../db/DatabaseClient";
import { PermissionsEnum } from "../db/model/auth/Permissions";
import { RolesEnum } from "../db/model/auth/Roles";
import { rolesPermissionsMap } from "../db/model/auth/RolesPermissions";
import { userTableDef } from "../db/model/entity/User";

const getPermissionsOnUserResource = async (
  requestedUserId: string,
  authenticatedUserId: string,
  dbClient: DatabaseClient
): Promise<PermissionsEnum[]> => {
  // Fetch authenticated user record from database
  // TODO: Handle edge case where user exists in Firebase but not in DB
  const authenticatedUserRecord = (
    await dbClient.pgPoolClient
      .select()
      .from(userTableDef)
      .where(eq(userTableDef.uid, authenticatedUserId))
  )[0];

  // Use role mappings to determine appropriate permissions on requested user ID
  if (authenticatedUserRecord.isSuperuser) {
    return rolesPermissionsMap.get(RolesEnum.SUPERUSER)!;
  }
  if (authenticatedUserId == requestedUserId) {
    return rolesPermissionsMap.get(RolesEnum.MOVING_CUSTOMER)!;
  }
  return [];
};
