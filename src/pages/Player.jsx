import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getDetails } from "../utils/tmdb";

export default function Player() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const src =
    type === "tv"
      ? `https://www.vidking.net/embed/tv/${id}/1/1?autoPlay=true&nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/movie/${id}?autoPlay=true`;

  useEffect(() => {
    const handler = async (event) => {
      try {
        const parsed = JSON.parse(event.data)?.data;
        if (!parsed) return;

        const details = await getDetails(type, id);

        const existing =
          JSON.parse(localStorage.getItem("continue")) || [];

        const updated = existing.filter((m) => m.id !== parsed.id);

        updated.push({
          id: parsed.id,
          type,
          progress: parsed.progress,
          poster: details.poster_path,
          title: details.title || details.name,
        });

        localStorage.setItem("continue", JSON.stringify(updated));
      } catch {}
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [type, id]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#000",
      }}
    >
      {/* Back button */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(0,0,0,0.6)",
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.6)";
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Player iframe */}
      <iframe
        src={src}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allowFullScreen
      />
    </div>
  );
}