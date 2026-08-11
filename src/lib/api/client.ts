import axios from "axios";

/** Reserved for future remote features (URL import, share links, etc.). */
export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});
