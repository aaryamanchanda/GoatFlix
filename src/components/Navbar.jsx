import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoatFlixLogo from "./GoatFlixLogo";

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const { user, loading, subscribed, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  /* Close menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchOpen(false);
    if (onSearch) onSearch("");
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/");
  };

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "?";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px, 4vw, 48px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        background: scrolled
          ? "rgba(0, 0, 0, 0.92)"
          : "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px) saturate(1.3)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.3)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <a href="/" style={{ textDecoration: "none" }}>
        <GoatFlixLogo size="md" />
      </a>

      {/* Right side: Search + Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              width: searchOpen ? "260px" : "0px",
              opacity: searchOpen ? 1 : 0,
              background: searchOpen ? "rgba(255,255,255,0.06)" : "transparent",
              border: searchOpen ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
              borderRadius: "8px",
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="#a1a1aa"
              viewBox="0 0 24 24"
              style={{ marginLeft: "12px", flexShrink: 0 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search titles..."
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "13px",
                padding: "10px 12px",
                outline: "none",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
            {query && (
              <button
                onClick={clearSearch}
                style={{
                  background: "none",
                  border: "none",
                  color: "#71717a",
                  cursor: "pointer",
                  padding: "0 10px",
                  fontSize: "18px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={() => {
              if (searchOpen && !query) {
                setSearchOpen(false);
              } else {
                setSearchOpen(true);
              }
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#d4d4d4",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#d4d4d4";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Upgrade pill — show when logged in but not subscribed */}
        {user && !subscribed && !loading && (
          <button
            onClick={() => navigate("/pricing")}
            style={{
              padding: "6px 14px",
              borderRadius: "100px",
              border: "1px solid rgba(229,9,20,0.4)",
              background: "rgba(229,9,20,0.1)",
              color: "#e50914",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(229,9,20,0.2)";
              e.currentTarget.style.borderColor = "rgba(229,9,20,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(229,9,20,0.1)";
              e.currentTarget.style.borderColor = "rgba(229,9,20,0.4)";
            }}
          >
            ⚡ Upgrade
          </button>
        )}

        {/* Auth area */}
        {loading ? null : user ? (
          /* Avatar + dropdown */
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.12)",
                background: "linear-gradient(135deg, #e50914, #b20710)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                userInitial
              )}
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "220px",
                  background: "rgba(20,20,20,0.98)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "8px",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(30px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                  animation: "scaleIn 0.15s ease-out",
                }}
              >
                {/* User info */}
                <div style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: "4px",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>
                    {user.displayName || "User"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#71717a", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.email}
                  </div>
                  {subscribed && (
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "6px",
                      padding: "2px 8px",
                      borderRadius: "100px",
                      background: "rgba(52,211,153,0.1)",
                      border: "1px solid rgba(52,211,153,0.2)",
                      color: "#34d399",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                    }}>
                      ✓ Premium
                    </div>
                  )}
                </div>

                {/* Menu items */}
                {!subscribed && (
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/pricing"); }}
                    style={menuItemStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(229,9,20,0.1)";
                      e.currentTarget.style.color = "#e50914";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#d4d4d8";
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Upgrade to Premium
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  style={menuItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#d4d4d8";
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sign In button */
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

const menuItemStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "none",
  background: "transparent",
  color: "#d4d4d8",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.15s ease",
  textAlign: "left",
};
