import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "AIC Events" },
  { to: "/resources/partner", label: "New Partner" },
  { to: "/resources/4.0", label: "Resources 4.0" },
  { to: "/resources/other", label: "Other Resources" },
  { to: "/leadership", label: "Leadership" },
];

function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-md text-purple-500 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? (
        /* Sun icon — switch to light */
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
        </svg>
      ) : (
        /* Moon icon — switch to dark */
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { dark, setDark } = useTheme();

  const linkCls = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "text-white bg-purple-600 dark:bg-purple-800"
        : "text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-purple-800"
    }`;

  return (
    <nav className="bg-white dark:bg-purple-900 border-b border-gray-200 dark:border-purple-800 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <span className="text-lg font-bold tracking-widest text-purple-900 dark:text-purple-100 uppercase">
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
                    ? "text-purple-900 dark:text-purple-100 bg-purple-100 dark:bg-purple-800"
                    : "text-purple-400 dark:text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800"
                }`
              }
            >
              Admin
            </NavLink>
            <ThemeToggle dark={dark} setDark={setDark} />
            <button
              onClick={logout}
              className="ml-1 px-3 py-2 text-sm font-medium text-purple-400 dark:text-purple-500 hover:text-red-500 dark:hover:text-red-400 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle dark={dark} setDark={setDark} />
            <button
              className="p-2 rounded-md text-purple-500 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
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
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-200 dark:border-purple-800 bg-white dark:bg-purple-900 px-4 py-3 space-y-1 transition-colors duration-200">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 text-sm font-medium rounded-md ${
                  isActive
                    ? "text-white bg-purple-600 dark:bg-purple-800"
                    : "text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800"
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
                isActive
                  ? "text-purple-900 dark:text-purple-100 bg-purple-100 dark:bg-purple-800"
                  : "text-purple-400 dark:text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-800"
              }`
            }
          >
            Admin
          </NavLink>
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
