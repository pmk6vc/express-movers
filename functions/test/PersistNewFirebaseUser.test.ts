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
    // Spies and mocks
    const expSpy = jest.spyOn(
      PersistNewFirebaseUserHelpers,
      "checkEventExpiration",
    );
    const persistSpy = jest.spyOn(
      PersistNewFirebaseUserHelpers,
      "persistFirebaseUserRecord",
    );
    persistSpy.mockImplementation(jest.fn());

    // Invoke persistence function
    const newUser = await getAuth(firebaseAdminApp).createUser({
      email: "hello@world.com",
    });
    await persistFirebaseUserRecordFactory(60000)(newUser);

    // Assertions
    expect(expSpy).toHaveBeenCalledTimes(1);
    expect(expSpy).toHaveBeenCalledWith(newUser, 60000);
    expect(persistSpy).toHaveBeenCalledTimes(1);
    expect(persistSpy).toHaveBeenCalledWith(newUser);
  });

  it("should ignore expired user creation event", async () => {
    // Spies
    const expSpy = jest.spyOn(
      PersistNewFirebaseUserHelpers,
      "checkEventExpiration",
    );
    const persistSpy = jest.spyOn(
      PersistNewFirebaseUserHelpers,
      "persistFirebaseUserRecord",
    );

    // Invoke persistence function
    const newUser = await getAuth(firebaseAdminApp).createUser({
      email: "hello@world.com",
    });
    await new Promise((res) => setTimeout(res, 1000));
    await persistFirebaseUserRecordFactory(1000)(newUser);

    // Assertions
    expect(expSpy).toHaveBeenCalledTimes(1);
    expect(expSpy).toHaveBeenCalledWith(newUser, 1000);
    expect(persistSpy).toHaveBeenCalledTimes(0);
  });
});
