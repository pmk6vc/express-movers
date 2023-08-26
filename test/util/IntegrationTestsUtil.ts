import * as admin from "firebase-admin";
import EnvironmentResolver from "../../src/environment/EnvironmentResolver";
import { buildApp } from "../../src/app";
import { getAuth } from "firebase-admin/auth";
import { app } from "firebase-admin";
import App = app.App;
import { ITestUser } from "./ITestUser";

async function setupDefaultUsers(firebaseAdminApp: App): Promise<ITestUser[]> {
  const email = "user@example.com";
  const password = "secretPassword";
  const userRecord = await getAuth(firebaseAdminApp).createUser({
    email: email,
    emailVerified: false,
    phoneNumber: "+11234567890",
    password: password,
    displayName: "John Doe",
    photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false,
  });
  return [
    {
      userCredentials: {
        email: email,
        password: password,
      },
      userRecord: userRecord,
    },
  ];
}

function connectToFirebaseEmulator() {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "0.0.0.0:9099";
  return admin.initializeApp({
    projectId: "gcp-test-project-id",
  });
}

export async function setupIntegrationTest(
  setupUsers: (
    firebaseAdminApp: App
  ) => Promise<ITestUser[]> = setupDefaultUsers
) {
  const firebaseAdminApp = connectToFirebaseEmulator();
  const env = await EnvironmentResolver.getEnvironment();
  const expressApp = buildApp(env);

  const testUsers = await setupUsers(firebaseAdminApp);
  return { firebaseAdminApp, expressApp, testUsers };
}

export async function tearDownIntegrationTest(
  firebaseAdminApp: App,
  testUsers: ITestUser[]
) {
  return await getAuth(firebaseAdminApp).deleteUsers(
    testUsers.map((u) => u.userRecord.uid)
  );
}
