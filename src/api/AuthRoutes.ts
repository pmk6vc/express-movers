import express from "express";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

const router = express.Router();

// TODO: I think you can just remove the firebase config before app initialization in production
// const firebaseConfig = {
//   credential: admin.credential.cert("/Users/pmkulkarni/Downloads/key.json")
// }
// const app = admin.initializeApp(firebaseConfig)
admin.initializeApp();

router.get("/list", async (req, res) => {
  const usersResult = await getAuth().listUsers(10);
  const userRecords = usersResult.users.map((u) => u.toJSON());
  res.send(userRecords);
});

export default router;
