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
          background: "#080d21",
          color: "#a769f2",
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
