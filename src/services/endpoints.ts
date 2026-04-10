// All API endpoint strings in one place.
// Backend team plugs in here — UI never changes when routes change.
export const ENDPOINTS = {
  // Auth
  LOGIN: "auth/login/",
  LOGOUT: "auth/logout/",
  SIGNUP: "auth/signup/",
  GOOGLE: "auth/google/",
  SEND_OTP: "auth/send-otp/",
  VERIFY_OTP: "auth/verify-otp/",

  // Threat data
  LOGS: "security/logs/",
  STATS: "security/stats/",
  TYPES: "security/types/",
  TOP_IPS: "security/top-ips/",

  // Actions
  BLOCK_IP: "security/actions/block-ip/",
  RESOLVE_INCIDENT: "security/actions/resolve-incident/",
  IGNORE_INCIDENT: "security/actions/ignore-incident/",

  // Vulnerability scan
  SCAN_RUN: "security/scan/run/",
  SCAN_RESULTS: "security/scan/results/",
} as const;
