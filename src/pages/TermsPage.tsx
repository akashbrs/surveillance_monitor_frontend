import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AuthBackground } from "@/components/AuthBackground";

export default function TermsPage() {
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
              Terms & Conditions
            </h2>

            {/* Content Sections */}
            <div className="space-y-12">
              {[
                {
                  id: 1,
                  title: "Acceptance of Terms",
                  content: "By accessing or using the Core Sentinel Surveillance Dashboard (“Service”), you agree to comply with and be bound by these Terms & Conditions. If you do not agree, you must not use the Service."
                },
                {
                  id: 2,
                  title: "Use of the Service",
                  content: "The Service is intended for authorized monitoring, security analysis, and administrative purposes only. You agree not to:",
                  list: [
                    "Use the platform for unlawful surveillance",
                    "Attempt unauthorized access to systems or data",
                    "Interfere with system integrity or performance"
                  ]
                },
                {
                  id: 3,
                  title: "User Accounts",
                  list: [
                    "You are responsible for maintaining the confidentiality of your credentials",
                    "Any activity under your account is your responsibility",
                    "We reserve the right to suspend accounts suspected of misuse"
                  ]
                },
                {
                  id: 4,
                  title: "Data Monitoring & Logging",
                  content: "Core Sentinel logs authentication attempts, IP addresses, device information, and system activity for security and auditing purposes."
                },
                {
                  id: 5,
                  title: "Security Measures",
                  content: "We implement industry-standard security controls including:",
                  list: [
                    "Encrypted authentication (JWT-based sessions)",
                    "Risk-based login verification",
                    "Multi-factor authentication when required"
                  ],
                  footer: "However, no system is completely secure, and we do not guarantee absolute protection."
                },
                {
                  id: 6,
                  title: "Limitation of Liability",
                  content: "Core Sentinel is provided “as is.” We are not liable for:",
                  list: [
                    "Data loss",
                    "Unauthorized access due to user negligence",
                    "System downtime or interruptions"
                  ]
                },
                {
                  id: 7,
                  title: "Termination",
                  content: "We reserve the right to terminate or restrict access at any time if:",
                  list: [
                    "Terms are violated",
                    "Suspicious or malicious activity is detected"
                  ]
                },
                {
                  id: 8,
                  title: "Changes to Terms",
                  content: "We may update these Terms at any time. Continued use of the Service implies acceptance of the updated Terms."
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
                      {section.footer && <p className="italic">{section.footer}</p>}
                    </div>
                  </section>
                  {index < 7 && <div className="h-[1px] w-full bg-zinc-800/50 mt-12" />}
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
