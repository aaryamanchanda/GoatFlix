import { useState, useEffect, useRef } from "react";

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

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
      <a
        href="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 20px rgba(229,9,20,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span
          style={{
            fontSize: "21px",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "white",
            lineHeight: 1,
          }}
        >
          Pixel<span style={{ color: "#e50914" }}>Play</span>
        </span>
      </a>

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
    </nav>
  );
}
