import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoatFlixLogo from "../components/GoatFlixLogo";

export default function Pricing() {
  const { user, subscribed, markSubscribed } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (subscribed) {
      navigate("/");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
        amount: 6900,
        currency: "INR",
        name: "GoatFlix",
        description: "GoatFlix Premium — Unlimited Streaming",
        image: "",
        handler: async function (response) {
          console.log("Payment ID:", response.razorpay_payment_id);
          await markSubscribed();
          navigate("/");
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: "#e50914",
          backdrop_color: "rgba(0,0,0,0.85)",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function () {
          setError("Payment failed. Please try again.");
          setProcessing(false);
        });
        rzp.open();
      } else {
        setError("Payment system not loaded. Please refresh and try again.");
        setProcessing(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  const features = [
    { icon: "🎬", text: "Unlimited movies & TV shows" },
    { icon: "📱", text: "Watch on any device" },
    { icon: "🔥", text: "Full HD & 4K streaming" },
    { icon: "⚡", text: "No ads, ever" },
    { icon: "🌟", text: "New releases every week" },
  ];

  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes! You can cancel your subscription at any time. There are no cancellation fees or penalties. Your access will continue until the end of your billing period.",
    },
    {
      q: "How many devices can I watch on?",
      a: "You can watch GoatFlix on up to 2 devices simultaneously. Sign in on your phone, tablet, laptop, and TV — all at the same time.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept UPI, all major credit and debit cards, net banking, and popular wallets through our secure payment partner Razorpay.",
    },
    {
      q: "Is there a free trial?",
      a: "We don't offer a free trial, but at just ₹69/month (less than ₹3/day), GoatFlix is incredibly affordable. Plus, you can cancel anytime!",
    },
    {
      q: "What content is available?",
      a: "GoatFlix offers thousands of movies and TV shows across every genre — from the latest blockbusters to classic favorites, all in HD and 4K quality.",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Ambient glows */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <GoatFlixLogo size="md" />
        </Link>
      </nav>

      {/* Content */}
      <div style={styles.content}>
        {/* Badge */}
        <div style={styles.badge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          PREMIUM
        </div>

        <h1 style={styles.title}>
          Unlimited Entertainment
          <br />
          <span style={{ color: "#e50914" }}>One Simple Price</span>
        </h1>

        <p style={styles.subtitle}>
          Get access to everything GoatFlix has to offer.
          <br />
          No hidden fees. Cancel anytime.
        </p>

        {/* Price card */}
        <div style={styles.priceCard}>
          <div style={styles.priceCardGlow} />
          <div style={styles.priceCardInner}>
            {/* Price */}
            <div style={styles.priceRow}>
              <div style={styles.priceMain}>
                <span style={styles.currency}>₹</span>
                <span style={styles.amount}>69</span>
                <span style={styles.period}>/month</span>
              </div>
              <div style={styles.savings}>
                That's less than ₹3/day!
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

            {/* Features */}
            <div style={styles.features}>
              {features.map((f, i) => (
                <div key={i} style={styles.featureItem}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <span style={styles.featureText}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

            {/* CTA */}
            {subscribed ? (
              <div style={styles.subscribedBadge}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                You're subscribed! Enjoy unlimited streaming.
              </div>
            ) : (
              <>
                <button
                  onClick={handleSubscribe}
                  disabled={processing}
                  style={styles.cta}
                  onMouseEnter={(e) => {
                    if (!processing) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(229,9,20,0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 30px rgba(229,9,20,0.35)";
                  }}
                >
                  {processing ? (
                    <div style={{
                      width: "22px", height: "22px",
                      border: "2.5px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }} />
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Streaming Now
                    </>
                  )}
                </button>

                {error && (
                  <div style={styles.error}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4m0 4h.01" />
                    </svg>
                    {error}
                  </div>
                )}
              </>
            )}

            <p style={styles.guarantee}>
              🔒 Secure payment via Razorpay • Cancel anytime
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div style={styles.trust}>
          <div style={styles.trustItem}>
            <span style={{ fontSize: "22px" }}>💳</span>
            <span>UPI, Cards & Netbanking</span>
          </div>
          <div style={styles.trustDivider} />
          <div style={styles.trustItem}>
            <span style={{ fontSize: "22px" }}>🔐</span>
            <span>256-bit Encryption</span>
          </div>
          <div style={styles.trustDivider} />
          <div style={styles.trustItem}>
            <span style={{ fontSize: "22px" }}>⚡</span>
            <span>Instant Access</span>
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div style={styles.faqSection}>
          <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqList}>
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseBorder {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ── FAQ Accordion Item ── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        overflow: "hidden",
        background: open ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
        transition: "all 0.2s ease",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
          gap: "12px",
        }}
      >
        {question}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#71717a"
          strokeWidth="2"
          style={{
            flexShrink: 0,
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        style={{
          maxHeight: open ? "200px" : "0px",
          overflow: "hidden",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <p
          style={{
            padding: "0 20px 18px",
            fontSize: "13px",
            color: "#a1a1aa",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    position: "relative",
    overflow: "hidden",
  },
  glowTop: {
    position: "absolute",
    width: "800px",
    height: "800px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(229,9,20,0.1) 0%, transparent 60%)",
    top: "-400px",
    left: "50%",
    transform: "translateX(-50%)",
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(229,9,20,0.06) 0%, transparent 60%)",
    bottom: "-300px",
    right: "-100px",
    pointerEvents: "none",
  },
  nav: {
    position: "relative",
    zIndex: 10,
    padding: "20px clamp(20px, 4vw, 48px)",
  },
  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px 80px",
    maxWidth: "560px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "100px",
    background: "rgba(229,9,20,0.12)",
    border: "1px solid rgba(229,9,20,0.25)",
    color: "#e50914",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    marginBottom: "24px",
  },
  title: {
    fontSize: "clamp(32px, 5vw, 44px)",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
    textAlign: "center",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#71717a",
    textAlign: "center",
    lineHeight: 1.6,
    marginBottom: "40px",
  },
  priceCard: {
    width: "100%",
    position: "relative",
    borderRadius: "24px",
    padding: "2px",
    background: "linear-gradient(135deg, rgba(229,9,20,0.4) 0%, rgba(229,9,20,0.1) 30%, rgba(255,255,255,0.06) 70%, rgba(229,9,20,0.3) 100%)",
    animation: "pulseBorder 3s ease-in-out infinite",
  },
  priceCardGlow: {
    position: "absolute",
    inset: "-1px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(229,9,20,0.15), transparent 40%, transparent 60%, rgba(229,9,20,0.1))",
    filter: "blur(20px)",
    pointerEvents: "none",
  },
  priceCardInner: {
    background: "rgba(10,10,10,0.95)",
    borderRadius: "22px",
    padding: "36px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    backdropFilter: "blur(20px)",
  },
  priceRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  priceMain: {
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
  },
  currency: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#e50914",
  },
  amount: {
    fontSize: "72px",
    fontWeight: 900,
    color: "#fff",
    letterSpacing: "-0.04em",
    lineHeight: 1,
  },
  period: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#71717a",
    marginLeft: "4px",
  },
  savings: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#facc15",
    background: "rgba(250,204,21,0.08)",
    padding: "4px 12px",
    borderRadius: "100px",
  },
  features: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  featureIcon: {
    fontSize: "18px",
    width: "28px",
    textAlign: "center",
  },
  featureText: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#d4d4d8",
  },
  cta: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 30px rgba(229,9,20,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    letterSpacing: "-0.01em",
  },
  subscribedBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderRadius: "12px",
    background: "rgba(52,211,153,0.08)",
    border: "1px solid rgba(52,211,153,0.2)",
    color: "#34d399",
    fontSize: "14px",
    fontWeight: 600,
    width: "100%",
    justifyContent: "center",
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
    marginTop: "12px",
    width: "100%",
    justifyContent: "center",
  },
  guarantee: {
    fontSize: "12px",
    color: "#52525b",
    marginTop: "16px",
    textAlign: "center",
  },
  trust: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#71717a",
    fontWeight: 500,
  },
  trustDivider: {
    width: "1px",
    height: "20px",
    background: "rgba(255,255,255,0.08)",
  },
  faqSection: {
    width: "100%",
    marginTop: "56px",
  },
  faqTitle: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.03em",
    textAlign: "center",
    marginBottom: "24px",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};
