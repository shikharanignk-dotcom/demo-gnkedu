"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/omgnk");
      }
    });
  }, [router, supabase.auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      if (data.session) {
        router.replace("/omgnk");
      }
    } catch (err) {
      setError("An unexpected error occurred during authentication.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-16 px-4 bg-bg-page">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-white border border-slate-100 shadow-premium space-y-6 relative z-10">
        {/* Header brand */}
        <div className="text-center space-y-1.5">
          <div className="mx-auto h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-slate-900">Admin Portal</h2>
          <p className="text-[10px] text-text-muted">
            Log in to manage showcase assignments, projects, videos, and settings.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 text-[10px] rounded-xl bg-red-50 border border-red-200 text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <input
                type="email"
                required
                placeholder="admin@gnkedu.online"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
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
