import axios from "axios";
import {
  FIREBASE_AUTH_EMULATOR_HOST,
  FIREBASE_TEST_API_KEY,
} from "./TestConstants";

export async function getIdTokenWithEmailPassword(
  email: string,
  password: string
) {
  const res = await axios({
    method: "POST",
    url: `http://${FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_TEST_API_KEY}`,
    data: {
      email: email,
      password: password,
    },
  });
  return res.data.idToken;
}
