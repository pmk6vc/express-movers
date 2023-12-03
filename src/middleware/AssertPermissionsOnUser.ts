import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import DatabaseClient from "../db/DatabaseClient";
import { PermissionsEnum } from "../db/model/auth/Permissions";
import { RolesEnum } from "../db/model/auth/Roles";
import { rolesPermissionsMap } from "../db/model/auth/RolesPermissions";
import { userTableDef } from "../db/model/entity/User";
import { USER_PROPERTY } from "./AuthenticateUser";
import { GLOBAL_LOG_OBJ } from "./CorrelatedRequestLogging";

const getPermissionsOnUserResource = async (
  requestedCustomerId: string,
  authenticatedUserId: string,
  dbClient: DatabaseClient
): Promise<PermissionsEnum[]> => {
  // Fetch authenticated user record from database
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

export const assertPermissionsOnUser = (
  requiredPermissions: PermissionsEnum[],
  dbClient: DatabaseClient,
  logger: Logger
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const requestedUserId = req.params["userId"];
    const authenticatedUserId = res.locals[USER_PROPERTY].uid;
    const permissions = await getPermissionsOnUserResource(
      requestedUserId,
      authenticatedUserId,
      dbClient
    );
    logger.info(
      `Authenticated user ${authenticatedUserId} has the following permissions on requested user ${requestedUserId}: ${permissions}`,
      res.locals[GLOBAL_LOG_OBJ]
    );
    const isAuthorized = requiredPermissions.every((p) =>
      permissions.includes(p)
    );
    if (!isAuthorized) {
      logger.info(
        `Authenticated user ${authenticatedUserId} missing at least one of the following required permissions on requested user ${requestedUserId}: ${requiredPermissions}`,
        res.locals[GLOBAL_LOG_OBJ]
      );
      res.status(403).send("Unauthorized request");
      return;
    }
    next();
  };
};
