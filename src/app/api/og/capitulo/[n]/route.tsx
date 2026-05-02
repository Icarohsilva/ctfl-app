import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { mapaCaptulos } from "@/data/mapa-capitulos";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ n: string }> }
) {
  const { n } = await params;
  const numCap = parseInt(n, 10);
  const cap = mapaCaptulos[numCap];
  if (!cap) return new Response("Not found", { status: 404 });

  const { searchParams } = request.nextUrl;
  const xp = searchParams.get("xp") || "0";
  const streak = parseInt(searchParams.get("streak") || "0", 10);
  const totalCaps = Object.keys(mapaCaptulos).length;
  const progressoPct = Math.round((numCap / totalCaps) * 100);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0b0f1a",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "sans-serif",
          border: "2px solid #1f2937",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "56px" }}>
          <span style={{ fontSize: "34px", fontWeight: "bold", color: "#d4af37" }}>TestPath</span>
          <span style={{ fontSize: "18px", background: "rgba(212,175,55,0.12)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.4)", padding: "6px 18px", borderRadius: "99px" }}>
            CTFL v4.0
          </span>
        </div>

        {/* Conteúdo */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: "22px", color: "#6b7280", marginBottom: "14px" }}>
            {`Concluí o Capítulo ${n}`}
          </div>
          <div style={{ display: "flex", fontSize: "50px", fontWeight: "bold", color: "#f9fafb", lineHeight: 1.15, marginBottom: "44px" }}>
            {cap.titulo}
          </div>

          {/* Barra de progresso */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "44px" }}>
            <div style={{ display: "flex", flex: 1, height: "12px", background: "#1f2937", borderRadius: "99px" }}>
              <div style={{ display: "flex", width: `${progressoPct}%`, height: "12px", background: "#3b82f6", borderRadius: "99px" }} />
            </div>
            <span style={{ display: "flex", fontSize: "20px", color: "#9ca3af" }}>
              {`${n} / ${totalCaps} caps`}
            </span>
          </div>

          {/* XP e streak */}
          <div style={{ display: "flex", gap: "28px" }}>
            <span style={{ display: "flex", fontSize: "24px", color: "#d4af37" }}>
              {`⭐ ${xp} XP`}
            </span>
            {streak > 0 && (
              <span style={{ display: "flex", fontSize: "24px", color: "#d4af37" }}>
                {`🔥 ${streak} dia${streak > 1 ? "s" : ""} seguido${streak > 1 ? "s" : ""}`}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ display: "flex", fontSize: "20px", color: "#374151" }}>testpath.online</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      emoji: "twemoji",
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
