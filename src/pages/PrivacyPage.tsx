import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AuthBackground } from "@/components/AuthBackground";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="login-premium-bg font-inter text-zinc-900 dark:text-zinc-100 min-h-screen">
      <AuthBackground />
      
      <div className="relative w-full max-w-4xl mx-auto px-6 py-20 z-10 flex flex-col items-center">
        <div className="login-card-premium w-full !max-w-none group">
          <div className="login-card-content !p-10 !md:p-12">
            {/* Branding - Centered */}
            <div className="flex flex-col items-center gap-3 mb-10">
              <div className="p-2.5 bg-zinc-950 rounded-xl shadow-lg dark:shadow-blue-500/10">
                <Logo size="sm" className="w-8 h-8 filter brightness-110" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Core <span className="text-blue-500">Sentinel</span>
              </h1>
            </div>

            {/* Title - Large & Centered */}
            <h2 className="text-[38px] font-extrabold text-white tracking-tight mb-12 leading-none text-center">
              Privacy Policy
            </h2>

            {/* Content Sections */}
            <div className="space-y-12">
              {[
                {
                  id: 1,
                  title: "Information We Collect",
                  content: "We collect the following data to provide and secure our services:",
                  list: [
                    "User information (email, credentials)",
                    "Login activity (timestamps, IP address, device details)",
                    "Security logs (failed attempts, risk scores, OTP triggers)"
                  ]
                },
                {
                  id: 2,
                  title: "How We Use Information",
                  content: "Collected data is used to:",
                  list: [
                    "Authenticate users",
                    "Detect suspicious activity",
                    "Improve system security",
                    "Generate administrative insights and reports"
                  ]
                },
                {
                  id: 3,
                  title: "Risk-Based Authentication",
                  content: "We analyze login behavior using factors such as:",
                  list: [
                    "Device recognition",
                    "IP address changes",
                    "Login timing patterns"
                  ],
                  footer: "High-risk logins may trigger additional verification steps (e.g., OTP)."
                },
                {
                  id: 4,
                  title: "Data Storage & Protection",
                  list: [
                    "Passwords are securely hashed",
                    "Sensitive data is encrypted",
                    "Logs are stored securely with restricted access"
                  ]
                },
                {
                  id: 5,
                  title: "Data Sharing",
                  content: "We do not sell or share personal data with third parties except:",
                  list: [
                    "When required by law",
                    "To protect system integrity and security"
                  ]
                },
                {
                  id: 6,
                  title: "Data Retention",
                  content: "We retain user and log data only as long as necessary for:",
                  list: [
                    "Security monitoring",
                    "Legal compliance",
                    "System improvement"
                  ]
                },
                {
                  id: 7,
                  title: "User Rights",
                  content: "Users may:",
                  list: [
                    "Request access to their data",
                    "Request deletion (subject to system constraints)",
                    "Update account information"
                  ]
                },
                {
                  id: 8,
                  title: "Cookies & Tracking",
                  content: "We may use cookies or tokens for:",
                  list: [
                    "Session management",
                    "Authentication persistence"
                  ]
                },
                {
                  id: 9,
                  title: "Changes to Privacy Policy",
                  content: "This policy may be updated periodically. Continued use of the Service indicates acceptance of updates."
                }
              ].map((section, index) => (
                <div key={section.id}>
                  <section className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                        {section.id}
                      </div>
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    </div>
                    <div className="pl-11 space-y-4 text-[15px] text-zinc-400 leading-[1.6]">
                      {section.content && <p>{section.content}</p>}
                      {section.list && (
                        <ul className="list-disc pl-5 space-y-2">
                          {section.list.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {section.footer && <p className="italic text-zinc-500 mt-2">{section.footer}</p>}
                    </div>
                  </section>
                  {index < 8 && <div className="h-[1px] w-full bg-zinc-800/50 mt-12" />}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-16 pt-8 border-t border-zinc-800/50">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={16} />
                Back to previous page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
