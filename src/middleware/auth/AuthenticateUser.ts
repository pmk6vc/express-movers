import { NextFunction, Request, Response } from "express";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

export const USER_PROPERTY = "user";

async function fetchUserRecordFromBearerString(
  bearerString: string | undefined
) {
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
  const userRecord = await getAuth().getUser(decodedToken.uid);
  return userRecord.toJSON();
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals[USER_PROPERTY] = await fetchUserRecordFromBearerString(
    req.headers.authorization
  );
  next();
};

export default authenticateUser;
