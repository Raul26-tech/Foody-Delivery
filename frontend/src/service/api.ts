import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
  },
});
