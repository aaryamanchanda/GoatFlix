/**
 * SkeletonBanner — Loading placeholder for the hero Banner component.
 */
export default function SkeletonBanner() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "90vh",
        minHeight: "500px",
        maxHeight: "850px",
        overflow: "hidden",
        background: "var(--surface-1)",
      }}
    >
      {/* Shimmer background */}
      <div
        className="skeleton"
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Cinematic overlays (same as Banner) */}
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

      {/* Content skeleton */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: "0 clamp(24px, 4vw, 48px) clamp(48px, 8vh, 80px)",
          maxWidth: "650px",
        }}
      >
        {/* Badge row */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <div
            className="skeleton"
            style={{ width: "60px", height: "22px", borderRadius: "4px" }}
          />
          <div
            className="skeleton"
            style={{ width: "40px", height: "22px", borderRadius: "4px" }}
          />
          <div
            className="skeleton"
            style={{ width: "50px", height: "22px", borderRadius: "4px" }}
          />
        </div>

        {/* Title */}
        <div
          className="skeleton"
          style={{
            width: "80%",
            height: "clamp(2.2rem, 4.5vw, 3.8rem)",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />
        <div
          className="skeleton"
          style={{
            width: "50%",
            height: "clamp(2.2rem, 4.5vw, 3.8rem)",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />

        {/* Overview lines */}
        <div
          className="skeleton"
          style={{
            width: "90%",
            height: "14px",
            borderRadius: "4px",
            marginBottom: "8px",
          }}
        />
        <div
          className="skeleton"
          style={{
            width: "75%",
            height: "14px",
            borderRadius: "4px",
            marginBottom: "8px",
          }}
        />
        <div
          className="skeleton"
          style={{
            width: "60%",
            height: "14px",
            borderRadius: "4px",
            marginBottom: "28px",
          }}
        />

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <div
            className="skeleton"
            style={{
              width: "130px",
              height: "46px",
              borderRadius: "8px",
            }}
          />
          <div
            className="skeleton"
            style={{
              width: "140px",
              height: "46px",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
