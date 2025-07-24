import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

function waitForFirebaseAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function secureFetch(url, options = {}) {
  let user = auth.currentUser;

  if (!user) {
    user = await waitForFirebaseAuth();
  }

  if (!user) {
    throw new Error("User not authenticated");
  }

  const idToken = await user.getIdToken(true);

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
  };

  const axiosConfig = {
    url,
    method: options.method || "GET",
    headers,
  };

  // Only attach body for non-GET, non-DELETE methods
  if (options.body && !["GET", "DELETE"].includes(options.method)) {
    axiosConfig.data = options.body;
  }

  return axios(axiosConfig);
}
