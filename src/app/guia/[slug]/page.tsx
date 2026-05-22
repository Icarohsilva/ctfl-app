import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import QuizArtigo from "@/components/guia/QuizArtigo";
import VideoEmbed from "@/components/guia/VideoEmbed";
import NavArtigo from "@/components/guia/NavArtigo";
import { artigos } from "@/data/guia/index";
import type { ArtigoGuia } from "@/data/guia/types";

async function getArtigo(slug: string): Promise<ArtigoGuia | null> {
  try {
    const mod = await import(`@/data/guia/${slug}`);
    return mod.artigo;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return artigos.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artigo = await getArtigo(slug);
  if (!artigo) return { title: "Artigo não encontrado — TestPath" };
  return {
    title: `${artigo.titulo} — TestPath Guia`,
    description: artigo.descricao,
    openGraph: {
      title: artigo.titulo,
      description: artigo.descricao,
      url: `https://www.testpath.online/guia/${artigo.slug}`,
      type: "article",
    },
  };
}

const secaoNome: Record<string, string> = {
  ctfl: "CTFL v4.0",
  playwright: "Playwright",
  ingles: "English for QA",
};

export default async function ArtigoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artigo = await getArtigo(slug);
  if (!artigo) notFound();

  const idx = artigos.findIndex(a => a.slug === slug);
  const anterior = idx > 0 ? artigos[idx - 1] : null;
  const proximo = idx < artigos.length - 1 ? artigos[idx + 1] : null;

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky", top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", background: "linear-gradient(135deg, #d4af37, #f5d76e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>TestPath</span>
        </a>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="/guia" style={{ color: "#9ca3af", fontSize: "14px", textDecoration: "none" }}>← Guia</a>
          <a href="/login" style={{ color: "#9ca3af", fontSize: "14px", textDecoration: "none" }}>Entrar</a>
          <a href="/cadastro" style={{ background: "#3b82f6", color: "#fff", padding: "7px 16px", borderRadius: "8px", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>Começar grátis</a>
        </div>
      </nav>

      <article style={{ maxWidth: "760px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
        <nav aria-label="breadcrumb" style={{ marginBottom: "1.5rem", fontSize: "12px", color: "#6b7280" }}>
          <a href="/guia" style={{ color: "#6b7280", textDecoration: "none" }}>Guia</a>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#9ca3af" }}>{secaoNome[artigo.secao]}</span>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#e5e7eb" }}>{artigo.titulo}</span>
        </nav>

        <header style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "1.9rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", lineHeight: 1.3, marginBottom: "1rem" }}>
            {artigo.titulo}
          </h1>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "13px", color: "#6b7280" }}>
            <span>📖 {artigo.tempoLeitura} min de leitura</span>
            <span>📚 {secaoNome[artigo.secao]}</span>
            <span>🎯 {artigo.nivel.charAt(0).toUpperCase() + artigo.nivel.slice(1)}</span>
          </div>
        </header>

        {artigo.secoes.map((secao, i) => (
          <section key={i} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", color: "#d4af37", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "1rem", borderBottom: "1px solid #1f2937", paddingBottom: "0.5rem" }}>
              {secao.titulo}
            </h2>
            <div
              style={{ color: "#9ca3af", fontSize: "15px", lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: secao.conteudo }}
            />
            {secao.videoId && (
              <VideoEmbed videoId={secao.videoId} titulo={secao.titulo} />
            )}
          </section>
        ))}

        <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || ""} format="horizontal" style={{ marginBottom: "2rem" }} />

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", color: "#e5e7eb", fontWeight: 600, marginBottom: "1rem" }}>
            🧠 Teste seus conhecimentos
          </h2>
          <QuizArtigo perguntas={artigo.quiz} slugArtigo={artigo.slug} />
        </section>

        <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || ""} format="rectangle" style={{ marginBottom: "2rem" }} />

        <NavArtigo anterior={anterior} proximo={proximo} />
      </article>
    </main>
  );
}
