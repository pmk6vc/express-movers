import axios from "axios";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";
import AppUrlFactory from "./AppUrlFactory";

admin.initializeApp({
  projectId: process.env.GCP_PROJECT_ID,
});
export const persistNewFirebaseUser = functions.auth
  .user()
  .onCreate(async (userRecord: UserRecord) => {
    // TODO: Logging and error handling
    // TODO: Test coverage
    // TODO: Set up retries and add termination condition to avoid infinite retries (either in code or in deployment)
    // TODO: Add delete user equivalent
    // TODO: Authenticate as service account and add ID token to request
    await axios.post(`${AppUrlFactory.getUrl()}/users/writeNewUser`, {
      uid: userRecord.uid,
    });
  });
