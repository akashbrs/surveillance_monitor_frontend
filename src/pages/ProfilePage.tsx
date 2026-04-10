import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import ConfirmModal from "@/components/common/ConfirmModal";
import { User, Mail, ShieldCheck, Key, Smartphone, Clock, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const PASSWORD_AGE_DAYS = 45;
const PASSWORD_MAX_DAYS = 90;

export default function ProfilePage() {
  const { user } = useAuth();
  const { settings, updateSettings } = useDashboard();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [openLogoutAll, setOpenLogoutAll] = useState(false);
  const [openRevoke, setOpenRevoke] = useState(false);

  const role = "Administrator";

  // Local form state seeded from global context
  const [formData, setFormData] = useState({
    name: user?.name || settings?.userProfile?.name || "Operator",
    email: user?.email || settings?.userProfile?.email || "admin@coresentinel.io",
  });

  // Keep form synced if context changes externally
  useEffect(() => {
    setFormData({
      name: user?.name || settings?.userProfile?.name || "Operator",
      email: user?.email || settings?.userProfile?.email || "admin@coresentinel.io",
    });
  }, [user?.name, user?.email, settings?.userProfile?.name, settings?.userProfile?.email]);

  const isChanged =
    formData.name !== (settings?.userProfile?.name || "Operator") ||
    formData.email !== (settings?.userProfile?.email || "admin@coresentinel.io");

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isChanged) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isChanged]);

  const handleUpdateProfile = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Invalid email address");
      return;
    }
    try {
      updateSettings({ userProfile: { name: formData.name.trim(), email: formData.email.trim() } });
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = () => {
    toast.success("Password updated successfully");
    setIsPasswordModalOpen(false);
  };

  const handleLogoutAll = () => {
    toast.success("All other sessions have been terminated");
  };

  const handleRevokeSession = () => {
    toast.success("Session revoked successfully");
  };

  const passwordDaysLeft = PASSWORD_MAX_DAYS - PASSWORD_AGE_DAYS;
  const passwordPercent = Math.round((PASSWORD_AGE_DAYS / PASSWORD_MAX_DAYS) * 100);
  const passwordUrgent = passwordDaysLeft <= 15;

  const securityStatus = useMemo(() => {
    if (passwordUrgent)
      return { label: "Risk", dot: "bg-red-400", color: "bg-red-500/10 text-red-400 border-red-400/20" };
    if (!settings.twoFactorAuth)
      return { label: "Medium", dot: "bg-yellow-400", color: "bg-yellow-500/10 text-yellow-400 border-yellow-400/20" };
    return { label: "Secure", dot: "bg-green-400", color: "bg-green-500/10 text-green-400 border-green-400/20" };
  }, [settings.twoFactorAuth, passwordUrgent]);

  const card = "rounded-xl bg-gray-900/[0.04] dark:bg-white/[0.04] backdrop-blur-md border border-gray-900/[0.08] dark:border-white/[0.08] shadow-[0_0_20px_rgba(0,0,0,0.25)] transition-all duration-200";
  const inputClass =
    "w-full rounded-lg border border-gray-900/[0.06] dark:border-white/[0.06] bg-gray-900/[0.03] dark:bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30 transition-all duration-200";

  return (
    <DashboardLayout>
      <div className="w-full space-y-6 animate-slide-up">

        {/* ── Profile Header ── */}
        <div className={`${card} p-6 flex items-center gap-6`}>
          <div className="relative group cursor-pointer inline-block">
            <div className="h-16 w-16 shrink-0 rounded-full bg-green-500/10 border border-green-400/20 flex items-center justify-center shadow-[0_0_18px_rgba(34,197,94,0.12)] transition-all group-hover:bg-green-500/20">
              <User className="h-8 w-8 text-primary" />
            </div>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              title="Upload profile picture" 
              onChange={() => toast.success("Avatar successfully updated!")} 
              accept="image/*"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-foreground">{user?.name || settings.userProfile.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              {user?.email || settings.userProfile.email}
            </p>
            <p className="text-[13px] text-gray-900/60 dark:text-white/60 mt-2 font-medium">Last login: 2h ago (10:30 AM)</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 px-2.5 py-1 text-xs font-semibold text-blue-400">
              <ShieldCheck className="h-3 w-3" />
              {role}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${securityStatus.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${securityStatus.dot}`} />
              {securityStatus.label}
            </span>
          </div>
        </div>

        {/* ── 2-Column: Account Info + Security Settings ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Account Information */}
          <div className={`${card} p-6 h-full flex flex-col`}>
            <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900/70 dark:text-white/70 mb-5">Account Information</h3>
            <div className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${inputClass} focus:ring-green-500 hover:border-gray-900/10 dark:border-white/10`} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`${inputClass} focus:ring-green-500 hover:border-gray-900/10 dark:border-white/10`}
                />
              </div>
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role / Clearance</label>
                <p className="py-2 text-sm font-medium text-foreground">{role}</p>
              </div>
            </div>
            <div className="pt-4 mt-auto">
              <Button
                onClick={handleUpdateProfile}
                disabled={!isChanged}
                className={`w-full transition-all duration-200 px-4 py-2 ${
                  isChanged 
                    ? "bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white font-medium" 
                    : "bg-gray-900/5 dark:bg-white/5 text-gray-900/30 dark:text-white/30 cursor-not-allowed hover:bg-gray-900/5 dark:bg-white/5"
                }`}
              >
                Update Profile
              </Button>
            </div>
          </div>

          {/* Security Settings */}
          <div className={`${card} p-6 h-full`}>
            <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900/70 dark:text-white/70 mb-6">Security Settings</h3>
            <div className="space-y-6">

              {/* 2FA */}
              <div className="flex items-center justify-between border-b border-gray-900/[0.06] dark:border-white/[0.06] pb-6">
                <div className="space-y-1 pr-4">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    Two-Factor Authentication
                  </h4>
                  <p className="text-[13px] text-muted-foreground">
                    Require an extra security step when logging in.
                  </p>
                </div>
                <div className="transition-all duration-200">
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => {
                      try {
                        updateSettings({ twoFactorAuth: checked });
                        toast.info(checked ? "2FA Enabled" : "2FA Disabled");
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to update 2FA");
                      }
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      Password
                    </h4>
                    <p className="text-[13px] text-muted-foreground">
                      Last changed {PASSWORD_AGE_DAYS} days ago. Expires in {passwordDaysLeft} days.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="border-gray-900/[0.08] dark:border-white/[0.08] hover:bg-gray-900/10 dark:bg-white/10 hover:text-foreground text-muted-foreground transition-all duration-200 active:scale-[0.98] px-4 py-2"
                  >
                    Change
                  </Button>
                </div>
                {/* Password expiry progress */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Password Strength</span>
                    <span className="text-green-400 font-medium tracking-wide uppercase">Strong</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Password age</span>
                    <span className={passwordUrgent ? "text-red-400 font-medium" : "text-muted-foreground"}>
                      {passwordPercent}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-gray-900/[0.06] dark:bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        passwordUrgent ? "bg-red-400" : passwordPercent > 50 ? "bg-yellow-400" : "bg-green-400"
                      }`}
                      style={{ width: `${passwordPercent}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Full Width: Active Sessions ── */}
        <div className={`${card} p-6`}>
          <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900/70 dark:text-white/70 mb-4">Active Sessions</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-green-400/20 bg-green-500/5 p-4 transition-all duration-200 hover:border-green-400/30">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">Windows • Chrome 118.0</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    IP: 104.22.1.8 <span className="w-1 h-1 bg-gray-900/20 dark:bg-white/20 rounded-full" /> Location: India (approx)
                  </p>
                </div>
                <div className="text-right">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active Now
                  </span>
                  <span className="text-[10px] text-gray-900/40 dark:text-white/40">Fingerprint: a9f8...d41</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-red-400/20 bg-gray-900/[0.02] dark:bg-white/[0.02] p-4 opacity-80 transition-all duration-200 hover:border-gray-900/20 dark:border-white/20 hover:opacity-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-xl rounded-full" />
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">macOS • Safari 17.0</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    IP: 192.168.1.45 <span className="w-1 h-1 bg-gray-900/20 dark:bg-white/20 rounded-full" /> 
                    <span className="flex items-center gap-1 text-red-400 font-medium">
                      <AlertCircle className="h-3 w-3" /> Suspicious location
                    </span>
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setOpenRevoke(true)}
                  className="h-8 shadow-sm border border-red-500/20 bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 active:scale-[0.98]"
                >
                  Revoke
                </Button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpenLogoutAll(true)}
            className="mt-6 w-full py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-center text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer transition-all duration-200"
          >
            Log out of all other sessions
          </button>
        </div>

        {/* ── Full Width: Metadata ── */}
        <div className={`${card} p-6`}>
          <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900/70 dark:text-white/70 mb-4">Metadata</h3>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex items-start gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Account Created</p>
                <p className="text-muted-foreground">Oct 12, 2023 09:41 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Last Login Location</p>
                <p className="text-muted-foreground">San Francisco, CA (104.22.1.8)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Account Risk Score</p>
                <p className="text-green-400 font-semibold tracking-wide">12/100 (Low Risk)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Key className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Last Password Reset</p>
                <p className="text-muted-foreground">{PASSWORD_AGE_DAYS} days ago</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Change Password Modal ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div className={`${card} w-full max-w-sm p-6 space-y-5 animate-slide-up shadow-2xl`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" /> Change Password
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Current Password</label>
                <input type="password" placeholder="••••••••" className={inputClass} autoFocus />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
                <input type="password" placeholder="••••••••" className={inputClass} />
                <p className="text-[10px] text-muted-foreground text-right mt-1">Must be at least 12 characters</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
                <input type="password" placeholder="••••••••" className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button 
                variant="ghost" 
                onClick={() => setIsPasswordModalOpen(false)}
                className="hover:bg-gray-900/5 dark:bg-white/5 text-gray-900/70 dark:text-white/70 hover:text-gray-900 dark:text-white"
              >
                Cancel
              </Button>
              <Button 
                className="bg-primary/90 hover:bg-primary text-primary-foreground transition-colors px-6" 
                onClick={handlePasswordSubmit}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Irreversible Action Confirmation Modals ── */}
      <ConfirmModal
        isOpen={openLogoutAll}
        onClose={() => setOpenLogoutAll(false)}
        onConfirm={handleLogoutAll}
        title="Log Out All Sessions"
        description="All other active sessions will be terminated immediately. You will remain logged in on this device."
        confirmText="Confirm Logout"
        expectedText="logout"
      />

      <ConfirmModal
        isOpen={openRevoke}
        onClose={() => setOpenRevoke(false)}
        onConfirm={handleRevokeSession}
        title="Revoke macOS Session"
        description="This will instantly sever the active connection from IP 192.168.1.45. Any active downloads will fail."
        confirmText="Revoke Access"
        expectedText="revoke"
      />

    </DashboardLayout>
  );
}
