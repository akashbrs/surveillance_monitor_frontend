// API Handlers — typed async functions wrapping all API calls.
// RULE: Components and contexts NEVER import from api.ts directly.
// All interactions with the backend go through this file only.

import API from "./api";
import { ENDPOINTS } from "./endpoints";
import {
  LogEntry,
  ScanResult,
  Stats,
  AuthResponse,
  ApiResponse,
} from "./types";
import { mockLogs, computeStats, mockScanResults } from "@/lib/mock-data";

// ─── Configuration ───────────────────────────────────────────────────────────

// TOGGLE THIS TO FALSE WHEN REAL BACKEND API IS READY
export const USE_MOCK = false;

// Global API Error Wrapper
const safeRequest = async <T>(
  requestFn: () => Promise<T>,
  mockFallback: T,
  validator?: (data: any) => boolean
): Promise<T> => {
  if (USE_MOCK) {
    // Simulate network delay for real UI feel
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockFallback;
  }

  try {
    const data = await requestFn();
    if (validator && !validator(data)) {
      console.warn("[API] Validation failed on response data, using fallback.");
      return mockFallback;
    }
    return data;
  } catch (err) {
    console.error("[API Error]:", err);
    // Propagate the error so the UI can show a proper error state
    throw err;
  }
};



// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await API.post<ApiResponse<AuthResponse>>(ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return res.data.data;
  } catch (err) {
    console.error("Login call failed", err);
    throw err;
  }
};

export const signupUser = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  try {
    const res = await API.post<ApiResponse<AuthResponse>>(ENDPOINTS.SIGNUP, {
      email,
      password,
      name,
    });
    return res.data.data;
  } catch (err) {
    console.error("Signup failed", err);
    throw err;
  }
};

export const loginWithGoogleRequest = async (token: string): Promise<AuthResponse> => {
  // Bypassing safeRequest here to enforce Django backend for this specific task
  try {
    const res = await API.post<ApiResponse<AuthResponse>>(ENDPOINTS.GOOGLE, { token });
    return res.data.data;
  } catch (err) {
    console.error("Google login failed", err);
    throw err;
  }
};

export const logoutUser = async (): Promise<void> => {
  return safeRequest(
    async () => {
      await API.post(ENDPOINTS.LOGOUT);
    },
    undefined as void
  );
};

export const sendOTPRequest = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await API.post(ENDPOINTS.SEND_OTP);
    return res.data;
  } catch (err) {
    console.error("Failed to send OTP", err);
    throw err;
  }
};

export const verifyOTPRequest = async (otp: string): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await API.post(ENDPOINTS.VERIFY_OTP, { otp });
    return res.data;
  } catch (err) {
    console.error("Failed to verify OTP", err);
    throw err;
  }
};

// ─── Threat Logs ─────────────────────────────────────────────────────────────

export const fetchLogs = async (): Promise<LogEntry[]> => {
  return safeRequest(
    async () => {
      const res = await API.get<ApiResponse<LogEntry[]>>(ENDPOINTS.LOGS);
      return res.data.data;
    },
    mockLogs,
    (data) => Array.isArray(data)
  );
};

export const fetchStats = async (): Promise<Stats> => {
  return safeRequest(
    async () => {
      const res = await API.get<ApiResponse<Stats>>(ENDPOINTS.STATS);
      return res.data.data;
    },
    computeStats(mockLogs),
    (data) => typeof data.totalLogs === "number"
  );
};

// ─── Actions ─────────────────────────────────────────────────────────────────

export const blockIPRequest = async (ip: string): Promise<void> => {
  return safeRequest(
    async () => {
      await API.post(ENDPOINTS.BLOCK_IP, { ip });
    },
    undefined as void
  );
};

export const resolveIncidentRequest = async (id: string): Promise<void> => {
  return safeRequest(
    async () => {
      await API.post(ENDPOINTS.RESOLVE_INCIDENT, { id });
    },
    undefined as void
  );
};

export const ignoreIncidentRequest = async (id: string): Promise<void> => {
  return safeRequest(
    async () => {
      await API.post(ENDPOINTS.IGNORE_INCIDENT, { id });
    },
    undefined as void
  );
};

// ─── Vulnerability Scan ───────────────────────────────────────────────────────

export const runScanRequest = async (): Promise<ScanResult[]> => {
  return safeRequest(
    async () => {
      const res = await API.post<ApiResponse<ScanResult[]>>(ENDPOINTS.SCAN_RUN);
      return res.data.data;
    },
    mockScanResults,
    (data) => Array.isArray(data)
  );
};
