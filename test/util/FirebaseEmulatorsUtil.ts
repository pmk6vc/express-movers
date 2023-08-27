import axios from "axios";
import {
  FIREBASE_AUTH_EMULATOR_HOST,
  FIREBASE_TEST_API_KEY,
} from "./TestConstants";
import axiosRetry from "axios-retry";

const authEmulatorClient = axios.create({
  baseURL: `http://${FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com`,
});
axiosRetry(authEmulatorClient, {
  retries: 3,
  retryDelay: () => {
    return 1000;
  },
});
export async function getIdTokenWithEmailPassword(
  email: string,
  password: string
) {
  const res = await authEmulatorClient({
    method: "POST",
    url: `/v1/accounts:signInWithPassword?key=${FIREBASE_TEST_API_KEY}`,
    data: {
      email: email,
      password: password,
    },
  });
  return res.data.idToken;
}
