import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  if (!loading && user && user.role === "admin") {
    const next = location.state?.from || "/admin";
    return <Navigate to={next} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await login(email, password);
    if (!res.ok) setError(res.error || "Login failed.");
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-20" data-testid="admin-login-page">
      <form onSubmit={submit} className="w-full max-w-md border border-white/10 bg-[#120d0a] p-10">
        <p className="text-mono-label">// Admin Console</p>
        <h1 className="font-display mt-4 text-2xl text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Authorized personnel only.</p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="text-mono-label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
              data-testid="admin-login-email"
            />
          </div>
          <div>
            <label className="text-mono-label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
              data-testid="admin-login-password"
            />
          </div>
        </div>

        {error && (
          <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400" data-testid="admin-login-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full border border-white/20 bg-white/5 py-3 text-xs font-mono uppercase tracking-[0.2em] text-white hover:border-white/40 hover:bg-white/10 disabled:opacity-50"
          data-testid="admin-login-submit"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
