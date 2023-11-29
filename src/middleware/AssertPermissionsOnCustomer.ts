import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import DatabaseClient from "../db/DatabaseClient";
import { PermissionsEnum } from "../db/model/auth/Permissions";
import { RolesEnum } from "../db/model/auth/Roles";
import { rolesPermissionsMap } from "../db/model/auth/RolesPermissions";
import { userTableDef } from "../db/model/entity/User";
import { USER_PROPERTY } from "./AuthenticateUser";

const getPermissionsOnCustomerResource = async (
  requestedCustomerId: string,
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
    return rolesPermissionsMap.get(RolesEnum.SUPER_USER)!;
  }
  if (authenticatedUserId == requestedCustomerId) {
    return rolesPermissionsMap.get(RolesEnum.MOVING_CUSTOMER)!;
  }
  return [];
};

export const assertPermissionsOnCustomer = (
  requiredPermissions: PermissionsEnum[],
  dbClient: DatabaseClient
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const requestedCustomerId = req.params["customerId"];
    const authenticatedUserId = res.locals[USER_PROPERTY].uid;
    const permissions = await getPermissionsOnCustomerResource(
      requestedCustomerId,
      authenticatedUserId,
      dbClient
    );
    const isAuthorized = requiredPermissions.every((p) =>
      permissions.includes(p)
    );
    if (!isAuthorized) {
      // TODO: Figure out appropriate status code and message
      res.status(403).send("Unauthorized");
      return;
    }
    next();
  };
};
