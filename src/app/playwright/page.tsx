// src/app/playwright/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { mapaModulos } from "@/data/playwright-modulos";

type CertData = {
  semana_atual: number;
  pontos: number;
  streak: number;
  maior_streak: number;
  ritmo: string;
};

type ProgressoLab = { capitulo: number; topico_id: string };

const TOTAL_LABS = 21;

export default function PlaywrightDashboard() {
  const [cert, setCert] = useState<CertData | null>(null);
  const [progresso, setProgresso] = useState<ProgressoLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<{ nome: string } | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: perfilData } = await supabase
      .from("profiles").select("nome").eq("id", user.id).single();
    if (perfilData) setPerfil(perfilData);

    const { data: certData } = await supabase
      .from("usuario_certificacoes").select("*")
      .eq("user_id", user.id).eq("certificacao_id", "playwright").single();

    if (!certData) { window.location.href = "/inicio/playwright"; return; }
    setCert(certData);

    const { data: progressoData } = await supabase
      .from("progresso_topicos").select("capitulo, topico_id")
      .eq("user_id", user.id).eq("certificacao_id", "playwright").eq("concluido", true);

    if (progressoData) setProgresso(progressoData);
    setLoading(false);
  };

  const sair = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#06b6d4", fontFamily: "Georgia, serif" }}>
        Carregando seu curso...
      </div>
    </main>
  );

  const totalConcluidos = progresso.length;
  const progressoGeral = Math.round((totalConcluidos / TOTAL_LABS) * 100);
  const moduloAtual = cert?.semana_atual || 0;
  const xpTotal = cert?.pontos || 0;
  const streak = cert?.streak || 0;

  // Módulo e lab atual para card "Continuar"
  const modInfo = mapaModulos[Math.min(moduloAtual, 6)];
  const labsConcluidos = progresso.filter(p => p.capitulo === moduloAtual).length;
  const proximoLab = modInfo?.labs[labsConcluidos] || modInfo?.labs[0];
  const rotaContinuar = proximoLab
    ? `/playwright/modulo/${moduloAtual}/lab/${proximoLab.id}`
    : moduloAtual < 6 ? `/playwright/modulo/${moduloAtual + 1}` : "/playwright/projeto-final";

  const logoGold: React.CSSProperties = {
    background: "linear-gradient(135deg, #d4af37, #f5d76e)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb",
      fontFamily: "sans-serif" }}>
      <style>{`
        @media (max-width: 640px) { .padding-main { padding: 1rem !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky",
        top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold",
            fontSize: "1.1rem", ...logoGold }}>TestPath</span>
          <span style={{ fontSize: "11px", background: "rgba(6,182,212,0.08)",
            color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)",
            padding: "2px 8px", borderRadius: "99px" }}>Playwright</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "99px", padding: "5px 12px", fontSize: "13px",
            color: "#d4af37", fontWeight: "bold" }}>
            ⭐ {xpTotal} XP
          </div>
          <a href="/cursos" style={{ color: "#9ca3af", fontSize: "12px", textDecoration: "none",
            border: "1px solid #374151", borderRadius: "8px", padding: "5px 10px" }}>
            Meus cursos
          </a>
          <button onClick={sair}
            style={{ background: "transparent", border: "1px solid #374151",
              borderRadius: "8px", padding: "5px 12px", color: "#9ca3af",
              fontSize: "12px", cursor: "pointer" }}>Sair</button>
        </div>
      </nav>

      <div className="padding-main" style={{ maxWidth: "680px", margin: "0 auto", padding: "1.5rem" }}>
        {/* Stats */}
        <div className="stats-grid" style={{ display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "1.25rem" }}>
          <div style={{ background: "#111827", border: "1px solid #1f2937",
            borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px",
              letterSpacing: "0.04em" }}>PROGRESSO</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#06b6d4",
              marginBottom: "4px" }}>{progressoGeral}%</div>
            <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px" }}>
              <div style={{ background: "#06b6d4", width: `${progressoGeral}%`,
                height: "4px", borderRadius: "99px" }} />
            </div>
          </div>
          <div style={{ background: "#111827", border: "1px solid #1f2937",
            borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px",
              letterSpacing: "0.04em" }}>STREAK</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#e5e7eb",
              marginBottom: "4px" }}>🔥 {streak}</div>
            <div style={{ fontSize: "10px", color: "#6b7280" }}>
              {streak === 0 ? "Estuda hoje!" : `${streak} dia${streak > 1 ? "s" : ""} seguido${streak > 1 ? "s" : ""}`}
            </div>
          </div>
          <div style={{ background: "#111827", border: "1px solid #1f2937",
            borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px",
              letterSpacing: "0.04em" }}>LABS</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#e5e7eb",
              marginBottom: "4px" }}>{totalConcluidos}/{TOTAL_LABS}</div>
            <div style={{ fontSize: "10px", color: "#6b7280" }}>concluídos</div>
          </div>
        </div>

        {/* Card Continuar */}
        {modInfo && (
          <div onClick={() => window.location.href = rotaContinuar}
            style={{ background: "#111827", border: "1px solid rgba(6,182,212,0.4)",
              borderRadius: "14px", padding: "1rem 1.25rem", marginBottom: "1.25rem",
              display: "flex", alignItems: "center", gap: "0.875rem", cursor: "pointer",
              transition: "border-color 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "#06b6d4";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px rgba(6,182,212,0.12)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.4)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px",
              background: "rgba(6,182,212,0.12)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>▶️</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "2px",
                letterSpacing: "0.04em" }}>CONTINUAR</div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb",
                marginBottom: "1px", overflow: "hidden", textOverflow: "ellipsis",
                whiteSpace: "nowrap" }}>
                Módulo {moduloAtual} — {modInfo.titulo}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                {proximoLab ? `Lab: ${proximoLab.titulo}` : "Todos os labs concluídos"}
              </div>
            </div>
            <span style={{ color: "#06b6d4", fontSize: "1.4rem", flexShrink: 0 }}>›</span>
          </div>
        )}

        {/* Lista de módulos */}
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
          marginBottom: "10px" }}>MÓDULOS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.values(mapaModulos).map(mod => {
            const labsConcl = progresso.filter(p => p.capitulo === mod.numero).length;
            const pct = Math.round((labsConcl / mod.labs.length) * 100);
            const isAtual = mod.numero === moduloAtual;
            return (
              <div key={mod.numero}
                onClick={() => window.location.href = `/playwright/modulo/${mod.numero}`}
                style={{ background: "#111827", border: `1px solid ${isAtual ? mod.cor + "66" : "#1f2937"}`,
                  borderRadius: "12px", padding: "12px 14px", cursor: "pointer",
                  display: "flex", gap: "12px", alignItems: "center",
                  transition: "border-color 0.2s" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px",
                  background: `${mod.cor}18`, border: `1px solid ${mod.cor}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", flexShrink: 0 }}>{mod.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: isAtual ? "bold" : "normal",
                    color: "#e5e7eb", marginBottom: "3px" }}>
                    {mod.numero}. {mod.titulo}
                  </div>
                  <div style={{ background: "#1f2937", borderRadius: "99px", height: "3px" }}>
                    <div style={{ background: mod.cor, width: `${pct}%`,
                      height: "3px", borderRadius: "99px" }} />
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "#6b7280", flexShrink: 0 }}>
                  {labsConcl}/{mod.labs.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
