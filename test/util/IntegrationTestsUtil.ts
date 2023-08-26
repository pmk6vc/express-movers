import * as admin from "firebase-admin";
import EnvironmentResolver from "../../src/environment/EnvironmentResolver";
import { buildApp } from "../../src/app";
import { getAuth } from "firebase-admin/auth";
import { app } from "firebase-admin";
import App = app.App;

async function setupDefaultUsers(firebaseAdminApp: App) {
  const user = await getAuth(firebaseAdminApp).createUser({
    email: "user@example.com",
    emailVerified: false,
    phoneNumber: "+11234567890",
    password: "secretPassword",
    displayName: "John Doe",
    photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false,
  });
  return [user.uid];
}

export async function setupIntegrationTest(
  setupUsers: (firebaseAdminApp: App) => Promise<string[]> = setupDefaultUsers
) {
  const firebaseAdminApp = admin.initializeApp();
  const env = await EnvironmentResolver.getEnvironment();
  const expressApp = buildApp(env);

  const userIds = await setupUsers(firebaseAdminApp);
  return { firebaseAdminApp, expressApp, userIds };
}

export async function tearDownIntegrationTest(
  firebaseAdminApp: App,
  userIds: string[]
) {
  return await getAuth(firebaseAdminApp).deleteUsers(userIds);
}
