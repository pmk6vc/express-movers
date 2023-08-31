import { auth } from "firebase-admin";
import UserRecord = auth.UserRecord;

export interface ITestUser {
  userCredentials: {
    email: string;
    password: string;
  };
  userRecord: UserRecord;
}
