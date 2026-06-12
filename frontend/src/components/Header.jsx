import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/vision", label: "Vision" },
  { to: "/insights", label: "Insights" },
  { to: "/textbook", label: "Textbook" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Brand = () => (
  <>
    <span className="text-[#d4af37]">[</span>{" "}
    <span className="text-[#dc2626]">i</span>
    <span className="text-white">physys</span>{" "}
    <span className="text-[#d4af37]">]</span>
  </>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthed = user && user.role;
  const isAdmin = isAuthed && user.role === "admin";

  const doLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#3a2a20] bg-[#0a0706]/85 backdrop-blur-md"
      data-testid="site-header"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-12">
        <Link
          to="/"
          className="font-mono text-sm tracking-widest"
          data-testid="brand-link"
          onClick={() => setOpen(false)}
        >
          <Brand />
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

        <div className="hidden items-center gap-2 md:flex" data-testid="auth-controls">
          {!isAuthed ? (
            <>
              <Link
                to="/signin"
                className="border border-[#3a2a20] px-3 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300 hover:border-[#d4af37]/50 hover:text-white"
                data-testid="header-signin"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="border border-[#b91c1c] bg-[#b91c1c]/10 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#fde2c8] hover:bg-[#b91c1c]/20"
                data-testid="header-signup"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2" data-testid="header-user-menu">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 border border-[#d4af37]/50 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4af37] hover:bg-[#d4af37]/10"
                  data-testid="header-admin-link"
                >
                  <Shield size={11} strokeWidth={1.5} /> Admin
                </Link>
              )}
              <span
                className="flex items-center gap-2 border border-[#3a2a20] px-3 py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-300"
                title={user.email}
                data-testid="header-user-email"
              >
                <UserIcon size={11} strokeWidth={1.5} />
                {user.email.length > 20 ? user.email.slice(0, 20) + "…" : user.email}
              </span>
              <button
                onClick={doLogout}
                className="flex items-center gap-1 border border-[#3a2a20] p-2 text-slate-300 hover:border-red-500/50 hover:text-red-400"
                aria-label="Logout"
                data-testid="header-logout"
              >
                <LogOut size={12} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        <button
          className="text-slate-300 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#3a2a20] bg-[#0a0706] md:hidden" data-testid="mobile-nav">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className="border-b border-[#231814] py-3 text-sm font-mono uppercase tracking-[0.2em] text-slate-300"
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-4 flex flex-col gap-2">
              {!isAuthed ? (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setOpen(false)}
                    className="border border-[#3a2a20] px-4 py-3 text-center text-xs font-mono uppercase tracking-[0.2em] text-slate-200"
                    data-testid="mobile-signin"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="border border-[#b91c1c] bg-[#b91c1c]/10 px-4 py-3 text-center text-xs font-mono uppercase tracking-[0.2em] text-[#fde2c8]"
                    data-testid="mobile-signup"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="border border-[#d4af37]/50 px-4 py-3 text-center text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37]"
                      data-testid="mobile-admin-link"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <p className="px-1 text-xs font-mono text-slate-400">{user.email}</p>
                  <button
                    onClick={doLogout}
                    className="border border-[#3a2a20] px-4 py-3 text-xs font-mono uppercase tracking-[0.2em] text-slate-300"
                    data-testid="mobile-logout"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
