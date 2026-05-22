import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import { artigosPorSecao } from "@/data/guia/index";
import type { ArtigoMeta } from "@/data/guia/types";

export const metadata: Metadata = {
  title: "Guia de Estudos — TestPath",
  description: "Guias completos sobre CTFL v4.0, Playwright e Inglês para QA. Artigos detalhados com vídeos e quiz para se preparar para certificações de qualidade de software.",
  openGraph: {
    title: "Guia de Estudos — TestPath",
    description: "Guias completos sobre CTFL v4.0, Playwright e Inglês para QA.",
    url: "https://www.testpath.online/guia",
    type: "website",
  },
};

const nivelCor: Record<string, string> = {
  "iniciante": "#10b981",
  "intermediário": "#3b82f6",
  "avançado": "#8b5cf6",
};

function CardArtigo({ artigo }: { artigo: ArtigoMeta }) {
  return (
    <a href={`/guia/${artigo.slug}`} className="guia-card"
      style={{ display: "block", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1.25rem", textDecoration: "none", transition: "border-color 0.15s, transform 0.15s" }}>
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#e5e7eb", lineHeight: 1.4, margin: "0 0 0.5rem" }}>{artigo.titulo}</h3>
      <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.5, margin: "0 0 0.75rem" }}>{artigo.descricao}</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", color: nivelCor[artigo.nivel], background: `${nivelCor[artigo.nivel]}18`, padding: "2px 8px", borderRadius: "99px" }}>
          {artigo.nivel.charAt(0).toUpperCase() + artigo.nivel.slice(1)}
        </span>
        <span style={{ fontSize: "11px", color: "#6b7280" }}>📖 {artigo.tempoLeitura} min</span>
      </div>
    </a>
  );
}

const secoes = [
  { id: "ctfl" as const, titulo: "CTFL v4.0 — Certified Tester Foundation Level", emoji: "🎓", cor: "#d4af37", desc: "Prepare-se para a certificação mais importante de QA do ISTQB. 9 guias cobrindo todos os 6 capítulos do syllabus v4.0." },
  { id: "playwright" as const, titulo: "Playwright — Automação de Testes Web", emoji: "🤖", cor: "#06b6d4", desc: "Do zero à automação profissional com Playwright. Locators, POM, CI/CD e boas práticas." },
  { id: "ingles" as const, titulo: "English for QA — Inglês Técnico", emoji: "🗣️", cor: "#22c55e", desc: "O inglês técnico essencial para a carreira em QA. Bug reports, vocabulário, reuniões e entrevistas em inglês." },
];

export default function GuiaPage() {
  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <style>{`.guia-card:hover { border-color: #374151 !important; transform: translateY(-2px) !important; }`}</style>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky", top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", background: "linear-gradient(135deg, #d4af37, #f5d76e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>TestPath</span>
        </a>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="/guia" style={{ color: "#d4af37", fontSize: "14px", textDecoration: "none", fontWeight: 600 }}>Guia</a>
          <a href="/login" style={{ color: "#9ca3af", fontSize: "14px", textDecoration: "none" }}>Entrar</a>
          <a href="/cadastro" style={{ background: "#3b82f6", color: "#fff", padding: "7px 16px", borderRadius: "8px", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>Começar grátis</a>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.2rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.75rem" }}>
            Guia de Estudos TestPath
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "15px", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto" }}>
            Artigos completos, vídeos e quizzes para se preparar para certificações de QA. Conteúdo gratuito, sem login.
          </p>
        </div>

        {secoes.map(secao => {
          const artigos = artigosPorSecao[secao.id];
          return (
            <section key={secao.id} style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{secao.emoji}</span>
                <h2 style={{ fontSize: "1.15rem", color: secao.cor, fontWeight: 600, margin: 0 }}>{secao.titulo}</h2>
              </div>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "1.25rem", marginLeft: "2px" }}>{secao.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
                {artigos.map(a => <CardArtigo key={a.slug} artigo={a} />)}
              </div>
            </section>
          );
        })}

        <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || ""} format="horizontal" style={{ marginBottom: "2rem" }} />

        <div style={{ textAlign: "center", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "16px", padding: "2rem" }}>
          <p style={{ color: "#e5e7eb", fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Pronto para praticar com simulados?
          </p>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.25rem" }}>
            Na plataforma você tem simulados gerados por IA, fila de revisão adaptativa e progresso salvo.
          </p>
          <a href="/cadastro" style={{ display: "inline-block", background: "#3b82f6", color: "#fff", padding: "11px 28px", borderRadius: "10px", fontWeight: 600, fontSize: "15px", textDecoration: "none" }}>
            Criar conta grátis →
          </a>
        </div>
      </div>
    </main>
  );
}
