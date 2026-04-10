// ─────────────────────────────────────────────────────────────────────────────
// CORE SENTINEL FRONTEND ↔ BACKEND DATA CONTRACT
// ─────────────────────────────────────────────────────────────────────────────
// This file contains the exact TypeScript interfaces the frontend expects
// from the backend. The backend payload MUST match these structures.

export interface LogEntry {
  id: string;
  ip: string;
  attackType: "SQLi" | "XSS" | "Bruteforce" | "DDoS";
  payload: string;
  timestamp: string; // ISO 8601 string
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Active" | "Blocked" | "Investigating" | "Ignored";
  app: string;
  target?: string;
}

export interface Stats {
  totalLogs: number;
  totalAttacks: number;
  activeThreats: number;
  blockedIPs: number;
}

export interface ScanResult {
  id: string;
  website: string;
  status: "Vulnerable" | "Safe" | "Warning" | "Failed";
  vulnerabilities: number;
  lastScanned: string; // ISO 8601 string
  details?: string[];
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    name: string;
    role: string;
  };
}

// Global API Response wrapper expected from all backend endpoints
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
