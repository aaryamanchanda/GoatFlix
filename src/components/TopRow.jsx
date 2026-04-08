import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MoviePopup from "./MoviePopup";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function TopRow({ title, movies = [] }) {
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const [showRight, setShowRight] = useState(true);
  const [showLeft, setShowLeft] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [popupMovie, setPopupMovie] = useState(null);
  const [cardRect, setCardRect] = useState(null);
  const cardRefs = useRef([]);
  const hoverTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

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

  const handleMouseEnter = useCallback((movie, index) => {
    clearTimeout(leaveTimerRef.current);
    setHoveredIndex(index);
    hoverTimerRef.current = setTimeout(() => {
      if (cardRefs.current[index]) {
        setCardRect(cardRefs.current[index].getBoundingClientRect());
        setPopupMovie(movie);
      }
    }, 600);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimerRef.current);
    setHoveredIndex(-1);
    leaveTimerRef.current = setTimeout(() => {
      setPopupMovie(null);
      setCardRect(null);
    }, 280);
  }, []);

  const handlePopupMouseEnter = useCallback(() => {
    clearTimeout(leaveTimerRef.current);
  }, []);

  const handlePopupMouseLeave = useCallback(() => {
    leaveTimerRef.current = setTimeout(() => {
      setPopupMovie(null);
      setCardRect(null);
    }, 200);
  }, []);

  if (!movies.length) return null;

  const arrowBtnStyle = (side) => ({
    position: "absolute",
    [side]: 0,
    top: 0,
    bottom: 0,
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              background: "var(--brand)",
              color: "white",
              fontSize: "11px",
              fontWeight: 800,
              padding: "3px 8px",
              borderRadius: "4px",
              letterSpacing: "0.05em",
            }}
          >
            TOP 10
          </span>
          {title.replace("TOP 10 ", "")}
        </h2>
        <div
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(to right, rgba(229,9,20,0.3), rgba(255,255,255,0.04), transparent)",
          }}
        />
      </div>

      {/* Carousel */}
      <div
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

        <div
          ref={rowRef}
          onScroll={onScroll}
          className="scrollbar-hide"
          style={{
            display: "flex",
            gap: "0px",
            overflowX: "auto",
            padding: "8px clamp(16px, 4vw, 48px) 16px",
          }}
        >
          {movies.slice(0, 10).map((movie, index) => {
            const type = movie.type || movie.media_type || "movie";
            const poster = movie.poster_path || movie.poster;
            const isHovered = hoveredIndex === index;
            // "10" needs more left margin for the 2-digit number
            const isTen = index === 9;
            const posterWidth = 120;
            // Number offset: single digit cards are 160px wide, 10 is 195px
            const cardWidth = isTen ? 195 : 165;
            const numberLeftOffset = isTen ? -6 : -4;
            const posterMarginLeft = isTen ? 70 : 52;

            return (
              <div
                key={movie.id}
                ref={(el) => (cardRefs.current[index] = el)}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  cursor: "pointer",
                  width: `${cardWidth}px`,
                  display: "flex",
                  alignItems: "flex-end",
                  paddingBottom: "4px",
                }}
                onClick={() => navigate(`/details/${type}/${movie.id}`)}
                onMouseEnter={() => handleMouseEnter(movie, index)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Large ranking number */}
                <span
                  style={{
                    position: "absolute",
                    left: `${numberLeftOffset}px`,
                    bottom: "4px",
                    zIndex: 10,
                    fontWeight: 900,
                    fontSize: isTen ? "120px" : "130px",
                    lineHeight: "0.85",
                    fontFamily: "'Inter', sans-serif",
                    color: "transparent",
                    WebkitTextStroke: isHovered
                      ? "2.5px rgba(229,9,20,0.55)"
                      : "2.5px rgba(255,255,255,0.1)",
                    userSelect: "none",
                    pointerEvents: "none",
                    transition: "all 0.3s ease",
                    letterSpacing: isTen ? "-10px" : "0px",
                  }}
                >
                  {index + 1}
                </span>

                {/* Poster */}
                <div
                  style={{
                    position: "relative",
                    marginLeft: `${posterMarginLeft}px`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    aspectRatio: "2 / 3",
                    width: `${posterWidth}px`,
                    flexShrink: 0,
                    zIndex: 20,
                    boxShadow: isHovered
                      ? "0 12px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)"
                      : "0 4px 16px rgba(0,0,0,0.5)",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    transform: isHovered ? "scale(1.06) translateY(-6px)" : "scale(1) translateY(0)",
                  }}
                >
                  {poster ? (
                    <img
                      src={`${IMG_BASE}${poster}`}
                      alt={movie.title || movie.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "var(--surface-3)" }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup portal */}
      {popupMovie && cardRect && (
        <MoviePopup
          movie={popupMovie}
          cardRect={cardRect}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        />
      )}
    </div>
  );
}