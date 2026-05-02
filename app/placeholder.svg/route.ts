import type { NextRequest } from "next/server"

// Paleta Atravessamentos
const palette = [
  { bg: "#c4623c", fg: "#f5efe1" }, // terracota
  { bg: "#7a8a55", fg: "#f5efe1" }, // verde-musgo
  { bg: "#d4a437", fg: "#1a1714" }, // amarelo-ouro
  { bg: "#1a1714", fg: "#f5efe1" }, // dark charcoal
  { bg: "#f0e6d2", fg: "#1a1714" }, // cream
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const width = Number(searchParams.get("width") ?? "800")
  const height = Number(searchParams.get("height") ?? "800")
  const query = searchParams.get("query") ?? ""
  const path = request.nextUrl.pathname

  // Pick a stable color from the palette based on the query/path
  const seed = hashString(query || path)
  const { bg, fg } = palette[seed % palette.length]
  const accent = palette[(seed + 2) % palette.length]

  // Make a few decorative organic shapes
  const cx1 = (seed % 60) + 20
  const cy1 = ((seed * 3) % 60) + 20
  const r1 = 30 + (seed % 18)

  const cx2 = ((seed * 7) % 50) + 50
  const cy2 = ((seed * 11) % 50) + 30
  const r2 = 22 + ((seed * 5) % 15)

  const label = query
    ? query
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .slice(0, 4)
        .join(" ")
    : "atravessamentos"

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
  <defs>
    <pattern id="grain-${seed}" width="3" height="3" patternUnits="userSpaceOnUse">
      <rect width="3" height="3" fill="${bg}"/>
      <circle cx="1" cy="1" r="0.5" fill="${fg}" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="${bg}"/>
  <rect width="100%" height="100%" fill="url(#grain-${seed})"/>
  <ellipse cx="${(cx1 / 100) * width}" cy="${(cy1 / 100) * height}" rx="${(r1 / 100) * width}" ry="${(r1 / 100) * width * 0.85}" fill="${accent.bg}" opacity="0.55"/>
  <ellipse cx="${(cx2 / 100) * width}" cy="${(cy2 / 100) * height}" rx="${(r2 / 100) * width}" ry="${(r2 / 100) * width * 1.1}" fill="${fg}" opacity="0.18"/>
  <g font-family="Georgia, serif" fill="${fg}" opacity="0.9">
    <text x="${width * 0.06}" y="${height * 0.92}" font-size="${Math.max(width * 0.03, 14)}" font-style="italic" font-weight="400">
      ${label}
    </text>
  </g>
</svg>`

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
