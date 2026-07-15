"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Optional: Check if a custom passcode is configured in Convex settings
  const siteSettings = useQuery(api.site_settings.get) || [];
  const settingsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    siteSettings.forEach((row: any) => {
      obj[row.key] = row.value;
    });
    return obj;
  }, [siteSettings]);


  useEffect(() => {
    const isLoggedIn = localStorage.getItem("gnk_admin_logged_in");
    if (isLoggedIn === "true") {
      router.replace("/omgnk");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Default credentials or custom passcode from Convex
    const defaultEmail = "admin@gnkedu.online";
    const customPasscode = settingsObj.admin_config?.passcode || "admin123";

    setTimeout(() => {
      if (email.toLowerCase() === defaultEmail && password === customPasscode) {
        localStorage.setItem("gnk_admin_logged_in", "true");
        router.replace("/omgnk");
      } else {
        setError("Invalid email address or passcode. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-16 px-4 bg-slate-50 min-h-screen">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-6 relative z-10">
        {/* Header brand */}
        <div className="text-center space-y-1.5">
          <div className="mx-auto h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#a15c00]">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
          <h2 className="text-base font-heading font-extrabold text-slate-900">Admin Portal</h2>
          <p className="text-[10px] text-slate-400">
            Log in to manage solved assignments, projects, and settings.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 text-[10px] rounded-xl bg-red-50 border border-red-200 text-red-600 font-bold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="admin@gnkedu.online"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#a15c00] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#a15c00] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-[#a15c00] hover:bg-[#854b00] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
