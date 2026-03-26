import { useRef, useState } from "react";
import MovieCard from "./MovieCard";

export default function Row({ title, movies = [] }) {
  const rowRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  if (!movies.length) return null;

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const arrowBtnStyle = (side) => ({
    position: "absolute",
    [side]: 0,
    top: 0,
    bottom: "32px", // don't cover the title area below cards
    zIndex: 20,
    width: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      side === "left"
        ? "linear-gradient(to right, rgba(0,0,0,0.85) 0%, transparent 100%)"
        : "linear-gradient(to left, rgba(0,0,0,0.85) 0%, transparent 100%)",
    border: "none",
    cursor: "pointer",
    opacity: 0,
    transition: "opacity 0.25s ease",
    color: "white",
  });

  return (
    <div style={{ marginBottom: "12px" }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 clamp(16px, 4vw, 48px)",
          marginBottom: "14px",
        }}
      >
        <h2
          style={{
            color: "var(--text-primary)",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(to right, rgba(255,255,255,0.06), transparent)",
          }}
        />
      </div>

      {/* Carousel */}
      <div
        className="group/row"
        style={{ position: "relative" }}
        onMouseEnter={(e) => {
          e.currentTarget.querySelectorAll(".row-arrow").forEach((a) => {
            a.style.opacity = "1";
          });
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelectorAll(".row-arrow").forEach((a) => {
            a.style.opacity = "0";
          });
        }}
      >
        {/* Left arrow */}
        {showLeft && (
          <button
            className="row-arrow"
            onClick={() => scroll("left")}
            style={arrowBtnStyle("left")}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {showRight && (
          <button
            className="row-arrow"
            onClick={() => scroll("right")}
            style={arrowBtnStyle("right")}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Scrollable strip */}
        <div
          ref={rowRef}
          onScroll={onScroll}
          className="scrollbar-hide"
          style={{
            display: "flex",
            gap: "14px",
            overflowX: "auto",
            padding: "4px clamp(16px, 4vw, 48px) 8px",
          }}
        >
          {movies.map((movie) => (
            <MovieCard key={`${movie.id}-${movie.media_type}`} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}