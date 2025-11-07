// src/api/axiosInstance.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // allows cookies for refresh token auth
});

// ✅ Request Interceptor
api.interceptors.request.use(async (config) => {
  const { accessToken, setAccessToken, clearAuth } = useAuthStore.getState();
  let token = accessToken;

  // Skip refresh for auth endpoints
  const skipRefresh =
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/google") ||
    config.url.includes("/auth/register") ||
    config.url.includes("/auth/refresh");

  if (!token && !skipRefresh) {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/auth/refresh`,
        { withCredentials: true }
      );

      token = res.data.accessToken;
      setAccessToken(token);
    } catch (err) {
      console.error("Token refresh failed:", err);
      if (typeof clearAuth === "function") clearAuth();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Optional: Global Response Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().clearAuth?.();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
