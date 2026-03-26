import { useEffect, useState } from "react";
import { fetchTrending, fetchTV, searchMulti } from "../utils/tmdb";

import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import TopRow from "../components/TopRow";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [tv, setTV] = useState([]);
  const [continueW, setContinueW] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchTrending().then(setMovies);
    fetchTV().then(setTV);
    const saved = JSON.parse(localStorage.getItem("continue")) || [];
    setContinueW(saved);
  }, []);

  const handleSearch = async (q) => {
    if (q.length > 2) {
      setSearching(true);
      const data = await searchMulti(q);
      const filtered = data.filter((x) => x.poster_path);
      setSearchResults(filtered);
    } else {
      setSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <div
      style={{
        background: "var(--surface-0)",
        color: "var(--text-primary)",
        minHeight: "100vh",
      }}
    >
      <Navbar onSearch={handleSearch} />

      {/* Search results overlay */}
      {searching && searchResults.length > 0 && (
        <div
          className="animate-fade-in"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.96)",
            paddingTop: "84px",
            paddingLeft: "clamp(20px, 4vw, 48px)",
            paddingRight: "clamp(20px, 4vw, 48px)",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            Search Results
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "16px",
            }}
          >
            {searchResults.map((m, i) => (
              <div
                key={m.id}
                className="animate-scale-in"
                style={{
                  cursor: "pointer",
                  animationDelay: `${i * 30}ms`,
                }}
                onClick={() => {
                  window.location.href = `/player/${m.media_type || "movie"}/${m.id}`;
                }}
              >
                <div
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    aspectRatio: "2 / 3",
                    background: "var(--surface-2)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    alt={m.title || m.name}
                  />
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginTop: "8px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.title || m.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <Banner movie={movies[0]} />

      {/* Content Rows */}
      <div style={{ paddingTop: "16px", paddingBottom: "60px" }}>
        {continueW.length > 0 && (
          <Row title="Continue Watching" movies={continueW} />
        )}
        <TopRow title="TOP 10 Today" movies={movies} />
        <Row title="Trending Now" movies={movies} />
        <Row title="TV Shows" movies={tv} />
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "36px clamp(20px, 4vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          © 2026 Pixel<span style={{ color: "var(--brand)" }}>Play</span>
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            opacity: 0.6,
          }}
        >
          Powered by TMDB
        </span>
      </footer>
    </div>
  );
}
