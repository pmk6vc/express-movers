import * as admin from "firebase-admin";
import { app } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { buildApp } from "../../../src/app";
import DatabaseClient from "../../../src/db/DatabaseClient";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import {
  DEFAULT_TEST_USER,
  FIREBASE_AUTH_EMULATOR_HOST,
  TEST_GCP_PROJECT_ID,
} from "../TestConstants";
import { ITestUser } from "./ITestUser";
import App = app.App;

async function setupDefaultUsers(firebaseAdminApp: App): Promise<ITestUser[]> {
  const userRecord = await getAuth(firebaseAdminApp).createUser(
    DEFAULT_TEST_USER
  );
  return [
    {
      userCredentials: {
        email: DEFAULT_TEST_USER.email,
        password: DEFAULT_TEST_USER.password,
      },
      userRecord: userRecord,
      profile: DEFAULT_TEST_USER.profile,
    },
  ];
}

function connectToFirebaseEmulator() {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST;
  return admin.initializeApp({
    projectId: TEST_GCP_PROJECT_ID,
  });
}

export async function setupIntegrationTest(
  setupUsers: (
    firebaseAdminApp: App
  ) => Promise<ITestUser[]> = setupDefaultUsers
) {
  const firebaseAdminApp = connectToFirebaseEmulator();
  const env = await EnvironmentFactory.getHandler().getEnvironment();
  const dbClient = DatabaseClient.getInstance(env);
  const expressApp = await buildApp(env, dbClient);

  const testUsers = await setupUsers(firebaseAdminApp);
  return { firebaseAdminApp, dbClient, expressApp, testUsers };
}

export async function tearDownIntegrationTest(
  firebaseAdminApp: App,
  testUsers: ITestUser[]
) {
  await getAuth(firebaseAdminApp).deleteUsers(
    testUsers.map((u) => u.userRecord.uid)
  );
}
