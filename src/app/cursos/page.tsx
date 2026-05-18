// src/app/cursos/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { mapaModulos } from "@/data/playwright-modulos";

type CursoAtivo = {
  id: string;
  nome: string;
  emoji: string;
  cor: string;
  tipo: "certificacao" | "curso";
  rota: string;
  rotaInicio: string;
  progresso: number;
  posicaoAtual: string;
};

const TOTAL_TOPICOS_CTFL = 22;
const TOTAL_LABS_PLAYWRIGHT = 21;

export default function Cursos() {
  const [perfil, setPerfil] = useState<{ nome: string } | null>(null);
  const [cursosAtivos, setCursosAtivos] = useState<CursoAtivo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: perfilData } = await supabase
      .from("profiles").select("nome").eq("id", user.id).single();
    if (perfilData) setPerfil(perfilData);

    const { data: certs } = await supabase
      .from("usuario_certificacoes")
      .select("certificacao_id, semana_atual, status")
      .eq("user_id", user.id);

    const { data: progressoData } = await supabase
      .from("progresso_topicos")
      .select("certificacao_id, concluido")
      .eq("user_id", user.id)
      .eq("concluido", true);

    const ativos: CursoAtivo[] = [];

    if (certs?.find(c => c.certificacao_id === "ctfl")) {
      const concluidos = progressoData?.filter(p => p.certificacao_id === "ctfl").length || 0;
      const cert = certs.find(c => c.certificacao_id === "ctfl")!;
      const semana = cert.semana_atual || 1;
      const titulos = ["", "Fundamentos", "Ciclo de Vida", "Teste Estático",
        "Téc. Caixa-Preta", "Téc. Caixa-Branca", "Gerenciamento", "Ferramentas", "Simulado Final"];
      ativos.push({
        id: "ctfl", nome: "CTFL v4.0", emoji: "🎓", cor: "#d4af37",
        tipo: "certificacao", rota: "/dashboard", rotaInicio: "/inicio/ctfl",
        progresso: Math.round((concluidos / TOTAL_TOPICOS_CTFL) * 100),
        posicaoAtual: `Semana ${semana} — ${titulos[Math.min(semana, 8)] || "Simulado Final"}`,
      });
    }

    if (certs?.find(c => c.certificacao_id === "playwright")) {
      const concluidos = progressoData?.filter(p => p.certificacao_id === "playwright").length || 0;
      const cert = certs.find(c => c.certificacao_id === "playwright")!;
      const moduloAtual = cert.semana_atual || 0;
      const mod = mapaModulos[moduloAtual];
      ativos.push({
        id: "playwright", nome: "Playwright + IA", emoji: "🤖", cor: "#06b6d4",
        tipo: "curso", rota: "/playwright", rotaInicio: "/inicio/playwright",
        progresso: Math.round((concluidos / TOTAL_LABS_PLAYWRIGHT) * 100),
        posicaoAtual: `Módulo ${moduloAtual} — ${mod?.titulo || "Conclusão"}`,
      });
    }

    if (certs?.find(c => c.certificacao_id === "ingles")) {
      const { data: progData } = await supabase
        .from("ingles_progresso")
        .select("nivel_atual, licoes_concluidas")
        .eq("user_id", user.id).single();

      const cert = certs.find(c => c.certificacao_id === "ingles")!;
      const concluidos = progData?.licoes_concluidas?.length ?? 0;
      ativos.push({
        id: "ingles", nome: "English for QA", emoji: "🗣️", cor: "#22c55e",
        tipo: "curso", rota: "/ingles", rotaInicio: "/inicio/ingles",
        progresso: Math.round((concluidos / 160) * 100),
        posicaoAtual: `Nível ${progData?.nivel_atual ?? "A1"} · ${concluidos} lições`,
      });
    }

    setCursosAtivos(ativos);
    setLoading(false);
  };

  const sair = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  const logoGold: React.CSSProperties = {
    background: "linear-gradient(135deg, #d4af37, #f5d76e)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  };

  const cursosDisponiveis = [
    { id: "ctfl-at", nome: "CTFL-AT", emoji: "⚡", cor: "#10b981", desc: "Agile Tester" },
    { id: "ctal-ta", nome: "CTAL-TA", emoji: "🔬", cor: "#3b82f6", desc: "Test Analyst" },
    { id: "ctal-tm", nome: "CTAL-TM", emoji: "📋", cor: "#8b5cf6", desc: "Test Manager" },
  ];

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#06b6d4", fontFamily: "Georgia, serif" }}>Carregando seus cursos...</div>
    </main>
  );

  const primeiroNome = perfil?.nome?.split(" ")[0] || "Tester";
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <style>{`
        @media (max-width: 640px) { .padding-main { padding: 1rem !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky",
        top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", ...logoGold }}>
            TestPath
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a href="/perfil" style={{ color: "#9ca3af", fontSize: "12px", textDecoration: "none",
            border: "1px solid #374151", borderRadius: "8px", padding: "5px 10px" }}>
            {primeiroNome}
          </a>
          <button onClick={sair}
            style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px",
              padding: "5px 12px", color: "#9ca3af", fontSize: "12px", cursor: "pointer" }}>
            Sair
          </button>
        </div>
      </nav>

      <div className="padding-main" style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Saudação */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px",
            letterSpacing: "0.04em" }}>{saudacao.toUpperCase()}, {primeiroNome.toUpperCase()}</div>
          <div style={{ fontSize: "1.3rem", fontFamily: "Georgia, serif", color: "#e5e7eb" }}>
            {cursosAtivos.length === 0 ? "Escolha seu primeiro curso 🎯"
              : "Continue de onde parou 🚀"}
          </div>
        </div>

        {/* Meus cursos */}
        {cursosAtivos.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
              marginBottom: "10px" }}>MEUS CURSOS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {cursosAtivos.map(curso => (
                <div key={curso.id} onClick={() => window.location.href = curso.rota}
                  style={{ background: "#111827", border: `1px solid ${curso.cor}44`,
                    borderRadius: "14px", padding: "14px 16px", cursor: "pointer",
                    display: "flex", gap: "14px", alignItems: "center",
                    transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = curso.cor;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 4px ${curso.cor}18`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${curso.cor}44`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px",
                    background: `${curso.cor}18`, border: `1px solid ${curso.cor}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.3rem", flexShrink: 0 }}>
                    {curso.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: "5px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb" }}>
                        {curso.nome}
                      </span>
                      <span style={{ fontSize: "11px", color: curso.cor }}>{curso.progresso}%</span>
                    </div>
                    <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px",
                      marginBottom: "5px" }}>
                      <div style={{ background: curso.cor, width: `${curso.progresso}%`,
                        height: "4px", borderRadius: "99px", transition: "width 0.5s" }} />
                    </div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>{curso.posicaoAtual}</div>
                  </div>
                  <span style={{ color: curso.cor, fontSize: "1.3rem", flexShrink: 0 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Iniciar Playwright se não inscrito */}
        {!cursosAtivos.find(c => c.id === "playwright") && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
              marginBottom: "10px" }}>
              {cursosAtivos.length > 0 ? "ADICIONAR CURSO" : "COMEÇAR AGORA"}
            </div>
            <div onClick={() => window.location.href = "/inicio/playwright"}
              style={{ background: "#111827", border: "1px solid rgba(6,182,212,0.4)",
                borderRadius: "14px", padding: "16px", cursor: "pointer",
                transition: "border-color 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#06b6d4";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px rgba(6,182,212,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.4)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem", flexShrink: 0 }}>🤖</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb",
                    marginBottom: "2px" }}>Playwright + IA</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Do zero à automação com agentes de IA · 7 módulos · 21 labs
                  </div>
                </div>
                <div style={{ background: "#06b6d4", color: "#000", fontSize: "11px",
                  fontWeight: "bold", padding: "4px 10px", borderRadius: "99px" }}>
                  Iniciar
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Iniciar English for QA se não inscrito */}
        {!cursosAtivos.find(c => c.id === "ingles") && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
              marginBottom: "10px" }}>
              {cursosAtivos.length > 0 ? "ADICIONAR CURSO" : "COMEÇAR AGORA"}
            </div>
            <div onClick={() => window.location.href = "/inicio/ingles"}
              style={{ background: "#111827", border: "1px solid rgba(34,197,94,0.4)",
                borderRadius: "14px", padding: "16px", cursor: "pointer",
                transition: "border-color 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#22c55e";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px rgba(34,197,94,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,197,94,0.4)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem", flexShrink: 0 }}>🗣️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb",
                    marginBottom: "2px" }}>English for QA</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Do zero ao inglês técnico · 4 níveis · ~160 lições
                  </div>
                </div>
                <div style={{ background: "#22c55e", color: "#000", fontSize: "11px",
                  fontWeight: "bold", padding: "4px 10px", borderRadius: "99px" }}>
                  Iniciar
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Descobrir — em breve */}
        <div>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
            marginBottom: "10px" }}>EM BREVE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {cursosDisponiveis.map(c => (
              <div key={c.id}
                style={{ background: "#0d1117", border: "1px solid #1f2937",
                  borderRadius: "10px", padding: "12px", opacity: 0.5 }}>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>{c.emoji} {c.nome}</div>
                <div style={{ fontSize: "10px", color: "#374151", marginTop: "2px" }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
