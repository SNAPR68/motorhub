import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Autovinci — AI-Powered Automotive Marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #080a0f 0%, #0f1724 50%, #080a0f 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(17,82,212,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -60,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(17,82,212,0.06)",
          }}
        />

        {/* Brand badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg, #1152d4, #0e44b5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
              fontWeight: 900,
            }}
          >
            A
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Autovinci
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 800,
            marginBottom: 16,
          }}
        >
          AI-Powered Automotive Marketplace
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(148,163,184,0.9)",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          Smart pricing, virtual tours, and dealer intelligence for India
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
          }}
        >
          {["AI Pricing", "Vehicle Passport", "DealerOS", "True Cost"].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: "8px 20px",
                  borderRadius: 20,
                  background: "rgba(17,82,212,0.15)",
                  border: "1px solid rgba(17,82,212,0.3)",
                  color: "#60a5fa",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
