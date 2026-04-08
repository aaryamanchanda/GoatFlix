/**
 * SkeletonRow — Placeholder loading state for content rows.
 * Matches the visual structure of <Row /> and <TopRow />.
 */
export default function SkeletonRow({ variant = "default", count = 8 }) {
  const isTop = variant === "top10";

  return (
    <div style={{ marginBottom: "12px" }}>
      {/* Section header skeleton */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 clamp(16px, 4vw, 48px)",
          marginBottom: "14px",
        }}
      >
        <div
          className="skeleton"
          style={{
            width: isTop ? "160px" : "140px",
            height: "18px",
            borderRadius: "6px",
          }}
        />
        <div
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(to right, rgba(255,255,255,0.06), transparent)",
          }}
        />
      </div>

      {/* Card skeletons */}
      <div
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: isTop ? "0px" : "14px",
          overflowX: "hidden",
          padding: isTop
            ? "8px clamp(16px, 4vw, 48px) 16px"
            : "4px clamp(16px, 4vw, 48px) 8px",
        }}
      >
        {Array.from({ length: count }).map((_, i) =>
          isTop ? (
            <div
              key={i}
              style={{
                position: "relative",
                flexShrink: 0,
                width: "165px",
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: "4px",
              }}
            >
              {/* Number skeleton */}
              <div
                style={{
                  position: "absolute",
                  left: "-4px",
                  bottom: "4px",
                  width: "50px",
                  height: "100px",
                  opacity: 0.05,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: "8px",
                }}
              />
              {/* Poster skeleton */}
              <div
                className="skeleton"
                style={{
                  marginLeft: "52px",
                  borderRadius: "10px",
                  width: "120px",
                  aspectRatio: "2 / 3",
                  flexShrink: 0,
                }}
              />
            </div>
          ) : (
            <div key={i} style={{ flexShrink: 0, width: "160px" }}>
              <div
                className="skeleton"
                style={{
                  borderRadius: "10px",
                  aspectRatio: "2 / 3",
                  width: "100%",
                }}
              />
              <div
                className="skeleton"
                style={{
                  marginTop: "8px",
                  width: `${60 + Math.random() * 30}%`,
                  height: "12px",
                  borderRadius: "4px",
                }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
