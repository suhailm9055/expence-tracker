import { ImageResponse } from "next/og";
import { createElement } from "react";

export const runtime = "edge";

const ICON_SIZES: Record<string, number> = {
  "icon-192.png": 192,
  "icon-512.png": 512,
};

export function GET(_: Request, { params }: { params: { icon: string } }) {
  const size = ICON_SIZES[params.icon];

  if (!size) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          borderRadius: "22%",
          color: "#38bdf8",
          fontSize: Math.round(size * 0.53),
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
        },
      },
      "₹"
    ),
    { width: size, height: size }
  );
}
