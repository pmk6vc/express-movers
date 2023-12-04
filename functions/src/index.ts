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
    // TODO: Authenticate as service account and add ID token to request
    // TODO: Need test coverage
    // TODO: Add termination condition to avoid infinite retries (either in code or in deployment)
    // TODO: Set up deployment in CICD
    await axios.post(`${AppUrlFactory.getUrl()}/users/writeNewUser`, {
      uid: userRecord.uid,
    });
  });
