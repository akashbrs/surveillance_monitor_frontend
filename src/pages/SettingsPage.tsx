import { useState, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Settings, Shield, Bell, Plug, Database,
  Globe, RefreshCw, Trash2, Copy, AlertTriangle, Save,
  RotateCcw, Link, Sparkles, Clock, Activity,
  KeyRound, Smartphone, Monitor, MapPin, Zap,
  ShieldCheck, Users, Lock, Eye, FileText,
  Mail, MessageSquare, Send, CheckCircle2, XCircle, Filter, Calendar, History,
  Moon, Sun
} from "lucide-react";
import DangerButton from "@/components/common/DangerButton";

/* ─── Types ─── */
type Tab = "general" | "security";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "General", icon: <Settings className="h-4 w-4" /> },
  { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
];

/* ─── Shared CSS atoms ─── */
const sectionCard = "bg-gray-900/5 dark:bg-white/5 border border-gray-900/10 dark:border-white/10 rounded-xl p-5 sm:p-6 space-y-5 hover:border-gray-900/20 dark:border-white/20 transition-all duration-200";
const sectionTitle = "text-base font-semibold text-gray-900 dark:text-white mb-2";
const inputCls = "w-full sm:w-[320px] rounded-lg border border-gray-900/[0.06] dark:border-white/[0.06] bg-gray-900/[0.03] dark:bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30 transition-all duration-200";
const selectCls = `${inputCls} cursor-pointer`;
const labelCls = "block text-xs font-semibold uppercase tracking-wider text-gray-900/60 dark:text-white/60 mb-0";
const descCls = "text-sm text-gray-900/50 dark:text-white/50 mt-1 max-w-[400px]";
const rowContainer = "flex flex-col sm:flex-row sm:items-center justify-between gap-4";
const divider = "border-t border-gray-900/5 dark:border-white/5 pt-5 mt-5";

/* ─── Color swatch button ─── */
const colorOptions = [
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Cyan", value: "#06b6d4" },
];

/* ─── Section components ─── */

function GeneralSection({ settings, setSettings }: { settings: any, setSettings: React.Dispatch<React.SetStateAction<any>> }) {
  const markDirty = useCallback(() => {}, []);

  const envLabel = settings.env === "production" ? "🟢 Production" : settings.env === "staging" ? "🟠 Staging" : "🟡 Development";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* ═══════════ LEFT COLUMN ═══════════ */}
      <div className="xl:col-span-2 space-y-6">

        {/* ── Application Info ── */}
        <div className={sectionCard}>
          <h3 className={sectionTitle}>Application Info</h3>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Application Name</label>
              <p className={descCls}>The public display name used across your platform.</p>
            </div>
            <input
              className={inputCls}
              value={settings.appName}
              onChange={(e) => {
                setSettings((prev) => ({ ...prev, appName: e.target.value }));
                markDirty();
              }}
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Organization Name</label>
              <p className={descCls}>Your company or team entity managing threat operations.</p>
            </div>
            <input
              className={inputCls}
              value={settings.orgName}
              onChange={(e) => {
                setSettings((prev) => ({ ...prev, orgName: e.target.value }));
                markDirty();
              }}
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Slug / URL Preview</label>
              <p className={descCls}>Auto-generated workspace address derived from app name.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-[320px]">
              <Link className="h-4 w-4 text-gray-900/30 dark:text-white/30 shrink-0" />
              <span className="text-sm text-gray-900/40 dark:text-white/40 font-mono truncate">
                coresentinel.app/
                <span className="text-green-400/70">
                  {settings.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "—"}
                </span>
              </span>
            </div>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Environment</label>
              <p className={descCls}>Controls feature flags and logging verbosity.</p>
            </div>
            <Select
              value={settings.env}
              onValueChange={(v: any) => {
                setSettings((prev) => ({ ...prev, env: v }));
                markDirty();
              }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="development">🟡 Development</SelectItem>
                <SelectItem value="staging">🟠 Staging</SelectItem>
                <SelectItem value="production">🟢 Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Localization ── */}
        <div className={sectionCard}>
          <h3 className={sectionTitle}>Localization</h3>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Timezone</label>
              <p className={descCls}>Controls dates and timestamps across reports.</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="UTC+00:00 — London">
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="UTC+00:00 — London">UTC+00:00 — London</SelectItem>
                <SelectItem value="UTC+05:30 — Mumbai / Kolkata">UTC+05:30 — Mumbai / Kolkata</SelectItem>
                <SelectItem value="UTC−05:00 — Eastern Time">UTC−05:00 — Eastern Time</SelectItem>
                <SelectItem value="UTC−08:00 — Pacific Time">UTC−08:00 — Pacific Time</SelectItem>
                <SelectItem value="UTC+01:00 — Central Europe">UTC+01:00 — Central Europe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Language</label>
              <p className={descCls}>Interface language across the team namespace.</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="English (US)">
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="English (US)">English (US)</SelectItem>
                <SelectItem value="English (UK)">English (UK)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Date Format</label>
              <p className={descCls}>How dates display in tables, charts, and exports.</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="DD/MM/YYYY">
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Time Format</label>
              <p className={descCls}>12-hour or 24-hour clock display.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${!settings.use24h ? "text-green-400 font-semibold" : "text-gray-900/40 dark:text-white/40"}`}>12h</span>
              <Switch
                checked={settings.use24h}
                onCheckedChange={(v) => {
                  setSettings((prev: any) => ({ ...prev, use24h: v }));
                  markDirty();
                }}
              />
              <span className={`text-sm ${settings.use24h ? "text-green-400 font-semibold" : "text-gray-900/40 dark:text-white/40"}`}>24h</span>
            </div>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Theme Preference</label>
              <p className={descCls}>Choose between System, Light, or Dark mode.</p>
            </div>
            <Select
              value={settings.theme}
              onValueChange={(v: "system" | "light" | "dark") => {
                setSettings((prev: any) => ({ ...prev, theme: v }));
                markDirty();
              }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select theme..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>System Default</span>
                  </div>
                </SelectItem>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


      </div>

      {/* ═══════════ RIGHT COLUMN ═══════════ */}
      <div className="xl:col-span-1 space-y-6">

        {/* ── Settings Summary ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Settings Summary</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Workspace URL</span>
              <span className="text-sm text-green-400/80 font-mono">
                coresentinel.app/{settings.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "—"}
              </span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Environment</span>
              <span className="text-sm text-gray-900/80 dark:text-white/80 capitalize">{settings.env}</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Auto Save</span>
              <span className={`text-sm font-medium ${settings.autoSave ? "text-green-400" : "text-gray-900/40 dark:text-white/40"}`}>{settings.autoSave ? "Enabled" : "Disabled"}</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Refresh Rate</span>
              <span className="text-sm text-gray-900/80 dark:text-white/80">{settings.refreshInterval}</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Landing Page</span>
              <span className="text-sm text-gray-900/80 dark:text-white/80 capitalize">{settings.landingPage}</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Last Updated</span>
              <span className="flex items-center gap-1.5 text-sm text-gray-900/50 dark:text-white/50">
                <Clock className="h-3.5 w-3.5" />
                Just now
              </span>
            </div>
          </div>
        </div>

        {/* ── System Preferences ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">System Preferences</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <p className={labelCls}>Auto Save</p>
              <p className={descCls}>Persist changes automatically.</p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(v) => {
                setSettings((prev) => ({ ...prev, autoSave: v }));
                markDirty();
              }}
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Landing Page</label>
              <p className={descCls}>First view after login.</p>
            </div>
            <Select
              value={settings.landingPage}
              onValueChange={(v) => {
                setSettings((prev) => ({ ...prev, landingPage: v }));
                markDirty();
              }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="threats">Threats</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="logs">Logs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Refresh Interval</label>
              <p className={descCls}>Data polling frequency.</p>
            </div>
            <Select
              value={settings.refreshInterval}
              onValueChange={(v) => {
                setSettings((prev) => ({ ...prev, refreshInterval: v }));
                markDirty();
              }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="5s">Every 5s</SelectItem>
                <SelectItem value="30s">Every 30s</SelectItem>
                <SelectItem value="1m">Every 1m</SelectItem>
                <SelectItem value="5m">Every 5m</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5 sm:p-6 space-y-5 hover:border-red-500/30 transition-all duration-200">
          <h3 className="text-base font-semibold text-red-500/90 tracking-wide">Danger Zone</h3>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-400">Reset All Settings</p>
            <p className="text-[13px] text-red-200/50 mb-3">
              Restores every configuration back to factory defaults.
            </p>
            <DangerButton
              label="Reset Settings"
              icon={<RotateCcw className="h-4 w-4" />}
              className="w-full"
              title="Factory Reset Defaults"
              description="This will instantly overwrite all modified properties back to defaults."
              expectedText="reset"
              onConfirm={() => toast.success("Settings restored to factory defaults")}
            />
          </div>

          <div className={divider}>
            <p className="text-sm font-semibold text-red-400">Delete Workspace</p>
            <p className="text-[13px] text-red-200/50 mt-1 mb-3">
              Permanently removes this workspace and all associated data.
            </p>
            <DangerButton
              label="Delete Workspace"
              icon={<Trash2 className="h-4 w-4" />}
              className="w-full"
              title="Delete Entire Workspace"
              description="This completely rips your organization from the server. Zero recovery possible."
              expectedText="delete-workspace"
              onConfirm={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySection({ settings, setSettings }: { settings: any, setSettings: React.Dispatch<React.SetStateAction<any>> }) {
  const markDirty = useCallback(() => {}, []);

  const securityScore = [
    settings.enforce2FA, settings.requireSymbols, settings.requireCase, 
    settings.bruteForce, settings.anomalyDetect, settings.geoAlerts, 
    settings.rbac, settings.forceLogout
  ].filter(Boolean).length;
  
  const scorePercent = Math.round((securityScore / 8) * 100);
  const scoreColor = scorePercent >= 80 ? "text-green-400" : scorePercent >= 50 ? "text-amber-400" : "text-red-400";
  const scoreBg = scorePercent >= 80 ? "bg-green-400" : scorePercent >= 50 ? "bg-amber-400" : "bg-red-400";

  const sessions = [
    { device: "Chrome · Windows", ip: "192.168.1.42", location: "Hyderabad, IN", current: true },
    { device: "Safari · macOS", ip: "10.0.0.18", location: "Mumbai, IN", current: false },
    { device: "Firefox · Linux", ip: "172.16.0.5", location: "Bengaluru, IN", current: false },
  ];

  const auditEvents = [
    { action: "Login successful", time: "2 min ago", icon: <ShieldCheck className="h-3.5 w-3.5 text-green-400" /> },
    { action: "Password changed", time: "1 hr ago", icon: <KeyRound className="h-3.5 w-3.5 text-amber-400" /> },
    { action: "2FA method updated", time: "3 hrs ago", icon: <Smartphone className="h-3.5 w-3.5 text-blue-400" /> },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* ═══════════ LEFT COLUMN ═══════════ */}
      <div className="xl:col-span-2 space-y-6">

        {/* ── Password Policy ── */}
        <div className={sectionCard}>
          <h3 className={sectionTitle}>Password Policy</h3>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Minimum Length</label>
              <p className={descCls}>Required character count for all user passwords.</p>
            </div>
            <Select 
              value={settings.passwordLength} 
              onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, passwordLength: v })); markDirty(); }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="8 characters">8 characters</SelectItem>
                <SelectItem value="10 characters">10 characters</SelectItem>
                <SelectItem value="12 characters">12 characters</SelectItem>
                <SelectItem value="16 characters">16 characters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <p className={labelCls}>Require Special Characters</p>
              <p className={descCls}>Force symbols (!@#$%) in all passwords.</p>
            </div>
            <Switch 
              checked={settings.requireSymbols} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, requireSymbols: v })); markDirty(); }} 
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <p className={labelCls}>Require Mixed Case</p>
              <p className={descCls}>Enforce at least one uppercase and one lowercase letter.</p>
            </div>
            <Switch 
              checked={settings.requireCase} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, requireCase: v })); markDirty(); }} 
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Password Expiry</label>
              <p className={descCls}>Force password rotation after a set duration.</p>
            </div>
            <Select 
              value={settings.passwordExpiry} 
              onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, passwordExpiry: v })); markDirty(); }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Never">Never</SelectItem>
                <SelectItem value="30 days">30 days</SelectItem>
                <SelectItem value="90 days">90 days</SelectItem>
                <SelectItem value="180 days">180 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Password History</label>
              <p className={descCls}>Prevent reuse of recent passwords.</p>
            </div>
            <Select 
              value={settings.passwordHistory} 
              onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, passwordHistory: v })); markDirty(); }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="No restriction">No restriction</SelectItem>
                <SelectItem value="Last 5 passwords">Last 5 passwords</SelectItem>
                <SelectItem value="Last 10 passwords">Last 10 passwords</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Authentication Security ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Authentication Security</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <p className={labelCls}>Enforce Two-Factor Auth</p>
              <p className={descCls}>Require 2FA for all users across the workspace.</p>
            </div>
            <Switch 
              checked={settings.enforce2FA} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, enforce2FA: v })); markDirty(); }} 
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>OTP Method</label>
              <p className={descCls}>Default verification method for second factor.</p>
            </div>
            <Select 
              value={settings.otpMethod} 
              onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, otpMethod: v })); markDirty(); }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Authenticator App">Authenticator App</SelectItem>
                <SelectItem value="Email OTP">Email OTP</SelectItem>
                <SelectItem value="SMS OTP">SMS OTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <p className={labelCls}>Backup Recovery Codes</p>
              <p className={descCls}>Generate one-time recovery codes for account access.</p>
            </div>
            <Button variant="outline" onClick={() => toast.success("8 backup codes generated and copied")} className="border-gray-900/[0.08] dark:border-white/[0.08] hover:bg-gray-900/10 dark:bg-white/10 text-gray-900/60 dark:text-white/60 hover:text-gray-900 dark:text-white transition-all duration-200 active:scale-[0.98] gap-2 text-sm">
              <Copy className="h-3.5 w-3.5" />
              Generate Codes
            </Button>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <p className={labelCls}>Trusted Devices</p>
              <p className={descCls}>Remember devices and skip 2FA on recognized hardware.</p>
            </div>
            <Switch 
              checked={settings.trustedDevices} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, trustedDevices: v })); markDirty(); }} 
            />
          </div>
        </div>

        {/* ── Session Management ── */}
        <div className={sectionCard}>
          <h3 className={sectionTitle}>Session Management</h3>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Session Timeout</label>
              <p className={descCls}>Auto-terminate idle sessions after this duration.</p>
            </div>
            <Select 
              value={settings.sessionTimeout} 
              onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, sessionTimeout: v })); markDirty(); }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="15 minutes">15 minutes</SelectItem>
                <SelectItem value="30 minutes">30 minutes</SelectItem>
                <SelectItem value="1 hour">1 hour</SelectItem>
                <SelectItem value="4 hours">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Max Concurrent Sessions</label>
              <p className={descCls}>Limit simultaneous active sessions per user.</p>
            </div>
            <Select 
              value={settings.maxSessions} 
              onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, maxSessions: v })); markDirty(); }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="1 session">1 session</SelectItem>
                <SelectItem value="3 sessions">3 sessions</SelectItem>
                <SelectItem value="5 sessions">5 sessions</SelectItem>
                <SelectItem value="Unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <p className={labelCls}>Force Logout on Password Change</p>
              <p className={descCls}>Immediately invalidate all sessions when credentials are updated.</p>
            </div>
            <Switch 
              checked={settings.forceLogout} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, forceLogout: v })); markDirty(); }} 
            />
          </div>
        </div>

        {/* ── Access Control ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Access Control</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <p className={labelCls}>Role-Based Access (RBAC)</p>
              <p className={descCls}>Enforce permission boundaries based on user roles.</p>
            </div>
            <Switch 
              checked={settings.rbac} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, rbac: v })); markDirty(); }} 
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Default User Role</label>
              <p className={descCls}>Role assigned to new users on workspace join.</p>
            </div>
            <Select 
              value={settings.defaultRole} 
              onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, defaultRole: v })); markDirty(); }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Viewer">Viewer</SelectItem>
                <SelectItem value="Analyst">Analyst</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>IP Allowlist</label>
              <p className={descCls}>Restrict access to specific IP ranges (CIDR notation).</p>
            </div>
            <input 
              className={inputCls} 
              value={settings.ipAllowlist}
              onChange={(e) => { setSettings((prev: any) => ({ ...prev, ipAllowlist: e.target.value })); markDirty(); }}
              placeholder="e.g. 192.168.1.0/24, 10.0.0.0/8" 
            />
          </div>
        </div>

        {/* ── Threat Detection ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Threat Detection</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <p className={labelCls}>Login Anomaly Detection</p>
              <p className={descCls}>Flag unusual login patterns and impossible travel events.</p>
            </div>
            <Switch 
              checked={settings.anomalyDetect} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, anomalyDetect: v })); markDirty(); }} 
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <p className={labelCls}>Geo-Location Alerts</p>
              <p className={descCls}>Alert on logins from new or unexpected geographic regions.</p>
            </div>
            <Switch 
              checked={settings.geoAlerts} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, geoAlerts: v })); markDirty(); }} 
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <p className={labelCls}>Brute-Force Protection</p>
              <p className={descCls}>Auto-lock accounts after repeated failed login attempts.</p>
            </div>
            <Switch 
              checked={settings.bruteForce} 
              onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, bruteForce: v })); markDirty(); }} 
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Rate Limiting</label>
              <p className={descCls}>Throttle API and auth requests per minute.</p>
            </div>
            <Select 
              value={settings.rateLimit} 
              onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, rateLimit: v })); markDirty(); }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Low (100/min)">Low (100/min)</SelectItem>
                <SelectItem value="Medium (60/min)">Medium (60/min)</SelectItem>
                <SelectItem value="High (30/min)">High (30/min)</SelectItem>
                <SelectItem value="Strict (10/min)">Strict (10/min)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ═══════════ RIGHT COLUMN ═══════════ */}
      <div className="xl:col-span-1 space-y-6">

        {/* ── Security Summary ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Security Summary</h3>
          </div>

          {/* Score */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/[0.03] dark:bg-white/[0.03] border border-gray-900/[0.06] dark:border-white/[0.06]">
            <div className="relative h-14 w-14 shrink-0">
              <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${scorePercent * 1.508} 200`} strokeLinecap="round" className={scoreColor} />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${scoreColor}`}>{scorePercent}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Security Score</p>
              <p className="text-xs text-gray-900/50 dark:text-white/50">{securityScore}/8 controls active</p>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">2FA Status</span>
              <span className={`text-sm font-medium ${settings.enforce2FA ? "text-green-400" : "text-red-400"}`}>{settings.enforce2FA ? "Enforced" : "Disabled"}</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Active Sessions</span>
              <span className="text-sm text-gray-900/80 dark:text-white/80">{sessions.length} devices</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Brute-Force</span>
              <span className={`text-sm font-medium ${settings.bruteForce ? "text-green-400" : "text-gray-900/40 dark:text-white/40"}`}>{settings.bruteForce ? "Active" : "Off"}</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Last Alert</span>
              <span className="flex items-center gap-1.5 text-sm text-gray-900/50 dark:text-white/50">
                <Clock className="h-3.5 w-3.5" />
                12 min ago
              </span>
            </div>
          </div>
        </div>

        {/* ── Active Sessions ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
          </div>

          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div key={i} className={`flex items-start justify-between gap-3 rounded-lg p-3 border transition-all duration-200 ${s.current ? "bg-green-500/[0.06] border-green-500/20" : "bg-gray-900/[0.02] dark:bg-white/[0.02] border-gray-900/[0.06] dark:border-white/[0.06] hover:border-gray-900/10 dark:border-white/10"
                }`}>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.device}</p>
                    {s.current && <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">Current</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-900/40 dark:text-white/40">
                    <span>{s.ip}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.location}</span>
                  </div>
                </div>
                {!s.current && (
                  <button onClick={() => toast.success(`Session on ${s.device} revoked`)} className="text-xs text-red-400/70 hover:text-red-400 transition-colors shrink-0 mt-1">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Audit Log Preview ── */}
        <div className={sectionCard}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-400/70" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Audit Log</h3>
            </div>
            <button className="text-xs text-green-400/70 hover:text-green-400 transition-colors">View all →</button>
          </div>

          <div className="space-y-3">
            {auditEvents.map((e, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-gray-900/5 dark:border-white/5 last:border-0">
                <div className="flex items-center gap-2.5">
                  {e.icon}
                  <span className="text-sm text-gray-900/80 dark:text-white/80">{e.action}</span>
                </div>
                <span className="text-xs text-gray-900/40 dark:text-white/40 shrink-0">{e.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5 sm:p-6 space-y-5 hover:border-red-500/30 transition-all duration-200">
          <h3 className="text-base font-semibold text-red-500/90 tracking-wide">Danger Zone</h3>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-400">Force Logout All Users</p>
            <p className="text-[13px] text-red-200/50 mb-3">Terminate every active session across the workspace immediately.</p>
            <DangerButton
              label="Force Logout All"
              icon={<Users className="h-4 w-4" />}
              className="w-full"
              title="Global Session Invalidation"
              description="This will instantly invalidate all session tokens. Every user must re-authenticate."
              expectedText="logout-all"
              onConfirm={() => toast.success("All active sessions terminated")}
            />
          </div>

          <div className={divider}>
            <p className="text-sm font-semibold text-red-400">Reset Security Policies</p>
            <p className="text-[13px] text-red-200/50 mt-1 mb-3">Restore all security settings to platform defaults.</p>
            <DangerButton
              label="Reset Policies"
              icon={<RotateCcw className="h-4 w-4" />}
              className="w-full"
              title="Factory Reset Defaults"
              description="This will instantly overwrite all security configurations back to defaults."
              expectedText="reset"
              onConfirm={() => toast.success("Security policies restored to factory defaults")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection({ settings, setSettings }: { settings: any, setSettings: React.Dispatch<React.SetStateAction<any>> }) {
  const markDirty = useCallback(() => {}, []);

  const recentAlerts = [
    { type: "Multiple Failed Logins", sev: "High", time: "10 min ago", status: "Sent" },
    { type: "New Device Login", sev: "Medium", time: "2 hrs ago", status: "Sent" },
    { type: "Suspicious Query (SQLi)", sev: "Critical", time: "1 day ago", status: "Failed (Webhook timeout)" },
  ];

  const activeChannelsCount = [
    settings.emailNotifications,
    settings.slackConnected,
    settings.inAppNotifications,
  ].filter(Boolean).length;
  const alertsEnabledCount = [settings.criticalSev, settings.highSev, settings.mediumSev, settings.lowSev].filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* ═══════════ LEFT COLUMN ═══════════ */}
      <div className="xl:col-span-2 space-y-6">

        {/* ── Alert Channels ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Alert Channels</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-900/50 dark:text-white/50" />
                <label className={labelCls}>Email Notifications</label>
              </div>
              <p className={descCls}>Send alerts to the registered team email addresses.</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(v) => {
                setSettings(prev => ({ ...prev, emailNotifications: v }));
                markDirty();
              }}
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-900/50 dark:text-white/50" />
                <label className={labelCls}>Slack Integration</label>
              </div>
              <p className={descCls}>Push security alerts directly to a designated Slack channel.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSettings(prev => ({ ...prev, slackConnected: !prev.slackConnected }));
                markDirty();
                toast.success(settings.slackConnected ? "Slack disconnected" : "Redirecting to Slack OAuth...");
              }}
              className={`text-xs h-9 px-4 transition-all ${settings.slackConnected ? "text-red-400 hover:text-red-300 border-red-400/20 bg-red-400/10 hover:bg-red-400/20" : "text-gray-900/70 dark:text-white/70 hover:text-gray-900 dark:text-white border-gray-900/10 dark:border-white/10 hover:bg-gray-900/10 dark:bg-white/10"}`}
            >
              {settings.slackConnected ? "Disconnect Slack" : "Connect Slack"}
            </Button>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-900/50 dark:text-white/50" />
                <label className={labelCls}>Webhook URL</label>
              </div>
              <p className={descCls}>Fire a JSON payload to an external listener for custom routing.</p>
            </div>
            <input
              className={inputCls}
              placeholder="https://api.yourdomain.com/webhooks/alerts"
              value={settings.webhookUrl}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, webhookUrl: e.target.value }));
                markDirty();
              }}
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-900/50 dark:text-white/50" />
                <label className={labelCls}>In-App Notifications</label>
              </div>
              <p className={descCls}>Show slide-in toasts and top-nav badge counters while active.</p>
            </div>
            <Switch
              checked={settings.inAppNotifications}
              onCheckedChange={(v) => {
                setSettings(prev => ({ ...prev, inAppNotifications: v }));
                markDirty();
              }}
            />
          </div>
        </div>

        {/* ── Alert Preferences ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Alert Preferences</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-red-500 mb-0">Critical Threat Alerts</label>
              <p className={descCls}>Immediate push for severe breaches and infrastructure attacks.</p>
            </div>
            <Switch checked={settings.criticalSev} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, criticalSev: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-0">High Severity Alerts</label>
              <p className={descCls}>Important security events requiring prompt manual review.</p>
            </div>
            <Switch checked={settings.highSev} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, highSev: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-0">Medium Severity Alerts</label>
              <p className={descCls}>Standard suspicious activities and policy warnings.</p>
            </div>
            <Switch checked={settings.mediumSev} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, mediumSev: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-900/50 dark:text-white/50 mb-0">Low Severity Alerts</label>
              <p className={descCls}>Routine system logs, successful auth events, and diagnostics.</p>
            </div>
            <Switch checked={settings.lowSev} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, lowSev: v })); markDirty(); }} />
          </div>
        </div>

        {/* ── Notification Frequency ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Notification Frequency</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Real-Time Alerts</label>
              <p className={descCls}>Dispatch notifications instantaneously as events happen.</p>
            </div>
            <Switch checked={settings.realtimeAlerts} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, realtimeAlerts: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Batched Delivery</label>
              <p className={descCls}>Delay and group non-critical alerts to prevent inbox flooding.</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="Batch every 1 hour" disabled={settings.realtimeAlerts}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Batch every 15 mins">Batch every 15 mins</SelectItem>
                <SelectItem value="Batch every 30 mins">Batch every 30 mins</SelectItem>
                <SelectItem value="Batch every 1 hour">Batch every 1 hour</SelectItem>
                <SelectItem value="Batch every 4 hours">Batch every 4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Digest Mode</label>
              <p className={descCls}>Receive a single comprehensive rollup of all minor activity.</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="Daily at 8:00 AM">
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Daily at 8:00 AM">Daily at 8:00 AM</SelectItem>
                <SelectItem value="Daily at EOD (6:00 PM)">Daily at EOD (6:00 PM)</SelectItem>
                <SelectItem value="Weekly (Monday morning)">Weekly (Monday morning)</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Report Scheduling ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Report Scheduling</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Weekly Executive Report</label>
              <p className={descCls}>Automated PDF summary of workspace security posture.</p>
            </div>
            <Switch checked={settings.weeklyReport} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, weeklyReport: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Delivery Day</label>
              <p className={descCls}>Day of the week the report is compiled and sent.</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="Monday" disabled={!settings.weeklyReport}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Delivery Time</label>
              <p className={descCls}>Time of day (based on Workspace Timezone).</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="09:00 AM" disabled={!settings.weeklyReport}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                <SelectItem value="05:00 PM">05:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Alert Filters ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Alert Filters</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Filter by Attack Type</label>
              <p className={descCls}>Only trigger alerts for specific threat vectors.</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="All Threat Vectors">
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="All Threat Vectors">All Threat Vectors</SelectItem>
                <SelectItem value="Injection Attacks Only">Injection Attacks Only</SelectItem>
                <SelectItem value="Authentication Bypasses">Authentication Bypasses</SelectItem>
                <SelectItem value="DDoS / Rate Limit Drops">DDoS / Rate Limit Drops</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Filter by Target Application</label>
              <p className={descCls}>Scope alerts to specific nodes or endpoints.</p>
            </div>
            <Select onValueChange={markDirty} defaultValue="All Applications">
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="All Applications">All Applications</SelectItem>
                <SelectItem value="Production API (Core)">Production API (Core)</SelectItem>
                <SelectItem value="Authentication Gateway">Authentication Gateway</SelectItem>
                <SelectItem value="Internal Backoffice">Internal Backoffice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Global Suppression</label>
              <p className={descCls}>Temporarily mute ALL notifications (Maintenance mode).</p>
            </div>
            <Switch onCheckedChange={(v) => { markDirty(); if (v) toast.warning("Global alert suppression enabled"); }} />
          </div>
        </div>
      </div>

      {/* ═══════════ RIGHT COLUMN ═══════════ */}
      <div className="xl:col-span-1 space-y-6">

        {/* ── Notification Summary ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Notification Summary</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Active Channels</span>
              <span className={`text-sm font-medium ${activeChannelsCount > 0 ? "text-green-400" : "text-amber-400"}`}>{activeChannelsCount} Configured</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Alerts Enabled</span>
              <span className="text-sm text-gray-900/80 dark:text-white/80">{alertsEnabledCount} of 4 severities</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Delivery Rate</span>
              <span className="text-sm text-green-400 font-medium">99.8% Success</span>
            </div>
            <div className="border-t border-gray-900/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-900/40 dark:text-white/40">Last Alert Sent</span>
              <span className="flex items-center gap-1.5 text-sm text-gray-900/50 dark:text-white/50">
                <Clock className="h-3.5 w-3.5" />
                10 mins ago
              </span>
            </div>
          </div>
        </div>

        {/* ── Recent Alerts ── */}
        <div className={sectionCard}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-green-400/70" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Dispatches</h3>
            </div>
            <button className="text-[11px] uppercase tracking-wider font-semibold text-green-400/70 hover:text-green-400 transition-colors">Logs →</button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((e, i) => (
              <div key={i} className="flex flex-col gap-2 py-2 border-b border-gray-900/5 dark:border-white/5 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium text-gray-900/90 dark:text-white/90 truncate">{e.type}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold shrink-0 px-1.5 py-0.5 rounded ${e.sev === "Critical" ? "text-red-500 bg-red-500/10" :
                    e.sev === "High" ? "text-amber-500 bg-amber-500/10" :
                      "text-blue-400 bg-blue-400/10"
                    }`}>
                    {e.sev}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-gray-900/30 dark:text-white/30">
                    <Clock className="h-3 w-3" />
                    {e.time}
                  </span>
                  <span className={`flex items-center gap-1 text-[11px] ${e.status === "Sent" ? "text-green-400/70" : "text-red-400/70"}`}>
                    {e.status === "Sent" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Test Notification ── */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Send className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Diagnostics</h3>
          </div>

          <p className="text-sm text-gray-900/50 dark:text-white/50 mb-4">
            Fire a simulated critical alert payload through all active channels to verify delivery chain integrity.
          </p>

          <Button
            onClick={() => {
              toast.info("Dispatching test payload...");
              setTimeout(() => toast.success("Test payload delivered successfully via configured routes"), 1500);
            }}
            className="w-full gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 hover:border-green-500/40 transition-all duration-200 active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
            Send Test Alert
          </Button>
        </div>

        {/* ── Danger Zone ── */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5 sm:p-6 space-y-5 hover:border-red-500/30 transition-all duration-200">
          <h3 className="text-base font-semibold text-red-500/90 tracking-wide">Danger Zone</h3>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-400">Disable All Alerts</p>
            <p className="text-[13px] text-red-200/50 mb-3">Completely halt all outbound communications and alert dispatches.</p>
            <DangerButton
              label="Halt Communications"
              icon={<AlertTriangle className="h-4 w-4" />}
              className="w-full"
              title="Global Communications Kill-switch"
              description="This shuts down all integrations, webhooks, and SMTP. You will be entirely blind to live notifications."
              expectedText="halt"
              onConfirm={() => toast.success("System-wide alert kill-switch initiated")}
            />
          </div>

          <div className={divider}>
            <p className="text-sm font-semibold text-red-400">Reset Configurations</p>
            <p className="text-[13px] text-red-200/50 mt-1 mb-3">Restore all alerting rules to factory defaults and clear integrations.</p>
            <DangerButton
              label="Reset Triggers"
              icon={<RotateCcw className="h-4 w-4" />}
              className="w-full"
              title="Wipe Telemetry Filters"
              description="This uninstalls all custom integrations and active listener configurations."
              expectedText="reset"
              onConfirm={() => toast.success("Notification framework restored")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsSection({ settings, setSettings }: { settings: any, setSettings: React.Dispatch<React.SetStateAction<any>> }) {
  const markDirty = () => {};

  const regenerate = () => {
    const newKey = "tx_live_" + Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 18);
    setSettings((prev: any) => ({ ...prev, apiKey: newKey }));
    toast.success("API key regenerated");
    markDirty();
  };

  const handleTestWebhook = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Sending test payload...',
        success: '200 OK: Webhook delivered successfully',
        error: 'Connection failed',
      }
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up">
      {/* 🟩 LEFT (Core Controls) */}
      <div className="xl:col-span-2 space-y-6">

        {/* SECTION 1: API Management */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">API Management</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Active API Key</label>
              <p className={descCls}>Use this token to authenticate requests.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-[320px]">
              <input className={`${inputCls} font-mono text-xs text-green-400/90 tracking-wider bg-green-500/[0.03] border-green-500/20`} value={settings.apiKey} readOnly />
              <button
                onClick={() => { navigator.clipboard.writeText(settings.apiKey); toast.success("Copied to clipboard"); }}
                className="rounded-lg border border-gray-900/[0.06] dark:border-white/[0.06] bg-gray-900/[0.03] dark:bg-white/[0.03] px-3.5 transition-all duration-200 hover:bg-gray-900/[0.08] dark:bg-white/[0.08] text-gray-900/50 dark:text-white/50 hover:text-gray-900 dark:text-white flex items-center justify-center shrink-0"
                title="Copy"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={regenerate}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 transition-all duration-200 hover:bg-red-500/20 text-red-400/80 hover:text-red-300 flex items-center justify-center shrink-0"
                title="Regenerate"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>API Permissions Scope</label>
              <p className={descCls}>Grant read, write, or full admin privileges.</p>
            </div>
            <Select value={settings.apiScope} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, apiScope: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Read Only">Read Only</SelectItem>
                <SelectItem value="Read / Write">Read / Write</SelectItem>
                <SelectItem value="Full Admin">Full Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Rate Limit & Usage</label>
              <p className={descCls}>Current assigned system bandwidth allowance.</p>
            </div>
            <div className="text-sm font-medium text-gray-900/80 dark:text-white/80 bg-gray-900/5 dark:bg-white/5 px-3 py-1.5 rounded-md border border-gray-900/10 dark:border-white/10">
              1000 req / min
            </div>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Last Used Timestamp</label>
              <p className={descCls}>Most recent successful authentication.</p>
            </div>
            <div className="text-sm text-gray-900/50 dark:text-white/50 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> Just now
            </div>
          </div>
        </div>

        {/* SECTION 2: Webhooks */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Event Webhooks</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Target Endpoint URL</label>
              <p className={descCls}>Where to send HTTP POST payloads.</p>
            </div>
            <input
              className={inputCls}
              value={settings.webhookUrl}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, webhookUrl: e.target.value }));
                markDirty();
              }}
            />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Delivery Retry Policy</label>
              <p className={descCls}>Action taken if the endpoint returns an error.</p>
            </div>
            <Select value={settings.retryPolicy} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, retryPolicy: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="No Retries">No Retries</SelectItem>
                <SelectItem value="3 Retries (Exponential)">3 Retries (Exponential)</SelectItem>
                <SelectItem value="10 Retries (Linear)">10 Retries (Linear)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className={labelCls}>Payload Preview</label>
                  <p className={descCls}>Sample JSON payload structure sent to the endpoint.</p>
                </div>
                <Button variant="outline" onClick={handleTestWebhook} className="border-gray-900/[0.08] dark:border-white/[0.08] bg-gray-900/[0.02] dark:bg-white/[0.02] hover:bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white transition-all duration-200 active:scale-[0.98] gap-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  Test Connection
                </Button>
              </div>
              <pre className="p-4 rounded-xl bg-white/40 dark:bg-gray-950/40 border border-gray-900/5 dark:border-white/5 text-[11px] text-green-400/80 font-mono overflow-x-auto">
                {`{
  "event": "threat.detected",
  "timestamp": "2026-03-19T10:30:00Z",
  "data": {
    "severity": "CRITICAL",
    "type": "SQL Injection",
    "source_ip": "192.168.1.105"
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* SECTION 3: Third-party Integrations */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Plug className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Third-party Connections</h3>
          </div>

          <div className={rowContainer}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#4A154B]/20 border border-[#4A154B]/30 flex items-center justify-center text-[#E01E5A] font-bold text-lg">#</div>
              <div>
                <label className={labelCls}>Slack</label>
                <p className={descCls}>Send alerts to specific channels.</p>
              </div>
            </div>
            <Button variant="outline" onClick={markDirty} className="border-gray-900/[0.08] dark:border-white/[0.08] bg-gray-900/[0.02] dark:bg-white/[0.02] hover:bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white transition-all">Connect</Button>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] font-bold text-lg">D</div>
              <div>
                <label className={labelCls}>Discord</label>
                <p className={descCls}>Push SOC notifications via webhook.</p>
              </div>
            </div>
            <Button variant="outline" onClick={markDirty} className="border-gray-900/[0.08] dark:border-white/[0.08] bg-gray-900/[0.02] dark:bg-white/[0.02] hover:bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white transition-all">Connect</Button>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF0080]/20 border border-[#FF0080]/30 flex items-center justify-center text-[#FF0080] font-bold text-lg">S</div>
              <div>
                <label className={labelCls}>SIEM (Splunk/ELK)</label>
                <p className={descCls}>Export structured logs and metrics.</p>
              </div>
            </div>
            <Button variant="outline" onClick={markDirty} className="border-gray-900/[0.08] dark:border-white/[0.08] bg-gray-900/[0.02] dark:bg-white/[0.02] hover:bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white transition-all">Connect</Button>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <label className={labelCls}>Email Service</label>
                <p className={descCls}>SMTP relay for system notifications.</p>
              </div>
            </div>
            <Button variant="ghost" disabled className="bg-green-500/10 text-green-400 border border-green-500/20 opacity-100 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Configured
            </Button>
          </div>
        </div>

        {/* SECTION 4: Event Subscriptions */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Event Subscriptions</h3>
          </div>
          <p className="text-sm text-gray-900/50 dark:text-white/50 mb-6">Select which events trigger outbound integrations.</p>

          <div className={rowContainer}>
            <label className={labelCls}>Threat Detected</label>
            <Switch defaultChecked onCheckedChange={markDirty} />
          </div>
          <div className={`${rowContainer} ${divider}`}>
            <label className={labelCls}>Vulnerability Found</label>
            <Switch defaultChecked onCheckedChange={markDirty} />
          </div>
          <div className={`${rowContainer} ${divider}`}>
            <label className={labelCls}>Login Anomaly</label>
            <Switch defaultChecked onCheckedChange={markDirty} />
          </div>
          <div className={`${rowContainer} ${divider}`}>
            <label className={labelCls}>System Alerts</label>
            <Switch defaultChecked onCheckedChange={markDirty} />
          </div>
        </div>
      </div>

      {/* 🟦 RIGHT (Monitoring Panel) */}
      <div className="xl:col-span-1 space-y-6">

        {/* Integration Summary */}
        <div className={sectionCard}>
          <h3 className="text-sm font-semibold text-gray-900/90 dark:text-white/90 mb-4 tracking-wide uppercase">Integration Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900/50 dark:text-white/50">Active Integrations</span>
              <span className="text-gray-900 dark:text-white font-medium">2 Services</span>
            </div>
            <div className="h-px bg-gray-900/5 dark:bg-white/5 w-full" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900/50 dark:text-white/50">Webhook Status</span>
              <span className="text-green-400 font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Healthy
              </span>
            </div>
            <div className="h-px bg-gray-900/5 dark:bg-white/5 w-full" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900/50 dark:text-white/50">API Usage</span>
              <span className="text-gray-900 dark:text-white font-medium">320 req/min</span>
            </div>
            <div className="h-px bg-gray-900/5 dark:bg-white/5 w-full" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900/50 dark:text-white/50">Last Event Sent</span>
              <span className="text-gray-900 dark:text-white font-medium">1 min ago</span>
            </div>
          </div>
        </div>

        {/* API Usage */}
        <div className={sectionCard}>
          <h3 className="text-sm font-semibold text-gray-900/90 dark:text-white/90 mb-4 tracking-wide uppercase">API Telemetry</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-900/[0.02] dark:bg-white/[0.02] border border-gray-900/[0.05] dark:border-white/[0.05] p-3 text-center">
              <p className="text-[11px] text-gray-900/40 dark:text-white/40 uppercase tracking-widest mb-1">Requests Today</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">12,430</p>
            </div>
            <div className="rounded-xl bg-gray-900/[0.02] dark:bg-white/[0.02] border border-gray-900/[0.05] dark:border-white/[0.05] p-3 text-center">
              <p className="text-[11px] text-gray-900/40 dark:text-white/40 uppercase tracking-widest mb-1">Errors</p>
              <p className="text-xl font-bold text-red-400 tracking-tight">2%</p>
            </div>
            <div className="rounded-xl bg-gray-900/[0.02] dark:bg-white/[0.02] border border-gray-900/[0.05] dark:border-white/[0.05] p-3 text-center col-span-2">
              <p className="text-[11px] text-gray-900/40 dark:text-white/40 uppercase tracking-widest mb-1">Avg Latency</p>
              <p className="text-xl font-bold text-green-400 tracking-tight">120ms</p>
            </div>
          </div>
        </div>

        {/* Webhook Logs */}
        <div className={sectionCard}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900/90 dark:text-white/90 tracking-wide uppercase">Recent Webhook Logs</h3>
            <span className="text-[10px] uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">Live</span>
          </div>
          <div className="space-y-3 font-mono text-[11px]">
            <div className="flex items-center justify-between bg-white/30 dark:bg-gray-950/30 p-2.5 rounded-lg border border-gray-900/5 dark:border-white/5">
              <span className="text-gray-900/70 dark:text-white/70">POST /webhook</span>
              <span className="flex items-center gap-1.5 text-green-400"><CheckCircle2 className="h-3 w-3" /> 200 OK</span>
            </div>
            <div className="flex items-center justify-between bg-red-500/5 p-2.5 rounded-lg border border-red-500/10">
              <span className="text-gray-900/70 dark:text-white/70">POST /webhook</span>
              <span className="flex items-center gap-1.5 text-red-400"><XCircle className="h-3 w-3" /> 500 ERROR</span>
            </div>
            <div className="flex items-center justify-between bg-white/30 dark:bg-gray-950/30 p-2.5 rounded-lg border border-gray-900/5 dark:border-white/5">
              <span className="text-gray-900/70 dark:text-white/70">POST /webhook</span>
              <span className="flex items-center gap-1.5 text-green-400"><CheckCircle2 className="h-3 w-3" /> 200 OK</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.02] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-orange-400 tracking-wide uppercase">Security Notice</h3>
          </div>
          <ul className="text-xs text-orange-200/60 space-y-1.5 list-disc pl-4">
            <li>Keep API keys absolutely secure.</li>
            <li>Do not expose tokens publicly.</li>
            <li>Rotate keys immediately if compromised.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SystemSection({ settings, setSettings }: { settings: any, setSettings: React.Dispatch<React.SetStateAction<any>> }) {
  const { user } = useAuth();
  const { selectedApp } = useDashboard();
  const markDirty = () => {};

  const workspaceName = selectedApp ? selectedApp.toLowerCase().replace(/\s+/g, "-") : "workspace";
  const userName = user?.name ? user.name.toLowerCase().replace(/\s+/g, "") : (user?.email?.split("@")[0] || "admin");
  const deleteConfirmString = `${userName}/${workspaceName}`;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up">
      {/* 🟩 LEFT (Controls) */}
      <div className="xl:col-span-2 space-y-6">

        {/* SECTION 1: Data Policy */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Data Policy</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Retention Length</label>
              <p className={descCls}>Systematically purge events older than this span.</p>
            </div>
            <Select value={settings.retention} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, retention: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="30 days">30 days</SelectItem>
                <SelectItem value="90 days">90 days</SelectItem>
                <SelectItem value="180 days">180 days</SelectItem>
                <SelectItem value="1 year">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Storage Limit</label>
              <p className={descCls}>Maximum size allocated for telemetry logs.</p>
            </div>
            <Select value={settings.storageLimit} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, storageLimit: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="1 GB">1 GB</SelectItem>
                <SelectItem value="5 GB">5 GB</SelectItem>
                <SelectItem value="10 GB">10 GB</SelectItem>
                <SelectItem value="Unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Auto Cleanup</label>
              <p className={descCls}>Automatically delete oldest records when limit is reached.</p>
            </div>
            <Switch checked={settings.autoClean} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, autoClean: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Log Compression</label>
              <p className={descCls}>Compress archive logs to reduce storage consumption.</p>
            </div>
            <Switch checked={settings.compression} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, compression: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Backup Frequency</label>
              <p className={descCls}>How often system state snapshots are exported.</p>
            </div>
            <Select value={settings.backupFreq} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, backupFreq: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* SECTION 2: Performance Settings */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Performance Processing</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Data Refresh Interval</label>
              <p className={descCls}>Frequency of dashboard telemetry polling.</p>
            </div>
            <Select value={settings.refreshInterval} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, refreshInterval: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="15s">15 Seconds</SelectItem>
                <SelectItem value="30s">30 Seconds</SelectItem>
                <SelectItem value="60s">60 Seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Max Concurrent Scans</label>
              <p className={descCls}>Limit parallel vulnerability sweeps to prevent throttling.</p>
            </div>
            <Select value={settings.maxScans} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, maxScans: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="2">2 Scans</SelectItem>
                <SelectItem value="5">5 Scans</SelectItem>
                <SelectItem value="10">10 Scans</SelectItem>
                <SelectItem value="Unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Log Processing Mode</label>
              <p className={descCls}>Choose between live indexing or optimized batch insertion.</p>
            </div>
            <Select value={settings.processMode} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, processMode: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Real-time">Real-time Stream</SelectItem>
                <SelectItem value="Batch">Aggregated Batch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* SECTION 3: System Behavior */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">System Behavior</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>Auto Restart Services</label>
              <p className={descCls}>Automatically reboot underlying modules if memory leaks occur.</p>
            </div>
            <Switch checked={settings.autoRestart} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, autoRestart: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Debug Mode</label>
              <p className={descCls}>Enable verbose stack traces and bypass local caches.</p>
            </div>
            <Switch checked={settings.debugMode} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, debugMode: v })); markDirty(); }} />
          </div>

          <div className={`${rowContainer} ${divider}`}>
            <div>
              <label className={labelCls}>Maintenance Mode</label>
              <p className={descCls}>Lock down external ingress routes. Only Admins can access.</p>
            </div>
            <Switch checked={settings.maintenance} onCheckedChange={(v) => { setSettings((prev: any) => ({ ...prev, maintenance: v })); markDirty(); }} />
          </div>
        </div>

        {/* SECTION 4: Logging Level */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-green-400/70" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Logging Verbosity</h3>
          </div>

          <div className={rowContainer}>
            <div>
              <label className={labelCls}>System Log Level</label>
              <p className={descCls}>Filter standard output detail sent to external systems.</p>
            </div>
            <Select value={settings.logLevel} onValueChange={(v) => { setSettings((prev: any) => ({ ...prev, logLevel: v })); markDirty(); }}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">
                <SelectItem value="Error">Error Only</SelectItem>
                <SelectItem value="Warning">Warning & Above</SelectItem>
                <SelectItem value="Info">Info (Standard)</SelectItem>
                <SelectItem value="Debug">Debug (Verbose)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* SECTION 5: Danger Zone */}
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 space-y-5 hover:border-red-500/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-base font-semibold text-red-500 tracking-wide">Danger Zone</h3>
          </div>

          <div className={rowContainer}>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-400">Clear Telemetry Logs</p>
              <p className="text-[13px] text-red-200/50 max-w-[400px]">Permanently erase all network traffic logs.</p>
            </div>
            <DangerButton 
              label="Clear Logs" 
              icon={<Trash2 className="h-4 w-4" />}
              title="Clear Telemetry Logs"
              description="This action is irreversible. All network traffic tracking will be wiped."
              expectedText="clear logs"
              onConfirm={() => toast.success("Logs cleared successfully")}
              className="shrink-0"
            />
          </div>

          <div className={`${rowContainer} ${divider} border-red-500/10`}>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-400">Reset Configurations</p>
              <p className="text-[13px] text-red-200/50 max-w-[400px]">Restore all environment policies to factory defaults.</p>
            </div>
            <DangerButton 
              label="Reset Configs"
              icon={<RotateCcw className="h-4 w-4" />}
              title="Factory Reset Configurations"
              description="This will wipe every single custom setting applied across the entire workspace."
              expectedText="factory reset"
              onConfirm={() => toast.success("Reset system configurations")}
              className="shrink-0"
            />
          </div>

          <div className={`${rowContainer} ${divider} border-red-500/10`}>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-400">Delete Workspace</p>
              <p className="text-[13px] text-red-200/50 max-w-[400px] font-bold">This deletes all associated data and connections immediately.</p>
            </div>
            <DangerButton 
              label="Delete Workspace"
              icon={<AlertTriangle className="h-4 w-4" />}
              title="Delete Workspace"
              description="This action will permanently delete this instance. Absolute zero recovery."
              expectedText={deleteConfirmString}
              onConfirm={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="shrink-0 font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] !bg-red-500/10 !border-red-500 hover:!bg-red-500 hover:!text-gray-900 dark:text-white"
            />
          </div>

        </div>
      </div>

      {/* 🟦 RIGHT (System Insights) */}
      <div className="xl:col-span-1 space-y-6">

        {/* System Health Panel */}
        <div className={sectionCard}>
          <h3 className="text-sm font-semibold text-gray-900/90 dark:text-white/90 mb-4 tracking-wide uppercase">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900/50 dark:text-white/50">Core Status</span>
              <span className="text-green-400 font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Optimal
              </span>
            </div>
            <div className="h-px bg-gray-900/5 dark:bg-white/5 w-full" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900/50 dark:text-white/50">CPU Usage</span>
              <span className="text-gray-900 dark:text-white font-medium flex gap-2 items-center">
                <div className="w-16 h-1.5 bg-gray-900/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 w-[42%]" />
                </div>
                42%
              </span>
            </div>
            <div className="h-px bg-gray-900/5 dark:bg-white/5 w-full" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900/50 dark:text-white/50">Memory Usage</span>
              <span className="text-gray-900 dark:text-white font-medium flex gap-2 items-center">
                <div className="w-16 h-1.5 bg-gray-900/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[68%]" />
                </div>
                68%
              </span>
            </div>
            <div className="h-px bg-gray-900/5 dark:bg-white/5 w-full" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900/50 dark:text-white/50">Storage Used</span>
              <span className="text-gray-900 dark:text-white font-medium">3.2 / 5 GB</span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className={sectionCard}>
          <h3 className="text-sm font-semibold text-gray-900/90 dark:text-white/90 mb-4 tracking-wide uppercase">Live Pipeline</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-900/[0.02] dark:bg-white/[0.02] border border-gray-900/[0.05] dark:border-white/[0.05] p-3 text-center col-span-2 flex items-center justify-between px-5">
              <p className="text-[11px] text-gray-900/40 dark:text-white/40 uppercase tracking-widest">Logs Today</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">12,430</p>
            </div>
            <div className="rounded-xl bg-gray-900/[0.02] dark:bg-white/[0.02] border border-gray-900/[0.05] dark:border-white/[0.05] p-3 text-center">
              <p className="text-[11px] text-gray-900/40 dark:text-white/40 uppercase tracking-widest mb-1">Alerts</p>
              <p className="text-xl font-bold text-red-400 tracking-tight">32</p>
            </div>
            <div className="rounded-xl bg-gray-900/[0.02] dark:bg-white/[0.02] border border-gray-900/[0.05] dark:border-white/[0.05] p-3 text-center">
              <p className="text-[11px] text-gray-900/40 dark:text-white/40 uppercase tracking-widest mb-1">Scans</p>
              <p className="text-xl font-bold text-blue-400 tracking-tight flex items-center justify-center gap-1.5">
                <RefreshCw className="h-3 w-3 animate-spin" /> 2
              </p>
            </div>
          </div>
        </div>

        {/* Storage Breakdown */}
        <div className={sectionCard}>
          <h3 className="text-sm font-semibold text-gray-900/90 dark:text-white/90 mb-4 tracking-wide uppercase">Storage Map</h3>
          <div className="space-y-3 font-mono text-[11px]">
            <div className="flex items-center justify-between bg-gray-900/[0.02] dark:bg-white/[0.02] p-2.5 rounded-lg border border-gray-900/5 dark:border-white/5">
              <span className="text-gray-900/70 dark:text-white/70">Sys Logs</span>
              <span className="text-amber-400">2.1 GB</span>
            </div>
            <div className="flex items-center justify-between bg-gray-900/[0.02] dark:bg-white/[0.02] p-2.5 rounded-lg border border-gray-900/5 dark:border-white/5">
              <span className="text-gray-900/70 dark:text-white/70">Reports</span>
              <span className="text-blue-400">0.7 GB</span>
            </div>
            <div className="flex items-center justify-between bg-gray-900/[0.02] dark:bg-white/[0.02] p-2.5 rounded-lg border border-gray-900/5 dark:border-white/5">
              <span className="text-gray-900/70 dark:text-white/70">Snapshots</span>
              <span className="text-gray-900/40 dark:text-white/40">0.4 GB</span>
            </div>
          </div>
        </div>

        {/* Maintenance Info */}
        <div className="rounded-xl border border-gray-900/10 dark:border-white/10 bg-gray-900/5 dark:bg-white/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-gray-900/50 dark:text-white/50" />
            <h3 className="text-sm font-semibold text-gray-900/70 dark:text-white/70 tracking-wide uppercase">Maintenance</h3>
          </div>
          <ul className="text-xs text-gray-900/40 dark:text-white/40 space-y-2 mt-2">
            <li className="flex justify-between"><span>Last Cleanup:</span> <span className="text-gray-900/80 dark:text-white/80">2 hours ago</span></li>
            <li className="flex justify-between"><span>Last Backup:</span> <span className="text-gray-900/80 dark:text-white/80">Today 02:00 AM</span></li>
            <li className="flex justify-between"><span>System Restart:</span> <span className="text-gray-900/80 dark:text-white/80">3 days ago</span></li>
          </ul>
        </div>

      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const { settings, updateSettings } = useDashboard();
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const hasChanges = JSON.stringify(tempSettings) !== JSON.stringify(settings);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes";
        return "You have unsaved changes";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = () => {
    updateSettings(tempSettings);
    toast.success("Settings saved successfully");
  };

  const sections: Record<Tab, React.ReactNode> = {
    general: <GeneralSection settings={tempSettings} setSettings={setTempSettings} />,
    security: <SecuritySection settings={tempSettings} setSettings={setTempSettings} />,
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6 animate-slide-up pb-10">

        {/* Page Header Area with Global Control */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage structure, identity, and control security configurations globally.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {hasChanges && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Unsaved changes
              </span>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`gap-2 transition-all duration-200 active:scale-[0.98] ${hasChanges
                ? "bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-400/30"
                : "bg-gray-900/5 dark:bg-white/5 text-gray-900/30 dark:text-white/30 border border-gray-900/10 dark:border-white/10 cursor-not-allowed"
                }`}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <div className="flex gap-2 border-b border-gray-900/10 dark:border-white/10 mb-6 w-full overflow-x-auto relative">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm transition-all whitespace-nowrap -mb-[1px] ${activeTab === tab.id
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-900/60 dark:text-white/60 hover:text-gray-900 dark:text-white border-b-2 border-transparent"
                }`}
            >
              <span className={activeTab === tab.id ? "text-green-400" : "text-gray-900/60 dark:text-white/60"}>
                {tab.icon}
              </span>
              <span className="font-medium tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="space-y-6">
          {sections[activeTab]}
        </div>
      </div>
    </DashboardLayout>
  );
}
