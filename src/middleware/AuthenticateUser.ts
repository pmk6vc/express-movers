import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { Logger } from "winston";
import DatabaseClient from "../db/DatabaseClient";
import { userTableDef } from "../db/model/entity/User";
import { GLOBAL_LOG_OBJ } from "./CorrelatedRequestLogging";

export const USER_PROPERTY = "user";

async function getVerifiedIdToken(bearerString: string | undefined) {
  if (!bearerString) {
    return;
  }
  let decodedToken;
  try {
    const token = bearerString.split(" ")[1];
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (e) {
    return;
  }
  return decodedToken;
}

async function uidExistsInDatabase(uid: string, dbClient: DatabaseClient) {
  const dbRecord = await dbClient.pgPoolClient
    .select()
    .from(userTableDef)
    .where(eq(userTableDef.uid, uid));
  return dbRecord.length == 1;
}

const authenticateUser = (dbClient: DatabaseClient, logger: Logger) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const maybeVerifiedIdToken = await getVerifiedIdToken(
      req.headers.authorization,
    );
    if (maybeVerifiedIdToken == undefined) {
      next();
      return;
    }
    const [firebaseRecord, existsInDatabase] = await Promise.all([
      getAuth().getUser(maybeVerifiedIdToken!.uid),
      uidExistsInDatabase(maybeVerifiedIdToken!.uid, dbClient),
    ]);
    if (!existsInDatabase) {
      logger.info(
        `User ${
          maybeVerifiedIdToken!.uid
        } exists in Firebase but not in database`,
        res.locals[GLOBAL_LOG_OBJ],
      );
      res.status(503).send("We're still setting up your account");
      return;
    }
    res.locals[USER_PROPERTY] = firebaseRecord.toJSON();
    next();
  };
};

export default authenticateUser;
