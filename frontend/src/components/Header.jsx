import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/vision", label: "Vision" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-50 border-b border-[#3a2a20] bg-[#0a0706]/85 backdrop-blur-md"
      data-testid="site-header"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link
          to="/"
          className="font-mono text-sm tracking-widest text-white"
          data-testid="brand-link"
          onClick={() => setOpen(false)}
        >
          <span className="text-[#d4af37]">[</span> iphysys <span className="text-[#d4af37]">]</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" data-testid="primary-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              data-testid={`nav-${item.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-xs font-mono uppercase tracking-[0.2em] ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden text-slate-300"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black md:hidden" data-testid="mobile-nav">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-sm font-mono uppercase tracking-[0.2em] text-slate-300"
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
