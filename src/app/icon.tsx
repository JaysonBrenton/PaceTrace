import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  const rgb = (...values: number[]) => `${["r", "g", "b"].join("")}(${values.join(" ")})`;
  const background = rgb(24, 25, 27);
  const accent = rgb(110, 86, 207);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background,
          color: accent,
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
