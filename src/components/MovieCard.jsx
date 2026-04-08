import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import MoviePopup from "./MoviePopup";

const IMG = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cardRect, setCardRect] = useState(null);
  const cardRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  const type = movie.type || movie.media_type || "movie";
  const title = movie.title || movie.name || "Untitled";
  const poster = movie.poster_path || movie.poster;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  if (!poster) return null;

  const handleMouseEnter = useCallback(() => {
    clearTimeout(leaveTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      if (cardRef.current) {
        setCardRect(cardRef.current.getBoundingClientRect());
        setShowPopup(true);
      }
    }, 600);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setShowPopup(false);
      setCardRect(null);
    }, 280);
  }, []);

  const handlePopupMouseEnter = useCallback(() => {
    clearTimeout(leaveTimerRef.current);
  }, []);

  const handlePopupMouseLeave = useCallback(() => {
    leaveTimerRef.current = setTimeout(() => {
      setShowPopup(false);
      setCardRect(null);
    }, 200);
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        style={{
          position: "relative",
          flexShrink: 0,
          width: "160px",
          cursor: "pointer",
        }}
        onClick={() => navigate(`/details/${type}/${movie.id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Poster container */}
        <div
          style={{
            position: "relative",
            borderRadius: "10px",
            overflow: "hidden",
            aspectRatio: "2 / 3",
            background: "var(--surface-2)",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: showPopup ? "scale(1.06) translateY(-6px)" : "scale(1) translateY(0)",
            boxShadow: showPopup
              ? "0 14px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)"
              : "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {!loaded && (
            <div className="skeleton" style={{ position: "absolute", inset: 0 }} />
          )}
          <img
            src={`${IMG}${poster}`}
            alt={title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Rating badge on hover */}
          {rating && (
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                opacity: showPopup ? 1 : 0,
                transform: showPopup ? "translateY(0)" : "translateY(6px)",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--gold)",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {rating}
            </div>
          )}
        </div>

        {/* Title underneath */}
        <p
          style={{
            marginTop: "8px",
            fontSize: "12px",
            fontWeight: 500,
            color: showPopup ? "var(--text-primary)" : "var(--text-muted)",
            transition: "color 0.2s ease",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }}
        >
          {title}
        </p>
      </div>

      {/* Popup portal */}
      {showPopup && cardRect && (
        <MoviePopup
          movie={movie}
          cardRect={cardRect}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        />
      )}
    </>
  );
}
