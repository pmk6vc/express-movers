// Firebase emulator details
import { permissionsTableDef } from "../../src/db/model/entity/Permissions";
import { rolesTableDef } from "../../src/db/model/entity/Roles";
import { rolesPermissionsTableDef } from "../../src/db/model/entity/RolesPermissions";
import { dummyPostTableDef } from "../../src/db/model/example/DummyPost";
import { dummyUserTableDef } from "../../src/db/model/example/DummyUser";

export const TEST_GCP_PROJECT_ID = "gcp-test-project-id";
export const FIREBASE_AUTH_EMULATOR_HOST = "0.0.0.0:9099";
export const FIREBASE_TEST_API_KEY = "test-api-key";

// Test users
export const DEFAULT_TEST_USER = {
  email: "default@user.com",
  emailVerified: false,
  phoneNumber: "+11234567890",
  password: "defaultUser",
  displayName: "John Doe",
  photoURL: "http://www.example.com/12345678/photo.png",
  disabled: false,
};
export const FIRST_TEST_USER = {
  email: "first@user.com",
  password: "firstUser",
};
export const SECOND_TEST_USER = {
  email: "second@user.com",
  password: "secondUser",
};

export const TABLES_TO_TRUNCATE = [
  dummyUserTableDef,
  dummyPostTableDef,
  rolesTableDef,
  permissionsTableDef,
  rolesPermissionsTableDef,
];
