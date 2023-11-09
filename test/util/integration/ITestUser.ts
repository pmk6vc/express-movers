import { auth } from "firebase-admin";
import { UserProfile } from "../../../src/db/model/entity/User";
import UserRecord = auth.UserRecord;

export interface ITestUser {
  userCredentials: {
    email: string;
    password: string;
  };
  userRecord: UserRecord;
  profile: UserProfile;
}
