import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/newsletter", { email });
      if (data.status === "already-subscribed") {
        toast.message("Already subscribed", { description: email });
      } else {
        toast.success("Subscribed", { description: email });
      }
      setEmail("");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Subscription failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#0a0706]" data-testid="site-footer">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-12">
        <div className="md:col-span-2">
          <Link to="/" className="font-mono text-sm tracking-widest text-white" data-testid="footer-brand">
            <span className="text-[#d4af37]">[</span> iphysys <span className="text-[#d4af37]">]</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            Intelligence Layer for Physical Systems. Building the software intelligence stack
            for autonomous, distributed, and mission-aware physical systems.
          </p>
        </div>

        <div>
          <p className="text-mono-label">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/vision" className="text-slate-400 hover:text-white">Vision</Link></li>
            <li><Link to="/insights" className="text-slate-400 hover:text-white">Insights</Link></li>
            <li><Link to="/about" className="text-slate-400 hover:text-white">About</Link></li>
            <li><Link to="/contact" className="text-slate-400 hover:text-white">Contact</Link></li>
            <li><Link to="/admin/login" className="text-slate-500 hover:text-slate-300" data-testid="footer-admin-link">Admin</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-mono-label">Subscribe</p>
          <form className="mt-4 flex flex-col gap-3" onSubmit={subscribe} data-testid="footer-newsletter-form">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-white/30 focus:outline-none"
              data-testid="footer-newsletter-email"
            />
            <button
              type="submit"
              disabled={submitting}
              className="border border-white/20 px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white hover:border-white/40 disabled:opacity-50"
              data-testid="footer-newsletter-submit"
            >
              {submitting ? "..." : "Subscribe"}
            </button>
          </form>
          <div className="mt-6 flex items-center gap-4 text-slate-500">
            <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin size={16} strokeWidth={1.5} /></a>
            <a href="#" aria-label="GitHub" className="hover:text-white"><Github size={16} strokeWidth={1.5} /></a>
            <a href="mailto:hello@iphysys.com" aria-label="Email" className="hover:text-white"><Mail size={16} strokeWidth={1.5} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-slate-500 md:flex-row md:items-center lg:px-12">
          <p>© {new Date().getFullYear()} iphysys. All rights reserved.</p>
          <div className="flex items-center gap-5 font-mono">
            <Link to="/legal/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-white">Terms</Link>
            <Link to="/legal/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
