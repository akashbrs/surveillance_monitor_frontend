import axios from "axios";

// Central Axios instance — all requests flow through here
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8008/api/",
  timeout: 10000,
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

// Response interceptor — handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("coresentinel_token");
      localStorage.removeItem("coresentinel_user");
      if (window.location.pathname !== "/" && window.location.pathname !== "/signup") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
