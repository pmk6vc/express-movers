import { UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions";
import { dummyFunction } from "./DummyFunction";
import { persistFirebaseUserRecordFactory } from "./PersistNewFirebaseUser";

export const persistNewFirebaseUser = functions.auth
  .user()
  .onCreate(async (userRecord: UserRecord) => {
    // TODO: Add delete user equivalent
    await persistFirebaseUserRecordFactory(60000)(userRecord);
  });

export const printNewUser = functions.auth
  .user()
  .onCreate(async (userRecord: UserRecord) => {
    await dummyFunction(userRecord);
  });
