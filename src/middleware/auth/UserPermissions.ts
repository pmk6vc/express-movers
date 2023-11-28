import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import DatabaseClient from "../../db/DatabaseClient";
import { MovingCustomerPermissionsEnum } from "../../db/model/auth/Permissions";
import { RolesEnum } from "../../db/model/auth/Roles";
import { rolesPermissionsMap } from "../../db/model/auth/RolesPermissions";
import { userTableDef } from "../../db/model/entity/User";
import { USER_PROPERTY } from "./AuthenticateUser";

const getPermissionsOnUser = async (
  userId: string,
  authenticatedUserId: string,
  dbClient: DatabaseClient
) => {
  // Fetch authenticated user record from database
  const authenticatedUser = (
    await dbClient.pgPoolClient
      .select()
      .from(userTableDef)
      .where(eq(userTableDef.uid, authenticatedUserId))
  )[0];

  // Use role mappings to determine appropriate permissions on requested user ID
  if (authenticatedUser.isSuperUser) {
    return rolesPermissionsMap.get(RolesEnum.SUPERUSER)!;
  }
  if (authenticatedUser.uid == userId) {
    return rolesPermissionsMap.get(RolesEnum.MOVING_CUSTOMER)!;
  }
  return [];
};

export const assertPermissionsOnUser = (
  dbClient: DatabaseClient,
  requiredPermissions: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedUserId = res.locals[USER_PROPERTY].uid;
    const permissions = await getPermissionsOnUser(
      req.body.userId,
      authenticatedUserId,
      dbClient
    );
    const hasPerms = requiredPermissions.every((x) =>
      permissions.includes((<never>MovingCustomerPermissionsEnum)[x])
    );
    if (!hasPerms) {
      res.status(403).send("Unauthorized");
    }
    next();
  };
};
