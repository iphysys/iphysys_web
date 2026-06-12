import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center" data-testid="not-found">
      <p className="font-mono text-xs uppercase tracking-widest text-slate-500">404</p>
      <h1 className="font-display mt-4 text-4xl text-white">No route to host.</h1>
      <p className="mt-4 text-slate-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-10 inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#d4af37] hover:text-[#f4c95d]">
        ← Back to base
      </Link>
    </div>
  );
}
