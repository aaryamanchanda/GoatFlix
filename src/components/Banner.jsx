import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

export default function Banner({ movie }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (movie) {
      const t = setTimeout(() => setLoaded(true), 100);
      return () => clearTimeout(t);
    }
  }, [movie]);

  if (!movie) return (
    <div style={{
      width: "100%",
      height: "90vh",
      minHeight: "500px",
      maxHeight: "850px",
      background: "var(--surface-1)",
    }} />
  );

  const type = movie.type || movie.media_type || "movie";
  const title = movie.title || movie.name || "Untitled";
  const backdrop = movie.backdrop_path;
  const overview = movie.overview || "";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "90vh",
        minHeight: "500px",
        maxHeight: "850px",
        overflow: "hidden",
      }}
    >
      {/* Backdrop Image */}
      {backdrop && (
        <img
          src={`${BACKDROP_BASE}${backdrop}`}
          alt={title}
          onLoad={() => setLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease-out",
            transform: "scale(1.02)",
          }}
        />
      )}

      {/* Cinematic overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgb(0,0,0) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0) 50%)",
        }}
      />
      {/* Top vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: "0 clamp(24px, 4vw, 48px) clamp(48px, 8vh, 80px)",
          maxWidth: "650px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
        }}
      >
        {/* Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#fff",
              background: "var(--brand)",
              padding: "4px 10px",
              borderRadius: "4px",
            }}
          >
            {type === "tv" ? "Series" : "Film"}
          </span>
          {year && (
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {year}
            </span>
          )}
          {rating && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--gold)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {rating}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            color: "white",
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: "16px",
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            letterSpacing: "-0.03em",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </h1>

        {/* Overview */}
        <p
          style={{
            color: "rgba(228,228,231,0.85)",
            fontSize: "15px",
            lineHeight: 1.65,
            marginBottom: "28px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            maxWidth: "520px",
          }}
        >
          {overview}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigate(`/details/${type}/${movie.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "white",
              color: "black",
              fontWeight: 700,
              padding: "12px 32px",
              borderRadius: "8px",
              fontSize: "15px",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.04)";
              e.target.style.boxShadow = "0 6px 30px rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 20px rgba(255,255,255,0.15)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
          <button
            onClick={() => navigate(`/details/${type}/${movie.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontWeight: 600,
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "15px",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              fontFamily: "inherit",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.18)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}