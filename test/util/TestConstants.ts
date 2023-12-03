import { orgTableDef } from "../../src/db/model/entity/Organization";
import { userTableDef } from "../../src/db/model/entity/User";

// Firebase emulator details
export const TEST_GCP_PROJECT_ID = "gcp-test-project-id";
export const FIREBASE_AUTH_EMULATOR_HOST = "0.0.0.0:9099";
export const FIREBASE_TEST_API_KEY = "test-api-key";

// Test users
export const DEFAULT_TEST_USER = {
  email: "default@user.com",
  password: "defaultUser",
  profile: {
    firstName: "Default",
    lastName: "User",
    address: "Default address",
    dateOfBirth: new Date("1999-12-31"),
  },
};
export const DEFAULT_TEST_SUPERUSER = {
  email: "super@user.com",
  password: "superUser",
  profile: {
    firstName: "Super",
    lastName: "User",
    address: "Super address",
    dateOfBirth: new Date("1970-12-01"),
  },
};
export const TEST_USER_ONE = {
  email: "one@user.com",
  password: "oneUser",
  profile: {
    firstName: "Hello",
    lastName: "World",
    address: "The White House",
    dateOfBirth: new Date("1970-01-01"),
  },
};
export const TEST_USER_TWO = {
  email: "two@user.com",
  password: "twoUser",
  profile: {
    firstName: "John",
    lastName: "Doe",
    address: "Waffle House",
  },
};

export const TABLES_TO_TRUNCATE = [orgTableDef, userTableDef];
