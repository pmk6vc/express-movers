/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { UserRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions/v1";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// admin.initializeApp();
export const newUser = functions.auth
  .user()
  .onCreate((userRecord: UserRecord) => {
    console.log(userRecord);
  });
