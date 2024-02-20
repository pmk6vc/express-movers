import { describe, it } from "@jest/globals";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import {
  FIREBASE_AUTH_EMULATOR_HOST,
  TEST_GCP_PROJECT_ID,
} from "../../test/util/TestConstants";
import { persistFirebaseUserRecordFactory } from "../src/PersistNewFirebaseUser";

process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST;
admin.initializeApp({
  projectId: TEST_GCP_PROJECT_ID,
});
describe("persisting new Firebase users should work", () => {
  it("should invoke service to persist new Firebase user", async () => {});

  it("should ignore expired user creation event", async () => {
    const x = await getAuth().createUser({
      email: "hello@world.com",
    });
    const delay = (ms: number) => {
      new Promise((res) => setTimeout(res, ms));
    };
    await delay(3000);
    await persistFirebaseUserRecordFactory(1000)(x);
  });
});
