// src/app/ingles/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { curriculumIngles } from "@/data/ingles-curriculum";
import type { NivelCEFR, NivelMeta } from "@/data/ingles-curriculum";

type Progresso = { nivel_atual: NivelCEFR; licoes_concluidas: string[]; meta: string };

const logoGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function InglesPage() {
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [nivelData, setNivelData] = useState<NivelMeta | null>(null);
  const [xp, setXp] = useState(0);
  const [perfil, setPerfil] = useState<{ nome: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: perfilData } = await supabase
      .from("profiles").select("nome").eq("id", user.id).single();
    if (perfilData) setPerfil(perfilData);

    const { data: cert } = await supabase.from("usuario_certificacoes")
      .select("pontos").eq("user_id", user.id).eq("certificacao_id", "ingles").single();
    if (!cert) { window.location.href = "/inicio/ingles"; return; }
    setXp(cert.pontos || 0);

    const { data: prog } = await supabase.from("ingles_progresso")
      .select("nivel_atual, licoes_concluidas, meta").eq("user_id", user.id).single();
    if (!prog) { window.location.href = "/inicio/ingles"; return; }

    setProgresso(prog);
    const nivel = curriculumIngles.find(n => n.nivel === prog.nivel_atual) ?? curriculumIngles[0];
    setNivelData(nivel);
    setLoading(false);
  };

  const sair = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#22c55e", fontFamily: "Georgia, serif" }}>Carregando sua trilha...</div>
    </main>
  );

  const concluidas = new Set(progresso?.licoes_concluidas ?? []);
  const cor = nivelData?.cor ?? "#22c55e";

  // XP máximo por nível (todos os nodes × xp)
  const xpMax = nivelData?.unidades.flatMap(u => u.nodes).reduce((acc, n) => acc + n.xp, 0) ?? 500;

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky",
        top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", ...logoGold }}>
            TestPath
          </span>
          <span style={{ fontSize: "11px", background: `${cor}18`, color: cor,
            border: `1px solid ${cor}44`, padding: "2px 8px", borderRadius: "99px" }}>
            English {progresso?.nivel_atual}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a href="/ingles/revisao" style={{ color: "#9ca3af", fontSize: "12px",
            textDecoration: "none", border: "1px solid #374151", borderRadius: "8px",
            padding: "5px 10px" }}>🔁 Revisão</a>
          <a href="/cursos" style={{ color: "#9ca3af", fontSize: "12px",
            textDecoration: "none", border: "1px solid #374151", borderRadius: "8px",
            padding: "5px 10px" }}>Cursos</a>
          <button onClick={sair} style={{ background: "transparent", border: "1px solid #374151",
            borderRadius: "8px", padding: "5px 12px", color: "#9ca3af",
            fontSize: "12px", cursor: "pointer" }}>Sair</button>
        </div>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Header do nível */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "4px" }}>
            NÍVEL {progresso?.nivel_atual} — {nivelData?.titulo.toUpperCase()}
          </div>
          <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>
            {nivelData?.descricao}
          </div>
          {/* XP bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "14px" }}>⭐</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                fontSize: "10px", color: "#6b7280", marginBottom: "3px" }}>
                <span>XP do nível</span><span>{xp} / {xpMax}</span>
              </div>
              <div style={{ background: "#1f2937", borderRadius: "99px", height: "5px" }}>
                <div style={{ background: cor, width: `${Math.min((xp / xpMax) * 100, 100)}%`,
                  height: "5px", borderRadius: "99px", transition: "width 0.5s" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Trilha de nodes por unidade */}
        {nivelData?.unidades.map(unidade => {
          const todosAnterioresConcluidos = nivelData.unidades
            .slice(0, unidade.numero - 1)
            .every(u => u.nodes.every(n => concluidas.has(n.id)));
          const unidadeBloqueada = unidade.numero > 1 && !todosAnterioresConcluidos;

          return (
            <div key={unidade.numero} style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "10px", color: unidadeBloqueada ? "#374151" : "#6b7280",
                letterSpacing: "0.08em", marginBottom: "12px" }}>
                {unidade.emoji} UNIDADE {unidade.numero} — {unidade.titulo.toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                {unidade.nodes.map((node, nodeIdx) => {
                  const anterior = nodeIdx === 0
                    ? (unidade.numero === 1 || !unidadeBloqueada)
                    : concluidas.has(unidade.nodes[nodeIdx - 1].id);
                  const concluido = concluidas.has(node.id);
                  const ativo = !concluido && anterior && !unidadeBloqueada;
                  const bloqueado = !concluido && !ativo;

                  const bgNode = concluido ? cor : ativo ? cor : "#1f2937";
                  const borderNode = bloqueado ? "#374151" : cor;
                  const emoji = node.tipo === "checkpoint" ? "🏆"
                    : concluido ? "✓" : bloqueado ? "🔒" : "📝";

                  return (
                    <div key={node.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {nodeIdx > 0 && (
                        <div style={{ width: "2px", height: "16px",
                          background: concluidas.has(unidade.nodes[nodeIdx - 1].id) ? `${cor}66` : "#1f2937" }} />
                      )}
                      <div style={{ position: "relative" }}>
                        {ativo && (
                          <div style={{ position: "absolute", top: "-28px", left: "50%",
                            transform: "translateX(-50%)", background: cor, color: "#000",
                            fontSize: "9px", fontWeight: "bold", padding: "3px 8px",
                            borderRadius: "99px", whiteSpace: "nowrap" }}>
                            CONTINUAR
                          </div>
                        )}
                        <button
                          onClick={() => !bloqueado && (window.location.href = `/ingles/licao/${node.id}`)}
                          style={{
                            width: ativo ? "60px" : "52px",
                            height: ativo ? "60px" : "52px",
                            borderRadius: "50%",
                            background: bloqueado ? "#1f2937" : `${bgNode}`,
                            border: `2px solid ${borderNode}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: ativo ? "1.5rem" : "1.2rem",
                            cursor: bloqueado ? "default" : "pointer",
                            boxShadow: ativo ? `0 0 0 6px ${cor}33` : "none",
                            opacity: bloqueado ? 0.4 : 1,
                            transition: "all 0.2s",
                          }}>
                          {emoji}
                        </button>
                      </div>
                      <div style={{ fontSize: "10px", color: bloqueado ? "#374151" : "#6b7280",
                        marginTop: "4px", marginBottom: "4px", textAlign: "center", maxWidth: "100px" }}>
                        {node.titulo}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
