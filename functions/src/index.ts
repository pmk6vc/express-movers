import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions";
import { persistFirebaseUserRecordFactory } from "./PersistNewFirebaseUser/PersistNewFirebaseUser";

admin.initializeApp({
  projectId: process.env.GCP_PROJECT_ID,
});

export const persistNewFirebaseUser = functions.auth
  .user()
  .onCreate(async (userRecord: UserRecord) => {
    // TODO: Add delete user equivalent
    await persistFirebaseUserRecordFactory(60000)(userRecord);
  });
