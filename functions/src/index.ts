import axios from "axios";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";
import UrlFactory from "./UrlFactory";

admin.initializeApp({
  projectId: process.env.GCP_PROJECT_ID,
});
export const newUser = functions.auth
  .user()
  .onCreate(async (userRecord: UserRecord) => {
    await axios.post(`${UrlFactory.getUrl()}/users/writeNewUser`, {
      uid: userRecord.uid,
    });
  });
