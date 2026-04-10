import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import {
  fetchLogs,
  fetchStats,
  blockIPRequest,
  resolveIncidentRequest,
  ignoreIncidentRequest,
  runScanRequest,
} from "@/services/apiHandlers";
import {
  computeStats,
  appList,
  attackDistribution,
  computeAttackDistribution,
  activityTimeline,
  mockScanResults,
  vulnerabilityChart,
  LogEntry,
  Stats,
  ScanResult,
  Notification as NotificationType,
  mockNotifications,
} from "@/lib/mock-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScanStatus = "idle" | "scanning" | "completed" | "partial";

export interface ScanSummary {
  duration: number;
  totalTargets: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  requests: number;
}

export interface UserProfile {
  name: string;
  email: string;
}

export interface AppSettings {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  slackConnected: boolean;
  webhookUrl: string;
  twoFactorAuth: boolean; // personal user toggle
  userProfile: UserProfile;
  // Workspace Identity
  appName: string;
  orgName: string;
  env: "production" | "staging" | "development";
  // Appearance
  accentColor: string;
  use24h: boolean;
  theme: "system" | "light" | "dark";
  uiDensity: "compact" | "comfortable";
  autoSave: boolean;
  landingPage: string;
  refreshInterval: string;
  // Security - Password
  passwordLength: string;
  requireSymbols: boolean;
  requireCase: boolean;
  passwordExpiry: string;
  passwordHistory: string;
  // Security - Auth
  enforce2FA: boolean; // workspace global requirement
  otpMethod: string;
  trustedDevices: boolean;
  sessionTimeout: string;
  maxSessions: string;
  forceLogout: boolean;
  // Security - Access
  rbac: boolean;
  defaultRole: string;
  ipAllowlist: string;
  // Security - Threat
  anomalyDetect: boolean;
  geoAlerts: boolean;
  bruteForce: boolean;
  rateLimit: string;
  // Integrations
  apiKey: string;
  apiScope: string;
  retryPolicy: string;
  // Notifications panel specific
  criticalSev: boolean;
  highSev: boolean;
  mediumSev: boolean;
  lowSev: boolean;
  realtimeAlerts: boolean;
  weeklyReport: boolean;
  // System Data
  retention: string;
  storageLimit: string;
  autoClean: boolean;
  compression: boolean;
  backupFreq: string;
  // System Performance
  maxScans: string;
  processMode: string;
  // System Behavior
  autoRestart: boolean;
  debugMode: boolean;
  maintenance: boolean;
  logLevel: string;
}

const defaultSettings: AppSettings = {
  emailNotifications: true,
  inAppNotifications: true,
  slackConnected: false,
  webhookUrl: "",
  twoFactorAuth: false,
  userProfile: {
    name: "Operator",
    email: "admin@coresentinel.io",
  },
  appName: "Core Sentinel",
  orgName: "Core Sentinel Security Labs",
  env: "production",
  accentColor: "#22c55e",
  use24h: true,
  theme: "system",
  uiDensity: "comfortable",
  autoSave: true,
  landingPage: "dashboard",
  refreshInterval: "30s",
  // Default Security
  passwordLength: "12 characters",
  requireSymbols: true,
  requireCase: true,
  passwordExpiry: "90 days",
  passwordHistory: "Last 5 passwords",
  enforce2FA: true,
  otpMethod: "Authenticator App",
  trustedDevices: false,
  sessionTimeout: "30 minutes",
  maxSessions: "3 sessions",
  forceLogout: true,
  rbac: true,
  defaultRole: "Analyst",
  ipAllowlist: "",
  anomalyDetect: true,
  geoAlerts: true,
  bruteForce: true,
  rateLimit: "1000/min",
  // Integrations
  apiKey: "tx_live_••••••••••••••••••••••••••••",
  apiScope: "Read / Write",
  retryPolicy: "3 Retries (Exponential)",
  // Notifications specific
  criticalSev: true,
  highSev: true,
  mediumSev: true,
  lowSev: false,
  realtimeAlerts: true,
  weeklyReport: true,
  // System Data
  retention: "90 days",
  storageLimit: "5 GB",
  autoClean: true,
  compression: true,
  backupFreq: "Daily",
  // System Performance
  maxScans: "5",
  processMode: "Real-time",
  // System Behavior
  autoRestart: true,
  debugMode: false,
  maintenance: false,
  logLevel: "Info",
};

interface DashboardContextValue {
  // Settings
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Data
  logs: LogEntry[];
  stats: Stats;
  attackDistributionData: any[];
  activityTimelineData: any[];
  
  // Vulnerability Scan
  scanResults: ScanResult[];
  scanChartData: any[];
  scanning: boolean;
  scanProgress: number;
  scanStatus: ScanStatus;
  scanPhase: string;
  scanTarget: string | null;
  scanLogs: string[];
  scanSummary: ScanSummary | null;
  scanTimeElapsed: number;
  runScan: () => Promise<void>;
  // Notifications
  notifications: NotificationType[];
  addNotification: (title: string, message: string, type: "alert" | "info" | "success") => void;
  markAllNotificationsRead: () => void;

  // Filters & State
  selectedDate: Date;
  selectedApp: string;
  searchQuery: string;
  attackTypeFilter: string;
  sortField: "ip" | "attackType" | "severity" | "timestamp";
  sortDir: "asc" | "desc";

  // Actions
  setSelectedDate: (date: Date) => void;
  setSelectedApp: (app: string) => void;
  setSearchQuery: (query: string) => void;
  setAttackTypeFilter: (filter: string) => void;
  setSort: (field: "ip" | "attackType" | "severity" | "timestamp", dir: "asc" | "desc") => void;
  
  refreshKey: number;
  loading: boolean;
  error: string | null;

  // Business Actions
  refreshData: () => Promise<void>;
  blockIP: (ip: string, id: string) => Promise<void>;
  resolveIncident: (id: string) => Promise<void>;
  ignoreIncident: (id: string) => Promise<void>;

  // Derived
  filteredLogs: LogEntry[];
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ totalLogs: 0, totalAttacks: 0, activeThreats: 0, blockedIPs: 0 });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedApp, setSelectedApp] = useState<string>(appList[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [attackTypeFilter, setAttackTypeFilter] = useState("All");
  const [sortField, setSortField] = useState<"ip" | "attackType" | "severity" | "timestamp">("timestamp");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scan state
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>(mockScanResults);
  const [scanChartData, setScanChartData] = useState(vulnerabilityChart);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [scanPhase, setScanPhase] = useState("");
  const [scanTarget, setScanTarget] = useState<string | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanSummary, setScanSummary] = useState<ScanSummary | null>(null);
  const [scanTimeElapsed, setScanTimeElapsed] = useState(0);
  const [notifications, setNotifications] = useState<NotificationType[]>(mockNotifications);

  // Settings state with localStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("app_settings");
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          userProfile: {
            ...defaultSettings.userProfile,
            ...(parsed.userProfile || {}),
          },
        };
      }
      return defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Auto-save settings to localStorage and apply theme
  useEffect(() => {
    localStorage.setItem("app_settings", JSON.stringify(settings));
    
    const applyTheme = (t: "system" | "light" | "dark") => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      if (t === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(isDark ? "dark" : "light");
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(settings.theme);

    // Listen for system theme changes if set to system
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings.theme]);

  // ── Atomic updateSettings helper ─────────────────────────────────────────────
  // ── Notification Helpers ─────────────────────────────────────────────────────
  const addNotification = useCallback((title: string, message: string, type: "alert" | "info" | "success") => {
    const newNotif: NotificationType = {
      id: `n-${Date.now()}`,
      title,
      message,
      time: "Just now",
      read: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 49)]); // keep last 50
    if (settings.inAppNotifications) {
      if (type === "alert") toast.error(title);
      else if (type === "success") toast.success(title);
      else toast.info(title);
    }
  }, [settings.inAppNotifications]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // ── Simulated Activity ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!settings.inAppNotifications) return;

    const interval = setInterval(() => {
      const types = ["SQLi", "XSS", "Bruteforce", "DDoS"];
      const type = types[Math.floor(Math.random() * types.length)];
      const ips = ["192.168.1.45", "10.0.0.122", "172.16.0.89", "203.0.113.5"];
      const ip = ips[Math.floor(Math.random() * ips.length)];
      
      addNotification(
        `Critical: ${type} Detected`,
        `${type} attack attempt blocked from ${ip}`,
        "alert"
      );
    }, 90000); // every 90 seconds

    return () => clearInterval(interval);
  }, [addNotification, settings.inAppNotifications]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("app_settings", JSON.stringify(next));
      return next;
    });
  }, []);

  // Recompute stats whenever logs change
  useEffect(() => {
    const filtered =
      selectedApp === "All Apps"
        ? logs
        : logs.filter((l) => l.app === selectedApp);
    setStats(computeStats(filtered));
  }, [logs, selectedApp]);

  const runScan = async () => {
    setScanning(true);
    setScanStatus("scanning");
    setScanLogs([]);
    setScanSummary(null);
    setScanProgress(0);
    setScanTimeElapsed(0);

    const startTime = Date.now();
    let failedScanCount = 0;

    const phases = [
      "Target Discovery",
      "DNS Resolution",
      "Port Scanning",
      "Service Detection",
      "Vulnerability Analysis",
      "Report Generation"
    ];

    let totalRequests = 0;
    const vulnerabilities = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    // ⏱ Timer
    const timer = setInterval(() => {
      setScanTimeElapsed(((Date.now() - startTime) / 1000));
    }, 100);

    const updatedScanResults = [...scanResults];

    for (let i = 0; i < mockScanResults.length; i++) {
      const target = mockScanResults[i];
      setScanTarget(target.website);

      try {
        for (let phase of phases) {
          setScanPhase(phase);

          // 🧠 Add logs
          setScanLogs(prev => [
            ...prev.slice(-99), // limit logs
            `[${target.website}] ${phase}...`
          ]);

          // ⏳ Realistic delay (randomized)
          await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

          // 🔥 Simulate requests
          totalRequests += Math.floor(Math.random() * 50);

          // ⚠️ Random failure simulation (10%)
          if (Math.random() < 0.1) {
            throw new Error("Scan failed for " + target.website);
          }
          
          setScanProgress(p => p + (100 / (mockScanResults.length * phases.length)));
        }

        // 🎯 Simulate vulnerabilities
        const vulnCount = Math.floor(Math.random() * 5);
        vulnerabilities.critical += Math.floor(vulnCount * 0.2);
        vulnerabilities.high += Math.floor(vulnCount * 0.3);
        vulnerabilities.medium += Math.floor(vulnCount * 0.3);
        vulnerabilities.low += Math.floor(vulnCount * 0.2);

        updatedScanResults[i].vulnerabilities = vulnCount;
        updatedScanResults[i].status = vulnCount > 0 ? "Vulnerable" : "Safe";
        updatedScanResults[i].lastScanned = new Date().toISOString();
        
        addNotification(
          `Security Scan: ${target.website}`,
          `Finished analyzing ${target.website}. Detected ${vulnCount} vulnerabilities.`,
          vulnCount > 0 ? "alert" : "success"
        );
      } catch (err) {
        console.error(err);
        failedScanCount++;
        setScanLogs(prev => [
          ...prev.slice(-99),
          `[${target.website}] ERROR: Scan aborted.`
        ]);
        updatedScanResults[i].status = "Failed";
        updatedScanResults[i].lastScanned = new Date().toISOString();
      }
      
      setScanResults([...updatedScanResults]);
      setScanChartData(updatedScanResults.map((r) => ({
        name: r.website.replace(/\.(net|io|dev|internal)$/, ""),
        vulnerabilities: r.vulnerabilities,
      })));
    }

    clearInterval(timer);
    
    // Ensure accurate final duration check
    const duration = (Date.now() - startTime) / 1000;
    setScanTimeElapsed(duration);
    
    setScanSummary({
      duration,
      totalTargets: mockScanResults.length,
      vulnerabilities,
      requests: totalRequests
    });

    setScanning(false);
    if (failedScanCount === mockScanResults.length) {
      setScanStatus("partial");
      addNotification("Scan Failed", "Vulnerability scan failed for all targets.", "alert");
    } else if (failedScanCount > 0) {
      setScanStatus("partial");
      addNotification("Scan Partial", "Vulnerability scan partially complete with errors.", "alert");
    } else {
      setScanStatus("completed");
      addNotification("Scan Complete", "Vulnerability scan successfully finished for all targets.", "success");
    }
  };

  const setSort = (field: "ip" | "attackType" | "severity" | "timestamp", dir: "asc" | "desc") => {
    setSortField(field);
    setSortDir(dir);
  };

  // Derive Data
  const filteredLogs = useCallback(() => {
    let list = selectedApp === "All Apps" ? logs : logs.filter(l => l.app === selectedApp);
    if (attackTypeFilter !== "All") list = list.filter(l => l.attackType === attackTypeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(l => l.ip.includes(q) || l.payload.toLowerCase().includes(q));
    }
    const severityOrder: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "severity") cmp = (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0);
      else if (sortField === "timestamp") cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      else cmp = String(a[sortField]).localeCompare(String(b[sortField]));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [logs, selectedApp, attackTypeFilter, searchQuery, sortField, sortDir])();

  const attackDistributionData = useCallback(() => {
    return computeAttackDistribution(filteredLogs);
  }, [filteredLogs])();

  const activityTimelineData = (stats as any).activityTimeline || activityTimeline;

  // ── refreshData ─────────────────────────────────────────────────────────────
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [freshLogs, freshStats] = await Promise.all([
        fetchLogs(),
        fetchStats(),
      ]);
      setLogs(freshLogs);
      setStats(freshStats);

      // 🚨 Auto-alert for Critical logs detected in refresh
      const criticalLog = freshLogs.find(l => l.severity === "Critical");
      if (criticalLog && settings.inAppNotifications) {
        addNotification(
          "Critical Threat Detected",
          `A new ${criticalLog.attackType} attack was detected from IP ${criticalLog.ip}.`,
          "alert"
        );
      }
    } catch {
      setError("Failed to refresh. Showing cached data.");
      if (settings.inAppNotifications) toast.error("Connection error — showing cached data.");
      // Graceful degradation: keep existing mock data
    } finally {
      setLoading(false);
      setRefreshKey((k) => k + 1);
    }
  }, []);

  // ── Auto-fetch real data on mount ──────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem("coresentinel_token")) {
      refreshData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── blockIP ─────────────────────────────────────────────────────────────────
  const blockIP = useCallback(async (ip: string, id: string) => {
    try {
      await blockIPRequest(ip);
    } catch {
      // Best-effort: also update local state even if API fails
    }
    setLogs((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "Blocked" as const } : l
      )
    );
    if (settings.inAppNotifications) toast.success(`IP ${ip} has been blocked.`);
  }, [settings.inAppNotifications]);

  // ── resolveIncident ─────────────────────────────────────────────────────────
  const resolveIncident = useCallback(async (id: string) => {
    try {
      await resolveIncidentRequest(id);
    } catch {
      // best-effort
    }
    setLogs((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "Blocked" as const } : l
      )
    );
    if (settings.inAppNotifications) toast.success("Incident resolved.");
  }, [settings.inAppNotifications]);

  // ── ignoreIncident ──────────────────────────────────────────────────────────
  const ignoreIncident = useCallback(async (id: string) => {
    try {
      await ignoreIncidentRequest(id);
    } catch {
      // best-effort
    }
    setLogs((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "Ignored" as const } : l
      )
    );
    if (settings.inAppNotifications) toast.info("Incident marked as ignored.");
  }, [settings.inAppNotifications]);

  return (
    <DashboardContext.Provider
      value={{
        settings,
        setSettings,
        updateSettings,
        logs,
        stats,
        attackDistributionData,
        activityTimelineData,
        scanResults,
        scanChartData,
        scanning,
        scanProgress,
        scanStatus,
        scanPhase,
        scanTarget,
        scanLogs,
        scanSummary,
        scanTimeElapsed,
        runScan,
        selectedDate,
        selectedApp,
        searchQuery,
        attackTypeFilter,
        sortField,
        sortDir,
        setSelectedDate,
        setSelectedApp,
        setSearchQuery,
        setAttackTypeFilter,
        setSort,
        refreshKey,
        loading,
        error,
        refreshData,
        blockIP,
        resolveIncident,
        ignoreIncident,
        filteredLogs,
        notifications,
        addNotification,
        markAllNotificationsRead,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be inside DashboardProvider");
  return ctx;
}
