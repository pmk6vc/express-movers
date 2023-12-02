import * as admin from "firebase-admin";
import { app } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { buildApp } from "../../../src/app";
import DatabaseClient from "../../../src/db/DatabaseClient";
import { userTableDef } from "../../../src/db/model/entity/User";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import {
  DEFAULT_TEST_SUPERUSER,
  DEFAULT_TEST_USER,
  FIREBASE_AUTH_EMULATOR_HOST,
  TEST_GCP_PROJECT_ID,
} from "../TestConstants";
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
  return { firebaseAdminApp, dbClient, expressApp };
}

export async function tearDownIntegrationTest(
  firebaseAdminApp: App,
  testUsers: ITestUser[],
  dbClient: DatabaseClient
) {
  await Promise.all([
    getAuth(firebaseAdminApp).deleteUsers(
      testUsers.map((u) => u.userRecord.uid)
    ),
    dbClient.close(),
  ]);
}

export async function setupDefaultUsers(
  firebaseAdminApp: App,
  dbClient: DatabaseClient
): Promise<ITestUser[]> {
  const [defaultTestUser, defaultTestSuperuser] = await Promise.all([
    getAuth(firebaseAdminApp).createUser(DEFAULT_TEST_USER),
    getAuth(firebaseAdminApp).createUser(DEFAULT_TEST_SUPERUSER),
  ]);
  await Promise.all([
    dbClient.pgPoolClient.insert(userTableDef).values({
      uid: defaultTestUser.uid,
      email: DEFAULT_TEST_USER.email,
      profile: DEFAULT_TEST_USER.profile,
    }),
    dbClient.pgPoolClient.insert(userTableDef).values({
      uid: defaultTestSuperuser.uid,
      email: DEFAULT_TEST_SUPERUSER.email,
      profile: DEFAULT_TEST_SUPERUSER.profile,
      isSuperuser: true,
    }),
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
