import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#04070b",
          color: "#63f1c3",
          fontSize: 36,
          fontWeight: 700,
          borderRadius: 16,
          letterSpacing: -1,
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        PT
      </div>
    ),
    {
      ...size,
    }
  );
}
