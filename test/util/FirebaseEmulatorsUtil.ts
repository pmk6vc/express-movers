import axios from "axios";

export async function getIdTokenWithEmailPassword(
  email: string,
  password: string
) {
  const res = await axios({
    method: "POST",
    url: "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test-api-key",
    data: {
      email: email,
      password: password,
    },
  });
  return res.data.idToken;
}
