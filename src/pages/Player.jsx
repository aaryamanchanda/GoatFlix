import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDetails } from "../utils/tmdb";

const IMG_W500 = "https://image.tmdb.org/t/p/w500";

export default function Player() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const src =
    type === "tv"
      ? `https://www.vidking.net/embed/tv/${id}/1/1?autoPlay=true&nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/movie/${id}?autoPlay=true`;

  /* Fetch title info */
  useEffect(() => {
    getDetails(type, id).then(setDetails).catch(console.error);
  }, [type, id]);

  /* Track progress for Continue Watching */
  useEffect(() => {
    const handler = async (event) => {
      try {
        const parsed = JSON.parse(event.data)?.data;
        if (!parsed) return;

        const d = details || (await getDetails(type, id));

        const existing = JSON.parse(localStorage.getItem("continue")) || [];
        const updated = existing.filter((m) => m.id !== parsed.id);

        updated.push({
          id: parsed.id,
          type,
          progress: parsed.progress,
          poster: d.poster_path,
          title: d.title || d.name,
        });

        localStorage.setItem("continue", JSON.stringify(updated));
      } catch {}
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [type, id, details]);

  const title = details?.title || details?.name || "";
  const year = (details?.release_date || details?.first_air_date || "").slice(0, 4);
  const rating = details?.vote_average?.toFixed(1);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#000",
        position: "relative",
      }}
    >
      {/* ── Top Info Bar ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "16px 20px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Title info */}
        {details && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              overflow: "hidden",
              animation: "fadeIn 0.5s ease-out both",
            }}
          >
            {details.poster_path && (
              <img
                src={`${IMG_W500}${details.poster_path}`}
                alt=""
                style={{
                  width: "32px",
                  height: "48px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              />
            )}
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.3,
                }}
              >
                {title}
              </p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {year && (
                  <span style={{ fontSize: "11px", color: "#a1a1aa" }}>{year}</span>
                )}
                {rating && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#facc15",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {rating}
                  </span>
                )}
                <span
                  style={{
                    fontSize: "10px",
                    color: "#71717a",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {type === "tv" ? "TV Show" : "Movie"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Loading spinner ── */}
      {!iframeLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            zIndex: 5,
            background: "#000",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid rgba(255,255,255,0.08)",
              borderTopColor: "#e50914",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p
            style={{
              fontSize: "13px",
              color: "#71717a",
              fontWeight: 500,
            }}
          >
            Loading player…
          </p>
        </div>
      )}

      {/* ── Player iframe ── */}
      <iframe
        src={src}
        onLoad={() => setIframeLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          opacity: iframeLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        allowFullScreen
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}