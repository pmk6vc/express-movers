import { beforeEach, describe, expect, it } from "@jest/globals";
import { Express } from "express";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import { buildApp } from "../../../src/app";
import request from "supertest";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";
import { GCP_TEST_PROJECT_ID } from "../../util/TestConstants";

// To test signed in user, see: https://www.reddit.com/r/Firebase/comments/qmsr9h/writeup_on_testing_cloud_functions_with_the/
describe("should check auth routes", () => {
  let app: Express;
  let uid: string;
  const ENV = process.env;

  beforeAll(async () => {
    // TODO: Requires emulator to be running at this IP address and GCP project
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
    admin.initializeApp({
      projectId: GCP_TEST_PROJECT_ID,
    });

    const env = await EnvironmentResolver.getEnvironment();
    app = buildApp(env);
    const user = await getAuth().createUser({
      email: "user@example.com",
      emailVerified: false,
      phoneNumber: "+11234567890",
      password: "secretPassword",
      displayName: "John Doe",
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false,
    });
    uid = user.uid;
  });

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...ENV };
    await EnvironmentResolver.getEnvironmentHandler().runUpMigrations();
  });

  afterEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runDownMigrations();
  });

  afterAll(() => {
    getAuth().deleteUser(uid);
    process.env = ENV;
  });

  const ROUTE_PREFIX = "/auth";

  it("returns a list of users", async () => {
    const res = await request(app).get(`${ROUTE_PREFIX}/list`).expect(200);
    console.log(res.body);
  });
});
