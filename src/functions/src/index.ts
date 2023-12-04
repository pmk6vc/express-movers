import axios from "axios";
import { UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";

export const newUser = functions.auth
  .user()
  .onCreate(async (userRecord: UserRecord) => {
    console.log("Hello from Firebase function!");
    await axios.post("http://localhost:5495/users/writeNewUser", {
      uid: userRecord.uid,
    });
  });
