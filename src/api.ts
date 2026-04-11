/**
 * Centralized API base URL configuration.
 * Using VITE_API_URL environment variable for flexibility across environments.
 */
export const BASE_URL = import.meta.env.VITE_API_URL || "http://51.20.128.3";

// Optional: Fallback for development if .env is missing
export const API_BASE_URL = `${BASE_URL.replace(/\/$/, "")}/api/`;
