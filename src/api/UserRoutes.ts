import express from "express";
import { Environment } from "../environment/handlers/IEnvironment";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

const router = express.Router();

const userRouter = (env: Environment) => {
  return router.get("/:userId", async (req, res) => {
    // Fetch authenticated user
    // TODO: Move this to middleware
    if (req.headers.authorization == undefined) {
      res.status(401).send("No bearer token found");
      return;
    }
    const token = req.headers.authorization.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (e) {
      res.status(401).send("Invalid bearer token");
      return;
    }

    // Confirm token user ID matches requested user ID
    if (req.params.userId != decodedToken.uid) {
      res.status(403).send("Unauthorized access");
      return;
    }

    // Fetch user data
    const userRecord = await getAuth().getUser(decodedToken.uid);
    res.status(200).send(userRecord.toJSON());
  });
};

export default userRouter;
