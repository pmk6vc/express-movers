import { afterEach, describe, expect, it } from "@jest/globals";
import * as admin from "firebase-admin";
import { app } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import {
  FIREBASE_AUTH_EMULATOR_HOST,
  TEST_GCP_PROJECT_ID,
} from "../../test/util/TestConstants";
import { persistFirebaseUserRecordFactory } from "../src/PersistNewFirebaseUser/PersistNewFirebaseUser";
import * as PersistNewFirebaseUserHelpers from "../src/PersistNewFirebaseUser/PersistNewFirebaseUserHelpers";
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

  afterEach(async () => {
    const firebaseUsers = (await getAuth(firebaseAdminApp).listUsers()).users;
    await getAuth(firebaseAdminApp).deleteUsers(
      firebaseUsers.map((u) => u.uid),
    );
    jest.clearAllMocks();
  });

  it("should invoke service to persist new Firebase user", async () => {
    const mock = jest.fn();
    const spy = jest.spyOn(
      PersistNewFirebaseUserHelpers,
      "persistFirebaseUserRecord",
    );
    spy.mockImplementation(mock);
    const newUser = await getAuth(firebaseAdminApp).createUser({
      email: "hello@world.com",
    });
    await persistFirebaseUserRecordFactory(60000)(newUser);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(newUser);
  });

  it("should ignore expired user creation event", async () => {
    const x = await getAuth(firebaseAdminApp).createUser({
      email: "hello@world.com",
    });
    await new Promise((res) => setTimeout(res, 1000));
    await persistFirebaseUserRecordFactory(1000)(x);
  });
});
