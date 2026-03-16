import { getSummary } from "@/lib/status";

const COLORS: Record<string, string> = {
  Operational: "#1f7a3f",
  "Degraded Performance": "#8a6700",
  "Partial Outage": "#9f4b00",
  "Major Outage": "#b42318",
  Maintenance: "#475467"
};

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function GET() {
  const summary = await getSummary();
  const label = "keel";
  const message = summary.overallStatus;
  const width = 88 + message.length * 7;
  const labelWidth = 46;
  const color = COLORS[message] ?? COLORS.Operational;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${esc(label)}: ${esc(message)}">
      <linearGradient id="g" x2="0" y2="100%">
        <stop offset="0" stop-color="#fff" stop-opacity=".08"/>
        <stop offset="1" stop-opacity=".08"/>
      </linearGradient>
      <rect width="${labelWidth}" height="20" fill="#111827"/>
      <rect x="${labelWidth}" width="${width - labelWidth}" height="20" fill="${color}"/>
      <rect width="${width}" height="20" fill="url(#g)"/>
      <g fill="#fff" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11">
        <text x="23" y="14">${esc(label)}</text>
        <text x="${labelWidth + (width - labelWidth) / 2}" y="14">${esc(message)}</text>
      </g>
    </svg>
  `.trim();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300"
    }
  });
}
