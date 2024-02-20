import axios from "axios";
import { UserRecord } from "firebase-admin/lib/auth";
import AppUrlFactory from "../AppUrlFactory";

export const checkEventExpiration = (
  userRecord: UserRecord,
  expirationMs: number,
): boolean => {
  const eventAgeMs =
    Date.now() - new Date(userRecord.metadata.creationTime).getTime();
  return eventAgeMs >= expirationMs;
};

export const persistFirebaseUserRecord = async (userRecord: UserRecord) => {
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
