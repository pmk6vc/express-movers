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
    // TODO: Test coverage
    // TODO: Add delete user equivalent
    // TODO: Authenticate as service account and add ID token to request

    // Set up time-based termination condition to avoid infinite retries
    const expirationMs = 60000;
    const eventAgeMs =
      Date.now() - new Date(userRecord.metadata.creationTime).getTime();
    if (eventAgeMs > expirationMs) {
      console.log(
        `Skipping processing for Firebase user ${userRecord.uid} - creation occurred ${eventAgeMs}ms ago, exceeding ${expirationMs}ms expiration`
      );
      return;
    }

    // Attempt to persist created Firebase user
    const url = `${AppUrlFactory.getUrl()}/users/writeNewUser`;
    console.log(
      `Attempting to persist Firebase user ${userRecord.uid} at ${url}`
    );
    try {
      await axios.post(url, {
        uid: userRecord.uid,
      });
      console.log(`Successfully persisted Firebase user ${userRecord.uid}`);
    } catch (e: unknown) {
      // Swallow error if 409 for duplicate user, else throw for retry
      console.log(`Error occurred: ${e}`);
      if (axios.isAxiosError(e) && e.status == 409) {
        console.log(
          `User ${userRecord.uid} has already been persisted - not attempting retry`
        );
        return;
      }
      throw e;
    }
  });
