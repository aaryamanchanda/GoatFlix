import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { createPortal } from "react-dom";

/* ── Context ──────────────────────────────────────── */
const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* ── Provider ─────────────────────────────────────── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    toast: addToast,
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column-reverse",
            gap: "10px",
            pointerEvents: "none",
          }}
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDone={() => removeToast(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

/* ── Individual Toast ─────────────────────────────── */
const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4m0 4h.01" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4m0-4h.01" />
    </svg>
  ),
};

const COLORS = {
  success: { bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", text: "#34d399" },
  error: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", text: "#f87171" },
  info: { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", text: "#60a5fa" },
};

function ToastItem({ toast, onDone }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 300);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onDone]);

  const c = COLORS[toast.type] || COLORS.info;

  return (
    <div
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        borderRadius: "12px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        color: c.text,
        fontSize: "13px",
        fontWeight: 600,
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        transform: visible && !exiting
          ? "translateX(0) scale(1)"
          : "translateX(30px) scale(0.95)",
        opacity: visible && !exiting ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        maxWidth: "360px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {ICONS[toast.type] || ICONS.info}
      {toast.message}
    </div>
  );
}
