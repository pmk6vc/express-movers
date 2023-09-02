import express from "express";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import DatabaseClient from "../db/DatabaseClient";

const router = express.Router();

const authRouter = (dbClient: DatabaseClient) => {
  return router
    .get("/list", async (req, res) => {
      const usersResult = await getAuth().listUsers(10);
      const userRecords = usersResult.users.map((u) => u.toJSON());
      res.send(userRecords);
    })
    .get("/validate", async (req, res) => {
      if (!req.headers.authorization) {
        res.status(400).send("No bearer token found");
        return;
      }
      const token = req.headers.authorization.split(" ")[1];
      // const decodeValue = await admin.auth().verifyIdToken(token, true) // Check revoked won't work if user is disabled
      const decodeValue = await admin.auth().verifyIdToken(token);
      // await getAuth().setCustomUserClaims(decodeValue.uid, {
      //   admin: false
      // })
      // const user = await getAuth().getUser(decodeValue.uid)
      const user = await getAuth().updateUser(decodeValue.uid, {
        disabled: false,
      });
      // await getAuth().revokeRefreshTokens(decodeValue.uid)
      res.send({
        decodeValue: decodeValue,
        userRecord: user.toJSON(),
      });
    });
};

export default authRouter;

/**
 * cURL request for signing in: https://cloud.google.com/identity-platform/docs/use-rest-api#section-sign-in-email-password
 * Example code for client and server: https://blog.devgenius.io/firebase-authentication-with-custom-node-js-express-backend-2ae9c04571b5
 * Admin SDK installation: https://cloud.google.com/identity-platform/docs/install-admin-sdk#setting_scopes
 * Managing users programmatically: https://cloud.google.com/identity-platform/docs/admin/manage-users
 * Explanation of Firebase tokens: https://medium.com/@jwngr/demystifying-firebase-auth-tokens-e0c533ed330c
 */
