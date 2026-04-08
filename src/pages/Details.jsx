import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_KEY = "f80c9736e0eeda31350cd3af24b128bf";
const BASE = "https://api.themoviedb.org/3";
const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
const IMG_W500 = "https://image.tmdb.org/t/p/w500";
const IMG_W185 = "https://image.tmdb.org/t/p/w185";

export default function Details() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    Promise.all([
      axios.get(`${BASE}/${type}/${id}?api_key=${API_KEY}`),
      axios.get(`${BASE}/${type}/${id}/credits?api_key=${API_KEY}`),
      axios.get(`${BASE}/${type}/${id}/similar?api_key=${API_KEY}`),
      axios.get(`${BASE}/${type}/${id}/videos?api_key=${API_KEY}`),
    ])
      .then(([detailRes, creditsRes, similarRes, videosRes]) => {
        setData(detailRes.data);
        setCast((creditsRes.data.cast || []).slice(0, 12));
        setSimilar(
          (similarRes.data.results || []).filter((m) => m.poster_path).slice(0, 12)
        );
        const yt = (videosRes.data.results || []).find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(yt || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type, id]);

  if (loading) return <DetailSkeleton />;
  if (!data) return null;

  const title = data.title || data.name || "Untitled";
  const backdrop = data.backdrop_path;
  const poster = data.poster_path;
  const overview = data.overview || "";
  const year = (data.release_date || data.first_air_date || "").slice(0, 4);
  const rating = data.vote_average?.toFixed(1);
  const voteCount = data.vote_count;
  const runtime = data.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
    : data.number_of_seasons
    ? `${data.number_of_seasons} Season${data.number_of_seasons > 1 ? "s" : ""}`
    : null;
  const genres = (data.genres || []).map((g) => g.name);
  const tagline = data.tagline || "";
  const language = (data.original_language || "").toUpperCase();

  return (
    <div style={{ background: "var(--surface-0)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <Navbar onSearch={() => {}} />

      {/* ── Hero Backdrop ── */}
      <div style={heroStyle}>
        {backdrop && (
          <img
            src={`${IMG_ORIGINAL}${backdrop}`}
            alt={title}
            style={heroImgStyle}
          />
        )}
        <div style={heroOverlayLeft} />
        <div style={heroOverlayBottom} />
        <div style={heroOverlayTop} />
      </div>

      {/* ── Main Content ── */}
      <div style={mainStyle}>
        {/* Poster + Info row */}
        <div style={infoRow}>
          {/* Poster */}
          {poster && (
            <div style={posterWrap}>
              <img
                src={`${IMG_W500}${poster}`}
                alt={title}
                style={posterImg}
              />
            </div>
          )}

          {/* Info */}
          <div style={infoContent}>
            {tagline && <p style={taglineStyle}>"{tagline}"</p>}

            <h1 style={titleStyle}>{title}</h1>

            {/* Meta badges */}
            <div style={metaRow}>
              {year && <span style={metaBadge}>{year}</span>}
              {runtime && <span style={metaBadge}>{runtime}</span>}
              {language && <span style={metaBadge}>{language}</span>}
              {rating && (
                <span style={{ ...metaBadge, color: "var(--gold)", borderColor: "rgba(250,204,21,0.3)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {rating}
                  {voteCount && <span style={{ color: "#71717a", fontWeight: 400 }}> ({voteCount.toLocaleString()})</span>}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div style={genreRow}>
                {genres.map((g) => (
                  <span key={g} style={genreChip}>{g}</span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p style={overviewStyle}>{overview}</p>

            {/* Action buttons */}
            <div style={buttonRow}>
              <button
                onClick={() => navigate(`/player/${type}/${id}`)}
                style={playBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.15)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>

              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  style={trailerBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Cast ── */}
        {cast.length > 0 && (
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>Cast</h2>
            <div className="scrollbar-hide" style={castScroll}>
              {cast.map((person) => (
                <div key={person.id} style={castCard}>
                  {person.profile_path ? (
                    <img
                      src={`${IMG_W185}${person.profile_path}`}
                      alt={person.name}
                      style={castImg}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ ...castImg, background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "20px" }}>
                      👤
                    </div>
                  )}
                  <p style={castName}>{person.name}</p>
                  <p style={castChar}>{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Similar / Recommended ── */}
        {similar.length > 0 && (
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>More Like This</h2>
            <div style={similarGrid}>
              {similar.map((m) => {
                const mType = m.media_type || type;
                return (
                  <Link
                    key={m.id}
                    to={`/details/${mType}/${m.id}`}
                    style={similarCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.04) translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
                    }}
                  >
                    <img
                      src={`${IMG_W500}${m.poster_path}`}
                      alt={m.title || m.name}
                      style={similarImg}
                      loading="lazy"
                    />
                    <p style={similarTitle}>{m.title || m.name}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ── Trailer Modal ── */}
      {showTrailer && trailer && (
        <div
          style={modalOverlay}
          onClick={() => setShowTrailer(false)}
        >
          <div
            style={modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              style={modalClose}
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              style={modalIframe}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Trailer"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Detail Skeleton ── */
function DetailSkeleton() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <div
        className="skeleton"
        style={{ width: "100%", height: "60vh", minHeight: "400px" }}
      />
      <div style={{ padding: "0 clamp(24px, 4vw, 48px)", marginTop: "-120px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          <div className="skeleton" style={{ width: "220px", height: "330px", borderRadius: "14px", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div className="skeleton" style={{ width: "70%", height: "38px", borderRadius: "8px", marginBottom: "16px" }} />
            <div className="skeleton" style={{ width: "50%", height: "20px", borderRadius: "6px", marginBottom: "20px" }} />
            <div className="skeleton" style={{ width: "90%", height: "14px", borderRadius: "4px", marginBottom: "8px" }} />
            <div className="skeleton" style={{ width: "80%", height: "14px", borderRadius: "4px", marginBottom: "8px" }} />
            <div className="skeleton" style={{ width: "60%", height: "14px", borderRadius: "4px", marginBottom: "28px" }} />
            <div style={{ display: "flex", gap: "12px" }}>
              <div className="skeleton" style={{ width: "120px", height: "46px", borderRadius: "8px" }} />
              <div className="skeleton" style={{ width: "150px", height: "46px", borderRadius: "8px" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ STYLES ══════════════════ */
const heroStyle = {
  position: "relative",
  width: "100%",
  height: "60vh",
  minHeight: "400px",
  maxHeight: "650px",
  overflow: "hidden",
};

const heroImgStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "top center",
};

const heroOverlayLeft = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
};

const heroOverlayBottom = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 30%, transparent 60%)",
};

const heroOverlayTop = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 20%)",
};

const mainStyle = {
  padding: "0 clamp(24px, 4vw, 48px) 80px",
  marginTop: "-160px",
  position: "relative",
  zIndex: 2,
  maxWidth: "1200px",
  marginLeft: "auto",
  marginRight: "auto",
};

const infoRow = {
  display: "flex",
  gap: "32px",
  marginBottom: "48px",
  flexWrap: "wrap",
};

const posterWrap = {
  flexShrink: 0,
  width: "220px",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
};

const posterImg = {
  width: "100%",
  display: "block",
};

const infoContent = {
  flex: 1,
  minWidth: "280px",
  paddingTop: "20px",
};

const taglineStyle = {
  fontSize: "14px",
  color: "#a1a1aa",
  fontStyle: "italic",
  marginBottom: "8px",
  fontWeight: 400,
};

const titleStyle = {
  fontSize: "clamp(28px, 4vw, 44px)",
  fontWeight: 900,
  color: "#fff",
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  marginBottom: "16px",
};

const metaRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "14px",
  flexWrap: "wrap",
};

const metaBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#bcbcbc",
  border: "1px solid rgba(255,255,255,0.15)",
  padding: "4px 10px",
  borderRadius: "6px",
};

const genreRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginBottom: "18px",
};

const genreChip = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#e50914",
  background: "rgba(229,9,20,0.1)",
  border: "1px solid rgba(229,9,20,0.2)",
  padding: "4px 12px",
  borderRadius: "100px",
};

const overviewStyle = {
  fontSize: "15px",
  color: "rgba(228,228,231,0.85)",
  lineHeight: 1.7,
  marginBottom: "24px",
  maxWidth: "600px",
};

const buttonRow = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const playBtn = {
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
};

const trailerBtn = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontWeight: 600,
  padding: "12px 28px",
  borderRadius: "8px",
  fontSize: "15px",
  border: "1px solid rgba(255,255,255,0.1)",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.2s ease",
};

const sectionStyle = {
  marginBottom: "48px",
};

const sectionTitle = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#fff",
  letterSpacing: "-0.02em",
  marginBottom: "18px",
};

const castScroll = {
  display: "flex",
  gap: "16px",
  overflowX: "auto",
  paddingBottom: "8px",
};

const castCard = {
  flexShrink: 0,
  width: "110px",
  textAlign: "center",
};

const castImg = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
  margin: "0 auto 8px",
  display: "block",
  border: "2px solid rgba(255,255,255,0.06)",
};

const castName = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#fff",
  marginBottom: "2px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const castChar = {
  fontSize: "11px",
  color: "#71717a",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const similarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "16px",
};

const similarCard = {
  textDecoration: "none",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

const similarImg = {
  width: "100%",
  aspectRatio: "2 / 3",
  objectFit: "cover",
  borderRadius: "10px",
  display: "block",
};

const similarTitle = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#a1a1aa",
  marginTop: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  zIndex: 2000,
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const modalContent = {
  position: "relative",
  width: "100%",
  maxWidth: "900px",
  aspectRatio: "16 / 9",
  borderRadius: "14px",
  overflow: "hidden",
  background: "#111",
  boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
};

const modalClose = {
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 10,
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "rgba(0,0,0,0.7)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalIframe = {
  width: "100%",
  height: "100%",
  border: "none",
};
