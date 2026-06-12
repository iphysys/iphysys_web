import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const { user, signup, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && user.role) {
    const fallback = user.role === "admin" ? "/admin" : "/";
    return <Navigate to={fallback} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    setError("");
    const res = await signup(email, password, name);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || "Sign up failed.");
      return;
    }
    const target = location.state?.from || "/";
    navigate(target, { replace: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-20" data-testid="signup-page">
      <form onSubmit={submit} className="w-full max-w-md border border-[#3a2a20] bg-[#120d0a] p-10">
        <p className="text-mono-label">// New Account</p>
        <h1 className="font-display mt-4 text-3xl text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Free account for browsing iphysys insights and the AI textbook.
        </p>

        <div className="mt-8 space-y-5">
          <Field label="Name (optional)" value={name} setValue={setName} testid="signup-name" required={false} />
          <Field label="Email" type="email" value={email} setValue={setEmail} testid="signup-email" />
          <Field label="Password (min 6 chars)" type="password" value={password} setValue={setPassword} testid="signup-password" />
        </div>

        {error && (
          <p className="mt-6 border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400" data-testid="signup-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full border border-[#d4af37] bg-[#d4af37]/15 py-3 text-xs font-mono uppercase tracking-[0.2em] text-[#fde2c8] hover:bg-[#d4af37]/25 glow-gold disabled:opacity-50"
          data-testid="signup-submit"
        >
          {submitting ? "Creating…" : "Create Account"}
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have one?{" "}
          <Link to="/signin" className="font-mono uppercase tracking-[0.15em] text-[#d4af37] hover:text-[#f4c95d]">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

function Field({ label, type = "text", value, setValue, testid, required = true }) {
  return (
    <div>
      <label className="text-mono-label">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full border border-[#3a2a20] bg-transparent px-3 py-2 text-sm text-white focus:border-[#d4af37]/50 focus:outline-none"
        data-testid={testid}
      />
    </div>
  );
}
