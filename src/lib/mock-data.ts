// Mock data for the Core Sentinel dashboard

export interface LogEntry {
  id: string;
  ip: string;
  attackType: "SQLi" | "XSS" | "Bruteforce" | "DDoS";
  payload: string;
  timestamp: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Active" | "Blocked" | "Investigating" | "Ignored";
  app: string;
}

export interface ScanResult {
  id: string;
  website: string;
  status: "Vulnerable" | "Safe" | "Warning" | "Failed";
  vulnerabilities: number;
  lastScanned: string;
  details?: string[];
}

export interface Stats {
  totalLogs: number;
  totalAttacks: number;
  activeThreats: number;
  blockedIPs: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "alert" | "info" | "success";
}

export const appList = ["All Apps", "Dashboard", "Veloura", "Electron"];

export const mockNotifications: Notification[] = [
  { id: "n1", title: "Critical: SQLi Detected", message: "SQL injection attempt from 192.168.1.45", time: "2 min ago", read: false, type: "alert" },
  { id: "n2", title: "Scan Complete", message: "Vulnerability scan finished for coresentinel.app", time: "15 min ago", read: false, type: "success" },
  { id: "n3", title: "IP Blocked", message: "10.0.0.122 has been blocked automatically", time: "1 hour ago", read: true, type: "info" },
  { id: "n4", title: "DDoS Alert", message: "SYN flood detected from 203.0.113.5", time: "2 hours ago", read: true, type: "alert" },
];

export const mockLogs: LogEntry[] = [
  { id: "1", ip: "192.168.1.45", attackType: "SQLi", payload: "' OR 1=1 --", timestamp: "2026-03-17T14:23:11Z", severity: "Critical", status: "Active", app: "Veloura" },
  { id: "2", ip: "10.0.0.122", attackType: "XSS", payload: "<script>alert('xss')</script>", timestamp: "2026-03-17T14:21:05Z", severity: "High", status: "Blocked", app: "Electron" },
  { id: "3", ip: "172.16.0.89", attackType: "Bruteforce", payload: "admin:password123", timestamp: "2026-03-17T14:19:33Z", severity: "Medium", status: "Active", app: "Dashboard" },
  { id: "4", ip: "203.0.113.5", attackType: "DDoS", payload: "SYN flood detected", timestamp: "2026-03-17T14:17:22Z", severity: "Critical", status: "Investigating", app: "Veloura" },
  { id: "5", ip: "198.51.100.14", attackType: "SQLi", payload: "UNION SELECT * FROM users", timestamp: "2026-03-17T14:15:01Z", severity: "Critical", status: "Active", app: "Electron" },
  { id: "6", ip: "45.33.21.8", attackType: "XSS", payload: "<img onerror=alert(1)>", timestamp: "2026-03-17T14:12:44Z", severity: "High", status: "Blocked", app: "Dashboard" },
  { id: "7", ip: "91.198.174.2", attackType: "Bruteforce", payload: "root:toor", timestamp: "2026-03-17T14:10:18Z", severity: "Medium", status: "Active", app: "Veloura" },
  { id: "8", ip: "185.220.101.6", attackType: "SQLi", payload: "'; DROP TABLE users;--", timestamp: "2026-03-17T14:08:55Z", severity: "Critical", status: "Active", app: "Electron" },
  { id: "9", ip: "104.21.56.78", attackType: "XSS", payload: "javascript:void(0)", timestamp: "2026-03-17T14:06:30Z", severity: "Low", status: "Blocked", app: "Dashboard" },
  { id: "10", ip: "78.46.91.34", attackType: "Bruteforce", payload: "admin:admin", timestamp: "2026-03-17T14:04:12Z", severity: "High", status: "Investigating", app: "Veloura" },
  { id: "11", ip: "62.210.72.11", attackType: "SQLi", payload: "1; EXEC xp_cmdshell", timestamp: "2026-03-16T22:15:00Z", severity: "Critical", status: "Blocked", app: "Electron" },
  { id: "12", ip: "185.56.80.3", attackType: "DDoS", payload: "UDP amplification", timestamp: "2026-03-16T18:30:00Z", severity: "High", status: "Active", app: "Dashboard" },
];

export const mockScanResults: ScanResult[] = [
  { id: "1", website: "coresentinel.app", status: "Vulnerable", vulnerabilities: 12, lastScanned: "2026-03-17T13:00:00Z", details: ["SQL Injection in /api/login", "XSS in search field", "Outdated TLS 1.0", "Missing CSP headers"] },
  { id: "2", website: "Veloura", status: "Safe", vulnerabilities: 0, lastScanned: "2026-03-17T12:30:00Z", details: [] },
  { id: "3", website: "Electron", status: "Warning", vulnerabilities: 3, lastScanned: "2026-03-17T11:45:00Z", details: ["Open redirect in /callback", "Missing rate limiting", "Verbose error messages"] },
  { id: "4", website: "Dashboard", status: "Safe", vulnerabilities: 0, lastScanned: "2026-03-17T10:00:00Z", details: [] },
  { id: "5", website: "legacy.internal", status: "Vulnerable", vulnerabilities: 8, lastScanned: "2026-03-17T09:15:00Z", details: ["Outdated dependencies", "No HTTPS", "Default credentials", "Path traversal"] },
];

export const attackDistribution = [
  { name: "SQLi", value: 482, fill: "#F87171" },
  { name: "XSS", value: 356, fill: "#FBBF24" },
  { name: "Bruteforce", value: 287, fill: "#4ADE80" },
  { name: "DDoS", value: 168, fill: "#A3E635" },
];

export const activityTimeline = [
  { time: "00:00", attacks: 12 },
  { time: "04:00", attacks: 5 },
  { time: "08:00", attacks: 28 },
  { time: "10:00", attacks: 45 },
  { time: "12:00", attacks: 38 },
  { time: "14:00", attacks: 62 },
  { time: "16:00", attacks: 51 },
  { time: "18:00", attacks: 33 },
  { time: "20:00", attacks: 19 },
  { time: "22:00", attacks: 8 },
];

export const vulnerabilityChart = [
  { name: "coresentinel.app", vulnerabilities: 12 },
  { name: "Veloura", vulnerabilities: 0 },
  { name: "Electron", vulnerabilities: 3 },
  { name: "Dashboard", vulnerabilities: 0 },
  { name: "legacy.internal", vulnerabilities: 8 },
];

// Helper to compute stats from logs (Real count, no simulation multipliers)
export function computeStats(logs: LogEntry[]): Stats {
  return {
    totalLogs: logs.length,
    totalAttacks: logs.length,
    activeThreats: logs.filter((l) => l.status === "Active").length,
    blockedIPs: logs.filter((l) => l.status === "Blocked").length,
  };
}

// Helper to compute attack distribution from logs (Accurate counts)
export function computeAttackDistribution(logs: LogEntry[]) {
  const counts: Record<string, number> = { SQLi: 0, XSS: 0, Bruteforce: 0, DDoS: 0 };
  
  logs.forEach((l) => {
    // Basic mapping for legacy or alternative names
    const type = l.attackType as string;
    if (type.includes("SQL")) counts.SQLi++;
    else if (type.includes("XSS")) counts.XSS++;
    else if (type.includes("Brute")) counts.Bruteforce++;
    else if (type.includes("DDoS") || type.includes("DDOS")) counts.DDoS++;
    else if (counts[type] !== undefined) counts[type]++;
  });

  const fills: Record<string, string> = { SQLi: "#F87171", XSS: "#FBBF24", Bruteforce: "#4ADE80", DDoS: "#A3E635" };
  return Object.entries(counts).map(([name, value]) => ({ 
    name, 
    value, 
    fill: fills[name] 
  }));
}
