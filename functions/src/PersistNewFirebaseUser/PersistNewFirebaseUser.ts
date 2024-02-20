import { UserRecord } from "firebase-admin/auth";
import {
  checkEventExpiration,
  persistFirebaseUserRecord,
} from "./PersistNewFirebaseUserHelpers";

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
