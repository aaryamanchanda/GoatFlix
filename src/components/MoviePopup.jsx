import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/w780";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News",
  10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap",
  10767: "Talk", 10768: "War & Politics",
};

export default function MoviePopup({
  movie,
  cardRect,
  onMouseEnter,
  onMouseLeave,
}) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!movie || !cardRect) return null;

  const type = movie.type || movie.media_type || "movie";
  const title = movie.title || movie.name || "Untitled";
  const backdrop = movie.backdrop_path;
  const poster = movie.poster_path || movie.poster;
  const rating = movie.vote_average;
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const overview = movie.overview || "";
  const genres = (movie.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRES[id])
    .filter(Boolean);

  const popupWidth = 320;

  // Center popup on card
  let left = cardRect.left + cardRect.width / 2 - popupWidth / 2;
  let top = cardRect.top - 40;

  // Edge detection
  const margin = 12;
  if (left < margin) left = margin;
  if (left + popupWidth > window.innerWidth - margin)
    left = window.innerWidth - popupWidth - margin;
  if (top < 72) top = 72;

  // If popup would go below viewport, shift up
  const estimatedHeight = backdrop ? 370 : 240;
  if (top + estimatedHeight > window.innerHeight - margin) {
    top = window.innerHeight - estimatedHeight - margin;
  }

  const matchPercent = rating ? Math.round(rating * 10) : null;

  const popup = (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed",
        left: `${left}px`,
        top: `${top}px`,
        width: `${popupWidth}px`,
        zIndex: 1000,
        borderRadius: "10px",
        overflow: "hidden",
        background: "#181818",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
        transform: visible ? "scale(1)" : "scale(0.82)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease",
        transformOrigin: "center top",
        cursor: "default",
      }}
    >
      {/* ── Top image ─────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: backdrop ? "16 / 9" : "2.2 / 1",
          background: "#111",
          overflow: "hidden",
        }}
      >
        <img
          src={
            backdrop
              ? `${BACKDROP_BASE}${backdrop}`
              : poster
              ? `${POSTER_BASE}${poster}`
              : ""
          }
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #181818 0%, rgba(24,24,24,0.5) 35%, transparent 65%)",
          }}
        />
        <h3
          style={{
            position: "absolute",
            bottom: "10px",
            left: "14px",
            right: "14px",
            color: "white",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 10px rgba(0,0,0,0.7)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>

      {/* ── Info section ──────────────────────── */}
      <div style={{ padding: "12px 14px 16px" }}>
        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          {/* Play */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/player/${type}/${movie.id}`);
            }}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s ease",
              padding: 0,
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#e0e0e0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "white")
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="black"
              style={{ marginLeft: "2px" }}
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          {/* Add to list */}
          <CircleBtn title="Add to My List">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </CircleBtn>

          {/* Like */}
          <CircleBtn title="I like this">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
            </svg>
          </CircleBtn>

          <div style={{ flex: 1 }} />

          {/* More info / expand */}
          <CircleBtn
            title="More info"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/player/${type}/${movie.id}`);
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </CircleBtn>
        </div>

        {/* Metadata row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          {matchPercent && matchPercent > 0 && (
            <span
              style={{
                color: matchPercent >= 70 ? "#46d369" : "#d2d230",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {matchPercent}% Match
            </span>
          )}
          {year && (
            <span
              style={{
                color: "#bcbcbc",
                fontSize: "11px",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "1px 5px",
                borderRadius: "3px",
              }}
            >
              {year}
            </span>
          )}
          <span
            style={{
              color: "#bcbcbc",
              fontSize: "10px",
              fontWeight: 500,
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "1px 5px",
              borderRadius: "3px",
            }}
          >
            HD
          </span>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "2px",
            }}
          >
            {genres.map((g, i) => (
              <span key={g} style={{ fontSize: "12px", color: "#bcbcbc" }}>
                {i > 0 && (
                  <span style={{ margin: "0 5px", color: "#555" }}>•</span>
                )}
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Short overview if no genres */}
        {overview && genres.length === 0 && (
          <p
            style={{
              fontSize: "12px",
              color: "#999",
              lineHeight: 1.4,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {overview}
          </p>
        )}
      </div>
    </div>
  );

  return createPortal(popup, document.body);
}

/* ── Reusable circle button ──────────────────── */
function CircleBtn({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        background: "rgba(42,42,42,0.9)",
        border: "2px solid rgba(255,255,255,0.5)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s ease",
        padding: 0,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "white";
        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
        e.currentTarget.style.background = "rgba(42,42,42,0.9)";
      }}
    >
      {children}
    </button>
  );
}
