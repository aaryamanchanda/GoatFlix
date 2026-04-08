import { Link } from "react-router-dom";
import GoatFlixLogo from "../components/GoatFlixLogo";

export default function NotFound() {
  return (
    <div style={styles.page}>
      {/* Ambient glows */}
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <GoatFlixLogo size="md" />
        </Link>
      </nav>

      {/* Content */}
      <div style={styles.content}>
        {/* Big 404 */}
        <div style={styles.bigNumber}>
          <span style={styles.four}>4</span>
          {/* Goat logo as the "0" */}
          <div style={styles.zeroWrap}>
            <div style={styles.zeroCircle}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="white"
                style={{ opacity: 0.9 }}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <span style={styles.four}>4</span>
        </div>

        <h1 style={styles.title}>Lost in the Stream</h1>
        <p style={styles.subtitle}>
          The page you're looking for doesn't exist on GoatFlix.
          <br />
          It may have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div style={styles.actions}>
          <Link to="/" style={styles.primaryBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            style={styles.secondaryBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Fun suggestions */}
        <div style={styles.suggestions}>
          <p style={styles.suggestLabel}>Maybe try one of these:</p>
          <div style={styles.suggestLinks}>
            <Link to="/" style={styles.suggestLink}>🏠 Home</Link>
            <span style={styles.dot}>•</span>
            <Link to="/login" style={styles.suggestLink}>🔐 Sign In</Link>
            <span style={styles.dot}>•</span>
            <Link to="/pricing" style={styles.suggestLink}>⚡ Pricing</Link>
          </div>
        </div>
      </div>

      {/* Floating film elements */}
      <div style={{ ...styles.floatingIcon, top: "15%", left: "8%", animationDelay: "0s" }}>🎬</div>
      <div style={{ ...styles.floatingIcon, top: "25%", right: "12%", animationDelay: "2s" }}>🍿</div>
      <div style={{ ...styles.floatingIcon, bottom: "20%", left: "15%", animationDelay: "4s" }}>🎥</div>
      <div style={{ ...styles.floatingIcon, bottom: "30%", right: "8%", animationDelay: "1s" }}>📺</div>
      <div style={{ ...styles.floatingIcon, top: "50%", left: "5%", animationDelay: "3s" }}>🎞️</div>

      <style>{`
        @keyframes float404 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 0.25; }
        }
        @keyframes pulse404 {
          0%, 100% { box-shadow: 0 0 40px rgba(229,9,20,0.3), 0 0 80px rgba(229,9,20,0.1); }
          50% { box-shadow: 0 0 60px rgba(229,9,20,0.5), 0 0 120px rgba(229,9,20,0.2); }
        }
        @keyframes fadeUp404 {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  glow1: {
    position: "absolute",
    width: "700px",
    height: "700px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(229,9,20,0.1) 0%, transparent 65%)",
    top: "-200px",
    left: "50%",
    transform: "translateX(-50%)",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(229,9,20,0.06) 0%, transparent 65%)",
    bottom: "-200px",
    right: "-100px",
    pointerEvents: "none",
  },
  nav: {
    position: "relative",
    zIndex: 10,
    padding: "20px clamp(20px, 4vw, 48px)",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px 80px",
    position: "relative",
    zIndex: 2,
    animation: "fadeUp404 0.8s ease-out both",
  },
  bigNumber: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
  },
  four: {
    fontSize: "clamp(100px, 15vw, 180px)",
    fontWeight: 900,
    color: "transparent",
    WebkitTextStroke: "3px rgba(255,255,255,0.08)",
    lineHeight: 1,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.04em",
    userSelect: "none",
  },
  zeroWrap: {
    position: "relative",
  },
  zeroCircle: {
    width: "clamp(90px, 12vw, 140px)",
    height: "clamp(90px, 12vw, 140px)",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulse404 3s ease-in-out infinite",
  },
  title: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.03em",
    marginBottom: "12px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "15px",
    color: "#71717a",
    textAlign: "center",
    lineHeight: 1.7,
    marginBottom: "36px",
    maxWidth: "440px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginBottom: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 28px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
    textDecoration: "none",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 20px rgba(229,9,20,0.35)",
    transition: "all 0.25s ease",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 28px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s ease",
  },
  suggestions: {
    textAlign: "center",
  },
  suggestLabel: {
    fontSize: "12px",
    color: "#52525b",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  suggestLinks: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  suggestLink: {
    color: "#a1a1aa",
    fontSize: "13px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  dot: {
    color: "#333",
    fontSize: "10px",
  },
  floatingIcon: {
    position: "absolute",
    fontSize: "clamp(28px, 4vw, 44px)",
    opacity: 0.15,
    pointerEvents: "none",
    animation: "float404 6s ease-in-out infinite",
    userSelect: "none",
  },
};
