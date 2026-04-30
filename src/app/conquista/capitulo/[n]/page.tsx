import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mapaCaptulos } from "@/data/mapa-capitulos";

type Props = {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ xp?: string; streak?: string }>;
};

async function resolveConquistaData(
  params: Promise<{ n: string }>,
  searchParams: Promise<{ xp?: string; streak?: string }>
) {
  const { n } = await params;
  const { xp = "0", streak = "0" } = await searchParams;
  const numCap = parseInt(n, 10);
  const cap = mapaCaptulos[numCap];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://testpath.online";
  const ogImage = `${siteUrl}/api/og/capitulo/${n}?xp=${xp}&streak=${streak}`;
  return { n, xp, streak, numCap, cap, ogImage };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { n, xp, numCap, cap, ogImage } = await resolveConquistaData(params, searchParams);
  if (!Number.isInteger(numCap) || !cap) notFound();
  const titulo = `Concluí o Cap. ${n} — ${cap.titulo}`;

  return {
    title: `${titulo} | TestPath`,
    description: `Capítulo ${n} do CTFL v4.0 concluído. ${xp} XP acumulados. Estudando com TestPath.`,
    openGraph: {
      title: titulo,
      description: `Estudando para o CTFL v4.0 com TestPath. ${xp} XP acumulados.`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: titulo }],
      type: "website",
      siteName: "TestPath",
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      images: [ogImage],
    },
  };
}

export default async function ConquistaPage({ params, searchParams }: Props) {
  const { n, xp, numCap, cap, ogImage } = await resolveConquistaData(params, searchParams);
  if (!Number.isInteger(numCap) || !cap) notFound();

  return (
    <main
      style={{
        background: "#0b0f1a",
        minHeight: "100vh",
        color: "#e5e7eb",
        fontFamily: "sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "4rem" }}>🏆</div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "2rem", color: "#e5e7eb", margin: 0 }}>
        Capítulo {n} concluído!
      </h1>
      <p style={{ color: "#9ca3af", margin: 0, fontSize: "16px" }}>{cap.titulo}</p>
      <img
        src={ogImage}
        alt={`Card de conquista: Capítulo ${n} — ${cap.titulo}, ${xp} XP`}
        style={{ width: "100%", maxWidth: "560px", borderRadius: "12px", border: "1px solid #1f2937" }}
      />
      <a
        href="/dashboard"
        style={{
          background: "#3b82f6",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        Continuar trilha →
      </a>
    </main>
  );
}
