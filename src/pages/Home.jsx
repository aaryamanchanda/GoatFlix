import { useEffect, useState, useRef, useCallback } from "react";
import {
  fetchTrending,
  fetchTV,
  fetchPopular,
  fetchTopRated,
  fetchUpcoming,
  searchMulti,
} from "../utils/tmdb";

import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import TopRow from "../components/TopRow";
import SkeletonBanner from "../components/SkeletonBanner";
import SkeletonRow from "../components/SkeletonRow";
import GoatFlixLogo from "../components/GoatFlixLogo";

const CATEGORIES = ["All", "Movies", "TV Shows"];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [tv, setTV] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [continueW, setContinueW] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  /* ── Hero carousel state ── */
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = useRef(null);
  const heroMovies = movies.slice(0, 5);

  const advanceHero = useCallback(() => {
    setHeroIndex((prev) => (prev + 1) % Math.max(heroMovies.length, 1));
  }, [heroMovies.length]);

  /* Auto-advance hero every 8 seconds */
  useEffect(() => {
    if (heroMovies.length <= 1) return;
    heroTimerRef.current = setInterval(advanceHero, 8000);
    return () => clearInterval(heroTimerRef.current);
  }, [advanceHero, heroMovies.length]);

  const goToHero = (i) => {
    setHeroIndex(i);
    clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(advanceHero, 8000);
  };

  /* ── Fetch data ── */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTrending(),
      fetchTV(),
      fetchPopular(),
      fetchTopRated(),
      fetchUpcoming(),
    ])
      .then(([trendingData, tvData, popularData, topRatedData, upcomingData]) => {
        setMovies(trendingData);
        setTV(tvData);
        setPopular(popularData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    const saved = JSON.parse(localStorage.getItem("continue")) || [];
    setContinueW(saved);
  }, []);

  /* ── Search ── */
  const handleSearch = async (q) => {
    if (q.length > 2) {
      setSearching(true);
      const data = await searchMulti(q);
      setSearchResults(data.filter((x) => x.poster_path));
    } else {
      setSearching(false);
      setSearchResults([]);
    }
  };

  /* ── Filtered rows based on category ── */
  const showMovies = activeCategory === "All" || activeCategory === "Movies";
  const showTV = activeCategory === "All" || activeCategory === "TV Shows";

  return (
    <div
      style={{
        background: "var(--surface-0)",
        color: "var(--text-primary)",
        minHeight: "100vh",
      }}
    >
      <Navbar onSearch={handleSearch} />

      {/* ── Search results overlay ── */}
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
                  window.location.href = `/details/${m.media_type || "movie"}/${m.id}`;
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

      {/* ── Hero Banner (Carousel) ── */}
      {loading ? (
        <SkeletonBanner />
      ) : (
        <div style={{ position: "relative" }}>
          <Banner movie={heroMovies[heroIndex]} />

          {/* Carousel dots */}
          {heroMovies.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                right: "clamp(20px, 4vw, 48px)",
                display: "flex",
                gap: "6px",
                zIndex: 10,
              }}
            >
              {heroMovies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToHero(i)}
                  style={{
                    width: heroIndex === i ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "100px",
                    border: "none",
                    background:
                      heroIndex === i
                        ? "#e50914"
                        : "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    transition: "all 0.35s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Category Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          padding: "20px clamp(16px, 4vw, 48px) 8px",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "7px 18px",
              borderRadius: "100px",
              border:
                activeCategory === cat
                  ? "1px solid rgba(229,9,20,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
              background:
                activeCategory === cat
                  ? "rgba(229,9,20,0.12)"
                  : "rgba(255,255,255,0.04)",
              color: activeCategory === cat ? "#e50914" : "#a1a1aa",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              letterSpacing: "0.01em",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Content Rows ── */}
      <div style={{ paddingTop: "8px", paddingBottom: "60px" }}>
        {loading ? (
          <>
            <SkeletonRow variant="top10" count={6} />
            <SkeletonRow count={8} />
            <SkeletonRow count={8} />
            <SkeletonRow count={8} />
          </>
        ) : (
          <>
            {continueW.length > 0 && (
              <Row title="Continue Watching" movies={continueW} />
            )}
            {showMovies && <TopRow title="TOP 10 Today" movies={movies} />}
            {showMovies && <Row title="🔥 Trending Now" movies={movies} />}
            {showTV && <Row title="📺 TV Shows" movies={tv} />}
            {showMovies && <Row title="🎬 Popular Movies" movies={popular} />}
            {showMovies && <Row title="⭐ Top Rated" movies={topRated} />}
            {showMovies && <Row title="🆕 Upcoming" movies={upcoming} />}
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "36px clamp(20px, 4vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <GoatFlixLogo size="sm" />
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              opacity: 0.7,
            }}
          >
            by Aarya Manchanda • © 2026
          </span>
        </div>
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
