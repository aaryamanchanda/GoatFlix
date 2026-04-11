import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase";
import GoatFlixLogo from "../components/GoatFlixLogo";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (isForgot) {
        await sendPasswordResetEmail(auth, email);
        setSuccess("Password reset email sent! Check your inbox.");
        setLoading(false);
        return;
      }
      if (isSignUp) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      const msg = err.code?.replace("auth/", "").replace(/-/g, " ") || "Something went wrong";
      setError(msg.charAt(0).toUpperCase() + msg.slice(1));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToForgot = () => {
    setIsForgot(true);
    setIsSignUp(false);
    setError("");
    setSuccess("");
  };

  const switchToLogin = () => {
    setIsForgot(false);
    setIsSignUp(false);
    setError("");
    setSuccess("");
  };

  const getTitle = () => {
    if (isForgot) return "Reset Password";
    if (isSignUp) return "Create Account";
    return "Welcome Back";
  };

  const getSubtitle = () => {
    if (isForgot) return "Enter your email and we'll send you a reset link";
    if (isSignUp) return "Join GoatFlix and start streaming";
    return "Sign in to continue watching";
  };

  return (
    <div style={styles.page}>
      {/* Background movie poster mosaic */}
      <div style={styles.bgMosaic}>
        {[
          "https://image.tmdb.org/t/p/w300/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
          "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911BTUgME1O5aCo.jpg",
          "https://image.tmdb.org/t/p/w300/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
          "https://image.tmdb.org/t/p/w300/1E5baAaEse26fej7uHcjOgEERB2.jpg",
          "https://image.tmdb.org/t/p/w300/7WsyChQLEftFiDhRkUUOF4RpHod.jpg",
          "https://image.tmdb.org/t/p/w300/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
          "https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
          "https://image.tmdb.org/t/p/w300/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg",
          "https://image.tmdb.org/t/p/w300/udDclJoHjZNY7T0DOXqvNKH1UIh.jpg",
          "https://image.tmdb.org/t/p/w300/9cqNcoGLjRiEHUU7b1oQbalLVhe.jpg",
          "https://image.tmdb.org/t/p/w300/z1p34vh7dEOnLDV4jC1kJzh7POy.jpg",
          "https://image.tmdb.org/t/p/w300/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
        ].map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: 0.35,
            }}
            loading="lazy"
          />
        ))}
      </div>
      <div style={styles.bgOverlay} />

      {/* Ambient glow */}
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      {/* Logo */}
      <Link to="/" style={styles.logo}>
        <GoatFlixLogo size="lg" />
      </Link>

      {/* Card */}
      <div style={styles.card}>
        <h1 style={styles.title}>{getTitle()}</h1>
        <p style={styles.subtitle}>{getSubtitle()}</p>

        {/* Google Button — hide on forgot password */}
        {!isForgot && (
          <>
            <button type="button" onClick={handleGoogle} disabled={loading} style={styles.googleBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine} />
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && !isForgot && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarya Manchanda"
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#e50914";
                  e.target.style.boxShadow = "0 0 0 3px rgba(229,9,20,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = "#e50914";
                e.target.style.boxShadow = "0 0 0 3px rgba(229,9,20,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {!isForgot && (
            <div style={styles.fieldGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={styles.label}>Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={switchToForgot}
                    style={styles.forgotBtn}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#e50914";
                  e.target.style.boxShadow = "0 0 0 3px rgba(229,9,20,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          )}

          {error && (
            <div style={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div style={styles.success}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "linear-gradient(135deg, #ff1a2a 0%, #cc0811 100%)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(229,9,20,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #e50914 0%, #b20710 100%)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(229,9,20,0.3)";
            }}
          >
            {loading ? (
              <div style={{
                width: "20px", height: "20px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
            ) : (
              isForgot ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        {/* Toggle */}
        <p style={styles.toggle}>
          {isForgot ? (
            <>
              Remember your password?{" "}
              <button onClick={switchToLogin} style={styles.toggleBtn}>
                Sign In
              </button>
            </>
          ) : isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => { setIsSignUp(false); setError(""); setSuccess(""); }}
                style={styles.toggleBtn}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => { setIsSignUp(true); setIsForgot(false); setError(""); setSuccess(""); }}
                style={styles.toggleBtn}
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#000",
    position: "relative",
    overflow: "hidden",
    padding: "40px 20px",
  },
  bgMosaic: {
    position: "absolute",
    inset: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
    gap: "2px",
    opacity: 0.15,
    filter: "blur(1px)",
    pointerEvents: "none",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 100%)",
    pointerEvents: "none",
  },
  bgGlow1: {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(229,9,20,0.12) 0%, transparent 70%)",
    top: "-200px",
    right: "-100px",
    animation: "float 20s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 1,
  },
  bgGlow2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%)",
    bottom: "-150px",
    left: "-100px",
    animation: "float 25s ease-in-out infinite reverse",
    pointerEvents: "none",
    zIndex: 1,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    marginBottom: "40px",
    position: "relative",
    zIndex: 2,
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "40px 36px",
    backdropFilter: "blur(40px)",
    WebkitBackdropFilter: "blur(40px)",
    position: "relative",
    zIndex: 2,
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.03em",
    marginBottom: "8px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "#71717a",
    textAlign: "center",
    marginBottom: "28px",
    fontWeight: 400,
  },
  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.06)",
  },
  dividerText: {
    fontSize: "12px",
    color: "#52525b",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#a1a1aa",
    letterSpacing: "-0.01em",
  },
  forgotBtn: {
    background: "none",
    border: "none",
    color: "#e50914",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
    transition: "opacity 0.2s ease",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.15)",
    color: "#f87171",
    fontSize: "13px",
    fontWeight: 500,
  },
  success: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(52,211,153,0.08)",
    border: "1px solid rgba(52,211,153,0.2)",
    color: "#34d399",
    fontSize: "13px",
    fontWeight: 500,
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 20px rgba(229,9,20,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "4px",
  },
  toggle: {
    textAlign: "center",
    fontSize: "13px",
    color: "#71717a",
    marginTop: "24px",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#e50914",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
};
