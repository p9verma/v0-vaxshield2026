import { ImageResponse } from "next/og"
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

export const runtime = "edge"
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1b36 0%, #0e2a4d 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 36 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(56, 189, 248, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            🛡️
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, display: "flex" }}>
            Vax<span style={{ color: "#38bdf8" }}>Shield</span>
          </div>
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.15, maxWidth: 950, display: "flex" }}>
          Vaccine education for schools, clinics & communities
        </div>
        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.7)", marginTop: 28, maxWidth: 880, display: "flex" }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  )
}
