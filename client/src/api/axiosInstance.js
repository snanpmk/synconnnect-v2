// src/api/axiosInstance.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

// -------------------------------
// BASE CONFIG
// -------------------------------
const BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// -------------------------------
// GLOBAL REFRESH CONTROL
// -------------------------------
let isRefreshing = false;
let refreshPromise = null;

// APIs that NEVER need token
const SKIP_REFRESH_URLS = [
  "/auth/login",
  "/auth/google",
  "/auth/register",
  "/auth/refresh",

  // 🔥 Your pages
  "/event", // analytics events
  "/user/public", // if any public fetch
];

// Check if refresh should be skipped
const shouldSkipRefresh = (url = "") =>
  SKIP_REFRESH_URLS.some((u) => url.includes(u));

// -------------------------------
// REQUEST INTERCEPTOR
// -------------------------------
api.interceptors.request.use(
  async (config) => {
    const { accessToken, setAccessToken, clearAuth } = useAuthStore.getState();

    let token = accessToken;

    // -------------------------------
    // 1️⃣ Skip refresh logic entirely for public/event routes
    // -------------------------------
    if (shouldSkipRefresh(config.url)) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }

    // -------------------------------
    // 2️⃣ If token exists → attach it
    // -------------------------------
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // -------------------------------
    // 3️⃣ If no token → attempt a SINGLE refresh
    // -------------------------------
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = axios
        .get(`${BASE_URL}/auth/refresh`, {
          withCredentials: true,
        })
        .then((res) => {
          const newToken = res?.data?.accessToken;
          if (!newToken) throw new Error("Refresh failed: No token returned.");

          setAccessToken(newToken);
          isRefreshing = false;
          return newToken;
        })
        .catch((err) => {
          console.error("❌ Token refresh failed:", err.message);
          isRefreshing = false;
          clearAuth();
          window.location.href = "/login";
          throw err;
        });
    }

    // Wait for the same refreshPromise for ALL simultaneous API calls
    token = await refreshPromise;

    // Attach new token
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },

  (error) => Promise.reject(error)
);

// -------------------------------
// RESPONSE INTERCEPTOR
// -------------------------------
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const { clearAuth } = useAuthStore.getState();

    // Unauthorized after refresh → force logout
    if (error?.response?.status === 401) {
      clearAuth();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
