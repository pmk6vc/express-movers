import { UserRecord } from "firebase-admin/auth";

export const dummyFunction = async (userRecord: UserRecord) => {
  console.log(`Congratulations on creating ${userRecord.email}!`);
};
