import { describe, it } from "@jest/globals";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import {
  FIREBASE_AUTH_EMULATOR_HOST,
  TEST_GCP_PROJECT_ID,
} from "../../test/util/TestConstants";

process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST;
admin.initializeApp({
  projectId: TEST_GCP_PROJECT_ID,
});
describe("tests", () => {
  it("should work", async () => {
    const x = await getAuth().createUser({
      email: "hello@world.com",
    });
    console.log(x.email);
  });
});
