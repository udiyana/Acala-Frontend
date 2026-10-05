import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertTriangle, Eye, EyeOff, Lock, Loader2, ShieldCheck } from "lucide-react";
import { loginCms, CmsUser } from "@/lib/cms";

interface CmsLoginPageProps {
  onLogin: (user: CmsUser) => void;
}

/** Detect a 429 rate-limit error and return remaining-seconds hint if present. */
function isRateLimited(message: string): boolean {
  return message.includes("Terlalu banyak") || message.includes("dikunci");
}

export default function CmsLoginPage({ onLogin }: CmsLoginPageProps) {
  const [email, setEmail] = useState("admin@acala.id");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);

  // Auto-focus email on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLocked) return;

    setIsLoading(true);
    setError(null);

    try {
      const user = await loginCms(email.trim(), password);
      setFailCount(0);
      onLogin(user);
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Login gagal. Periksa kembali email dan password.";

      setError(message);
      setFailCount((c) => c + 1);

      // Lock the UI when the server signals rate-limit / lockout
      if (isRateLimited(message)) {
        setIsLocked(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const locked = isLocked || isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FAF6F0] px-4">

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #b48c5a 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #8b6a35 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-[420px]"
        style={{ animation: "slideUp 0.4s ease-out" }}>

        {/* Gold top line */}
        <div className="h-[2px] rounded-t-2xl w-full"
          style={{ background: "linear-gradient(90deg, transparent, #b48c5a, #d4a96a, #b48c5a, transparent)" }} />

        <div className="rounded-b-2xl border border-neutral-200/80 px-8 pt-8 pb-8 bg-white shadow-xl shadow-neutral-200/50">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
              style={{ background: "linear-gradient(135deg, rgba(180,140,90,0.12), rgba(212,169,106,0.04))", border: "1px solid rgba(180,140,90,0.2)" }}>
              <ShieldCheck size={26} color="#b48c5a" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-2 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}>
              Acala CMS
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Masuk untuk mengelola konten website<br />Acala Bar &amp; Bistro
            </p>
          </div>

          {/* Error / Lockout message */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm border flex items-start gap-2.5 bg-red-50 border-red-200 text-red-700 shadow-sm"
            >
              {isLocked
                ? <Lock size={14} className="flex-shrink-0 mt-0.5" />
                : <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              }
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Attempt warning (show after 3 failures, before lockout) */}
          {!isLocked && failCount >= 3 && !error && (
            <div className="mb-5 px-4 py-2.5 rounded-xl text-xs text-amber-800 border border-amber-200 flex items-center gap-2 bg-amber-50 shadow-sm">
              <AlertTriangle size={13} className="flex-shrink-0 text-amber-600" />
              Sisa {Math.max(0, 10 - failCount)} percobaan sebelum akun dikunci sementara.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                ref={emailRef}
                id="cms-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={locked}
                placeholder="admin@acala.id"
                autoComplete="email"
                className="w-full px-4 py-3 text-sm text-neutral-800 rounded-xl outline-none transition-all disabled:opacity-50"
                style={{
                  background: "#ffffff",
                  border: "1px solid #dfe3e8",
                  caretColor: "#b48c5a",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#b48c5a";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(180,140,90,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#dfe3e8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="cms-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={locked}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 text-sm text-neutral-800 rounded-xl outline-none transition-all disabled:opacity-50"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dfe3e8",
                    caretColor: "#b48c5a",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#b48c5a";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(180,140,90,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#dfe3e8";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="cms-login-btn"
              type="submit"
              disabled={locked}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: locked
                  ? isLocked
                    ? "rgba(239,68,68,0.3)"
                    : "rgba(180,140,90,0.4)"
                  : "linear-gradient(135deg, #b48c5a, #d4a96a 50%, #b48c5a)",
                boxShadow: locked ? "none" : "0 4px 20px rgba(180,140,90,0.25)",
              }}
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Sedang masuk...</>
              ) : isLocked ? (
                <><Lock size={16} /> Akun dikunci sementara</>
              ) : (
                "Masuk ke CMS"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-400 mt-6 font-medium">
            Akses terbatas untuk admin Acala Bar &amp; Bistro
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
