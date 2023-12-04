import axios from "axios";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";

admin.initializeApp({
  projectId: process.env.GCP_PROJECT_ID,
});
export const newUser = functions.auth
  .user()
  .onCreate(async (userRecord: UserRecord) => {
    console.log("Hello from Firebase function!");
    // const baseUrl = "http://localhost:5495" // Local dev
    const baseUrl = "http://app:5495"; // Docker-compose
    await axios.post(`${baseUrl}/users/writeNewUser`, {
      uid: userRecord.uid,
    });
  });
