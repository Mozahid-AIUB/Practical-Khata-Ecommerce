import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(135deg, #0f2a5c 0%, #1e4d8c 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          Practical Khata
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            fontWeight: 500,
            color: "#cfe0ff",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Handwritten SSC &amp; HSC Practical Notebooks
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            fontSize: 24,
            color: "#9db8e8",
          }}
        >
          <span>Nationwide delivery</span>
          <span>·</span>
          <span>Starting from Tk 290</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
