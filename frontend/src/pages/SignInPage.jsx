import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && user.role) {
    const fallback = user.role === "admin" ? "/admin" : "/";
    const target = location.state?.from || fallback;
    return <Navigate to={target} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await login(email, password);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || "Invalid credentials.");
      return;
    }
    const target = res.user?.role === "admin" ? "/admin" : location.state?.from || "/";
    navigate(target, { replace: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-20" data-testid="signin-page">
      <form onSubmit={submit} className="w-full max-w-md border border-[#3a2a20] bg-[#120d0a] p-10">
        <p className="text-mono-label">// Access</p>
        <h1 className="font-display mt-4 text-3xl text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Use your iphysys account. Admin signs in here too.
        </p>

        <div className="mt-8 space-y-5">
          <Field label="Email" type="email" value={email} setValue={setEmail} testid="signin-email" />
          <Field label="Password" type="password" value={password} setValue={setPassword} testid="signin-password" />
        </div>

        {error && (
          <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400" data-testid="signin-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full border border-[#b91c1c] bg-[#b91c1c]/15 py-3 text-xs font-mono uppercase tracking-[0.2em] text-[#fde2c8] hover:bg-[#b91c1c]/25 glow-red disabled:opacity-50"
          data-testid="signin-submit"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          No account?{" "}
          <Link to="/signup" className="font-mono uppercase tracking-[0.15em] text-[#d4af37] hover:text-[#f4c95d]">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

function Field({ label, type = "text", value, setValue, testid }) {
  return (
    <div>
      <label className="text-mono-label">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full border border-[#3a2a20] bg-transparent px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
        data-testid={testid}
      />
    </div>
  );
}
