/**
 * GoatFlix Logo — Reusable brand mark component.
 * Renders a stylised goat-head icon + "GoatFlix" wordmark.
 *
 * Props:
 *   size  – "sm" | "md" | "lg"  (default "md")
 *   iconOnly – boolean           (default false)
 */
export default function GoatFlixLogo({ size = "md", iconOnly = false }) {
  const sizes = {
    sm: { icon: 30, font: 18, gap: 8 },
    md: { icon: 36, font: 22, gap: 10 },
    lg: { icon: 44, font: 28, gap: 12 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${s.gap}px` }}>
      {/* Icon — goat silhouette with play-button horn */}
      <div
        style={{
          width: `${s.icon}px`,
          height: `${s.icon}px`,
          borderRadius: "10px",
          background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow:
            "0 0 20px rgba(229,9,20,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <svg
          width={s.icon * 0.55}
          height={s.icon * 0.55}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved left horn */}
          <path
            d="M18 8C14 4 8 3 5 6C3 8 4 12 8 15C12 18 16 19 18 18"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Curved right horn */}
          <path
            d="M46 8C50 4 56 3 59 6C61 8 60 12 56 15C52 18 48 19 46 18"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Head shape */}
          <path
            d="M20 16C20 16 18 22 18 28C18 36 22 42 26 46C28 48 30 50 32 50C34 50 36 48 38 46C42 42 46 36 46 28C46 22 44 16 44 16"
            fill="white"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Ears */}
          <path
            d="M20 18L14 22L18 26"
            fill="white"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M44 18L50 22L46 26"
            fill="white"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Left eye */}
          <ellipse cx="26" cy="30" rx="3" ry="3.5" fill="#e50914" />
          <ellipse cx="26.5" cy="29.5" rx="1.2" ry="1.5" fill="#b20710" />
          {/* Right eye */}
          <ellipse cx="38" cy="30" rx="3" ry="3.5" fill="#e50914" />
          <ellipse cx="38.5" cy="29.5" rx="1.2" ry="1.5" fill="#b20710" />
          {/* Nose / snout */}
          <path
            d="M29 38C29 38 30 40 32 40C34 40 35 38 35 38"
            stroke="#e50914"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Beard / tuft */}
          <path
            d="M30 50C30 54 31 57 32 58C33 57 34 54 34 50"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
          />
          {/* Play triangle overlay on forehead */}
          <path
            d="M29 22L29 34L38 28Z"
            fill="#e50914"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {!iconOnly && (
        <span
          style={{
            fontSize: `${s.font}px`,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "white",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          Goat
          <span style={{ color: "#e50914" }}>Flix</span>
        </span>
      )}
    </div>
  );
}
