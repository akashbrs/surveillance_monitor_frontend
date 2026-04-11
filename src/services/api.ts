import axios from "axios";
import { API_BASE_URL } from "@/api";

// Central Axios instance — all requests flow through here
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — inject Bearer token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("coresentinel_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally and format errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session expired or unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("coresentinel_token");
      localStorage.removeItem("coresentinel_user");
      localStorage.removeItem("coresentinel_2fa_verified");
      
      // Only redirect if not on public pages
      const publicPaths = ["/", "/signup", "/forgot-password"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/";
      }
    }

    // Extract message from response if available
    const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
    error.displayMessage = errorMessage;

    return Promise.reject(error);
  }
);

export default API;

