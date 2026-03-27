import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../utils/auth";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "AIC Events" },
  { to: "/resources/partner", label: "New Partner" },
  { to: "/resources/4.0", label: "Resources 4.0" },
  { to: "/resources/other", label: "Other Resources" },
  { to: "/leadership", label: "Leadership" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkCls = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "text-white bg-purple-800"
        : "text-purple-300 hover:text-white hover:bg-purple-800"
    }`;

  return (
    <nav className="bg-purple-900 border-b border-purple-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <span className="text-lg font-bold tracking-widest text-purple-100 uppercase">
              Vision 20000
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
                {l.label}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `ml-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-purple-100 bg-purple-800"
                    : "text-purple-500 hover:text-purple-300 hover:bg-purple-800"
                }`
              }
            >
              Admin
            </NavLink>
            <button
              onClick={logout}
              className="ml-2 px-3 py-2 text-sm font-medium text-purple-500 hover:text-red-400 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-purple-300 hover:bg-purple-800 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-purple-800 bg-purple-900 px-4 py-3 space-y-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 text-sm font-medium rounded-md ${
                  isActive ? "text-white bg-purple-800" : "text-purple-300 hover:bg-purple-800"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 text-xs font-medium rounded-md ${
                isActive ? "text-purple-100 bg-purple-800" : "text-purple-500 hover:bg-purple-800"
              }`
            }
          >
            Admin
          </NavLink>
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-purple-800 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
