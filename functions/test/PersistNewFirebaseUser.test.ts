import { describe, it } from "@jest/globals";
import * as admin from "firebase-admin";
import { app } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import {
  FIREBASE_AUTH_EMULATOR_HOST,
  TEST_GCP_PROJECT_ID,
} from "../../test/util/TestConstants";
import { persistFirebaseUserRecordFactory } from "../src/PersistNewFirebaseUser";
import App = app.App;

describe("persisting new Firebase users should work", () => {
  let firebaseAdminApp: App;

  beforeAll(async () => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST;
    firebaseAdminApp = admin.initializeApp(
      {
        projectId: TEST_GCP_PROJECT_ID,
      },
      "PersistNewFirebaseUser",
    );
  });

  it("should invoke service to persist new Firebase user", async () => {});

  it("should ignore expired user creation event", async () => {
    const x = await getAuth(firebaseAdminApp).createUser({
      email: "hello@world.com",
    });
    await new Promise((res) => setTimeout(res, 1000));
    console.log(Date.now() - new Date(x.metadata.creationTime).getTime());
    await persistFirebaseUserRecordFactory(1000)(x);
  });
});
