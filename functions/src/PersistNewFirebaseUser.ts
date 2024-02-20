import axios from "axios";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";
import AppUrlFactory from "./AppUrlFactory";

admin.initializeApp({
  projectId: process.env.GCP_PROJECT_ID,
});

export const dummyFunction = () => {
  console.log("Hello, world!");
};

const checkEventExpiration = (
  userRecord: UserRecord,
  expirationMs: number,
): boolean => {
  const eventAgeMs =
    Date.now() - new Date(userRecord.metadata.creationTime).getTime();
  return eventAgeMs >= expirationMs;
};

const persistFirebaseUserRecord = async (userRecord: UserRecord) => {
  console.log(`Attempting to persist Firebase user ${userRecord.uid}`);
  try {
    await axios.post(`${AppUrlFactory.getUrl()}/users/writeNewUser`, {
      uid: userRecord.uid,
    });
    console.log(`Successfully persisted Firebase user ${userRecord.uid}`);
  } catch (e: unknown) {
    // Swallow error if 409 for duplicate user, else throw for retry
    console.log(`Error occurred: ${e}`);
    if (axios.isAxiosError(e) && e.status == 409) {
      console.log(
        `User ${userRecord.uid} has already been persisted - not attempting retry`,
      );
      return;
    }
    throw e;
  }
};

export const persistFirebaseUserRecordFactory = (expirationMs: number) => {
  return async (userRecord: UserRecord) => {
    // Set up time-based termination condition to avoid infinite retries
    if (checkEventExpiration(userRecord, expirationMs)) {
      console.log(
        `Skipping processing for Firebase user ${userRecord.uid} - creation event expired`,
      );
      return;
    }

    // Persist created Firebase user
    await persistFirebaseUserRecord(userRecord);
  };
};

export const persistNewFirebaseUser = functions.auth
  .user()
  .onCreate(async (userRecord: UserRecord) => {
    // TODO: Add delete user equivalent
    await persistFirebaseUserRecordFactory(60000)(userRecord);
  });
