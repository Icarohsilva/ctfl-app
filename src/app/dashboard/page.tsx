"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Tipos
type Perfil = {
  nome: string;
  nivel: string;
  objetivo: string;
  semana_atual: number;
  pontos: number;
};

// Dados dos 6 capítulos do CTFL
const capitulos = [
  {
    num: 1,
    titulo: "Fundamentos de Teste",
    peso: "27%",
    cor: "#c9a84c",
    semanas: [1],
    topicos: ["Por que testar?", "7 princípios", "Erro / defeito / falha", "Atividades e papéis"],
  },
  {
    num: 2,
    titulo: "Ciclo de Vida de Desenvolvimento",
    peso: "17%",
    cor: "#7c9e6e",
    semanas: [2],
    topicos: ["V-Model / Ágil", "Níveis de teste", "Tipos de teste", "Regressão"],
  },
  {
    num: 3,
    titulo: "Teste Estático",
    peso: "10%",
    cor: "#6e8fa8",
    semanas: [3],
    topicos: ["Revisão informal", "Walkthrough", "Inspeção formal", "Análise estática"],
  },
  {
    num: 4,
    titulo: "Análise e Modelagem de Testes",
    peso: "25%",
    cor: "#c9a84c",
    semanas: [4, 5],
    topicos: ["Partição de equivalência", "Valor limite", "Tabela de decisão", "Transição de estado"],
  },
  {
    num: 5,
    titulo: "Gerenciamento de Testes",
    peso: "17%",
    cor: "#7c9e6e",
    semanas: [6],
    topicos: ["Plano de teste", "Estimativas", "Monitoramento", "Gestão de defeitos"],
  },
  {
    num: 6,
    titulo: "Ferramentas de Teste",
    peso: "5%",
    cor: "#6e8fa8",
    semanas: [7],
    topicos: ["Categorias", "Benefícios e riscos", "Seleção de ferramenta", "Piloto"],
  },
];

// Dados das semanas
const semanas = [
  { num: 1, cap: 1, titulo: "Fundamentos de Teste", status: "ativa" },
  { num: 2, cap: 2, titulo: "Ciclo de Vida", status: "bloqueada" },
  { num: 3, cap: 3, titulo: "Teste Estático", status: "bloqueada" },
  { num: 4, cap: 4, titulo: "Técnicas Caixa-Preta", status: "bloqueada" },
  { num: 5, cap: 4, titulo: "Técnicas Caixa-Branca", status: "bloqueada" },
  { num: 6, cap: 5, titulo: "Gerenciamento", status: "bloqueada" },
  { num: 7, cap: 6, titulo: "Ferramentas", status: "bloqueada" },
  { num: 8, cap: 0, titulo: "Simulado Final", status: "bloqueada" },
];

export default function Dashboard() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState<"trilha" | "capitulos">("trilha");

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) setPerfil(data);
    setLoading(false);
  };

  const sair = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <main style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.2rem" }}>Carregando sua trilha...</div>
      </main>
    );
  }

  const semanaAtual = perfil?.semana_atual || 1;
  const progressoGeral = Math.round(((semanaAtual - 1) / 8) * 100);

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", color: "#f0ede8", fontFamily: "sans-serif" }}>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1e1e2e", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.3rem" }}>🧪</span>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", color: "#e8d5a3" }}>TestPath</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Pontos */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1a1a0e", border: "1px solid #c9a84c44", borderRadius: "99px", padding: "6px 12px" }}>
            <span>⭐</span>
            <span style={{ color: "#c9a84c", fontWeight: "bold", fontSize: "14px" }}>{perfil?.pontos || 0} pts</span>
          </div>
          {/* Nome */}
          <span style={{ color: "#7a7a8a", fontSize: "14px" }}>Olá, {perfil?.nome?.split(" ")[0]}</span>
          <button onClick={sair} style={{ background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "6px 12px", color: "#7a7a8a", fontSize: "13px", cursor: "pointer" }}>
            Sair
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
            Sua trilha CTFL
          </h1>
          <p style={{ color: "#7a7a8a", fontSize: "14px" }}>
            Semana {semanaAtual} de 8 · {perfil?.objetivo === "8semanas" ? "Ritmo equilibrado" : perfil?.objetivo === "4semanas" ? "Intensivo" : "Ritmo livre"}
          </p>
        </div>

        {/* PROGRESSO GERAL */}
        <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "14px", color: "#a0998e" }}>Progresso geral</span>
            <span style={{ fontSize: "14px", color: "#c9a84c", fontWeight: "bold" }}>{progressoGeral}%</span>
          </div>
          <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "8px" }}>
            <div style={{ background: "linear-gradient(90deg, #c9a84c, #e8d5a3)", width: `${progressoGeral}%`, height: "8px", borderRadius: "99px", transition: "width 0.6s ease", minWidth: progressoGeral > 0 ? "8px" : "0" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "12px", color: "#3a3a4a" }}>Início</span>
            <span style={{ fontSize: "12px", color: "#3a3a4a" }}>Prova 🏆</span>
          </div>
        </div>

        {/* ABAS */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem", background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "10px", padding: "4px" }}>
          {(["trilha", "capitulos"] as const).map((aba) => (
            <button key={aba} onClick={() => setAbaSelecionada(aba)}
              style={{ flex: 1, padding: "8px", borderRadius: "7px", border: "none", background: abaSelecionada === aba ? "#1e1e2e" : "transparent", color: abaSelecionada === aba ? "#e8d5a3" : "#5a5a6a", fontSize: "14px", cursor: "pointer", fontWeight: abaSelecionada === aba ? "bold" : "normal", transition: "all 0.15s" }}>
              {aba === "trilha" ? "📅 Trilha semanal" : "📚 Capítulos"}
            </button>
          ))}
        </div>

        {/* ABA TRILHA */}
        {abaSelecionada === "trilha" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {semanas.map((s) => {
              const isAtiva = s.num === semanaAtual;
              const isConcluida = s.num < semanaAtual;
              const isBloqueada = s.num > semanaAtual;

              return (
                <div key={s.num}
                  style={{ background: isAtiva ? "#1a1a0e" : "#0f0f18", border: `1px solid ${isAtiva ? "#c9a84c" : isConcluida ? "#2e3e2e" : "#1e1e2e"}`, borderRadius: "12px", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", opacity: isBloqueada ? 0.5 : 1, transition: "all 0.2s" }}>

                  {/* Ícone de status */}
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: isConcluida ? "#2e3e2e" : isAtiva ? "#c9a84c22" : "#1e1e2e", border: `2px solid ${isConcluida ? "#4e7e4e" : isAtiva ? "#c9a84c" : "#2e2e3e"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.1rem" }}>
                    {isConcluida ? "✓" : isAtiva ? "▶" : s.num === 8 ? "🏆" : s.num.toString()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: isAtiva ? "#e8d5a3" : isConcluida ? "#6a8a6a" : "#5a5a6a" }}>
                        Semana {s.num} — {s.titulo}
                      </span>
                      {isAtiva && (
                        <span style={{ fontSize: "11px", background: "#c9a84c22", color: "#c9a84c", border: "1px solid #c9a84c44", padding: "2px 7px", borderRadius: "99px" }}>
                          Atual
                        </span>
                      )}
                      {isConcluida && (
                        <span style={{ fontSize: "11px", background: "#1e3e1e", color: "#4e9e4e", border: "1px solid #2e5e2e", padding: "2px 7px", borderRadius: "99px" }}>
                          Concluída
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "#5a5a6a" }}>
                      {s.cap > 0 ? `Capítulo ${s.cap}` : "Revisão geral"} · {isBloqueada ? "🔒 Bloqueada" : "~1h por dia, seg–sex"}
                    </div>
                  </div>

                  {isAtiva && (
                    <button
                      onClick={() => window.location.href = "/capitulo/1"}
                      style={{ background: "#c9a84c", border: "none", borderRadius: "8px", padding: "8px 16px", color: "#0a0a0f", fontSize: "13px", fontWeight: "bold", cursor: "pointer", whiteSpace: "nowrap" }}>
                      Estudar →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ABA CAPÍTULOS */}
        {abaSelecionada === "capitulos" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
            {capitulos.map((c) => {
              const desbloqueado = c.semanas.some((s) => s <= semanaAtual);
              return (
                <div key={c.num}
                  style={{ background: "#0f0f18", border: `1px solid ${desbloqueado ? "#2e2e3e" : "#1a1a1e"}`, borderRadius: "12px", padding: "1.25rem", opacity: desbloqueado ? 1 : 0.4, transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => { if (desbloqueado) (e.currentTarget as HTMLElement).style.borderColor = "#c9a84c44"; }}
                  onMouseLeave={(e) => { if (desbloqueado) (e.currentTarget as HTMLElement).style.borderColor = "#2e2e3e"; }}>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <span style={{ fontSize: "12px", color: "#5a5a6a" }}>Cap. {c.num}</span>
                    <span style={{ fontSize: "12px", background: "#1a1a0e", color: "#c9a84c", border: "1px solid #c9a84c33", padding: "2px 7px", borderRadius: "99px" }}>{c.peso}</span>
                  </div>

                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e8d5a3", marginBottom: "10px", lineHeight: 1.3 }}>{c.titulo}</div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {c.topicos.map((t, i) => (
                      <div key={i} style={{ fontSize: "12px", color: "#5a5a6a", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: desbloqueado ? "#c9a84c44" : "#2a2a2a" }}>▸</span> {t}
                      </div>
                    ))}
                  </div>

                  {desbloqueado && (
                    <button
                      onClick={() => window.location.href = "/capitulo/1"}
                      style={{ marginTop: "12px", width: "100%", background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "8px", color: "#a0998e", fontSize: "13px", cursor: "pointer" }}>
                      Praticar este capítulo
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CARD — PRÓXIMA AÇÃO */}
        <div style={{ marginTop: "2rem", background: "#0f0f18", border: "1px solid #c9a84c33", borderRadius: "12px", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "2rem" }}>📖</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e8d5a3", marginBottom: "4px" }}>
              Próxima sessão recomendada
            </div>
            <div style={{ fontSize: "13px", color: "#7a7a8a" }}>
              Semana 1 · Os 7 princípios do teste — ~1h de estudo
            </div>
          </div>
          <button
            onClick={() => window.location.href = "/capitulo/1"}
            style={{ background: "#c9a84c", border: "none", borderRadius: "8px", padding: "10px 20px", color: "#0a0a0f", fontSize: "14px", fontWeight: "bold", cursor: "pointer", whiteSpace: "nowrap" }}>
            Começar →
          </button>
        </div>

      </div>
    </main>
  );
}