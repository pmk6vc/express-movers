import * as admin from "firebase-admin";
import { app } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { buildApp } from "../../../src/app";
import DatabaseClient from "../../../src/db/DatabaseClient";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import {
  DEFAULT_TEST_SUPERUSER,
  DEFAULT_TEST_USER,
  FIREBASE_AUTH_EMULATOR_HOST,
  TABLES_TO_TRUNCATE,
  TEST_GCP_PROJECT_ID,
} from "../TestConstants";
import { truncateTables } from "../TestDatabaseUtil";
import { ITestUser } from "./ITestUser";
import App = app.App;

function connectToFirebaseEmulator() {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST;
  return admin.initializeApp({
    projectId: TEST_GCP_PROJECT_ID,
  });
}

export async function setupIntegrationTest() {
  const firebaseAdminApp = connectToFirebaseEmulator();
  const env = await EnvironmentFactory.getHandler().getEnvironment();
  const dbClient = DatabaseClient.getInstance(env);
  const expressApp = await buildApp(env, dbClient);

  await dbClient.runMigrations();
  return { firebaseAdminApp, env, dbClient, expressApp };
}

export async function tearDownIntegrationTest(
  firebaseAdminApp: App,
  dbClient: DatabaseClient
) {
  const firebaseUsers = (await getAuth(firebaseAdminApp).listUsers()).users;
  await Promise.all([
    getAuth(firebaseAdminApp).deleteUsers(firebaseUsers.map((u) => u.uid)),
    truncateTables(dbClient, TABLES_TO_TRUNCATE),
  ]);
  await dbClient.close();
}

export async function setupDefaultUsers(
  firebaseAdminApp: App
): Promise<ITestUser[]> {
  const [defaultTestUser, defaultTestSuperuser] = await Promise.all([
    getAuth(firebaseAdminApp).createUser(DEFAULT_TEST_USER),
    getAuth(firebaseAdminApp).createUser(DEFAULT_TEST_SUPERUSER),
  ]);
  return [
    {
      userCredentials: {
        email: DEFAULT_TEST_USER.email,
        password: DEFAULT_TEST_USER.password,
      },
      userRecord: defaultTestUser,
      profile: DEFAULT_TEST_USER.profile,
    },
    {
      userCredentials: {
        email: DEFAULT_TEST_SUPERUSER.email,
        password: DEFAULT_TEST_SUPERUSER.password,
      },
      userRecord: defaultTestSuperuser,
      profile: DEFAULT_TEST_SUPERUSER.profile,
    },
  ];
}

export async function tearDownTestData(
  firebaseAdminApp: App,
  dbClient: DatabaseClient
) {
  const firebaseUsers = (await getAuth(firebaseAdminApp).listUsers()).users;
  await Promise.all([
    getAuth(firebaseAdminApp).deleteUsers(firebaseUsers.map((u) => u.uid)),
    truncateTables(dbClient, TABLES_TO_TRUNCATE),
  ]);
}
