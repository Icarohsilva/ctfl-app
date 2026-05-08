// src/app/inicio/playwright/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function InicioPlaywright() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [experiencia, setExperiencia] = useState<string>("");
  const [disponibilidade, setDisponibilidade] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("usuario_certificacoes")
        .select("id").eq("user_id", user.id).eq("certificacao_id", "playwright").single();
      if (data) window.location.href = "/playwright";
    })();
  }, []);

  const concluir = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("usuario_certificacoes").insert({
      user_id: user.id,
      certificacao_id: "playwright",
      status: "em_andamento",
      semana_atual: 0,
      ritmo: disponibilidade === "30min" ? "leve" : "moderado",
      pontos: 0,
      streak: 0,
      maior_streak: 0,
      data_inicio: new Date().toISOString().split("T")[0],
      data_meta: null,
    });
    window.location.href = "/playwright";
  };

  const logoGold: React.CSSProperties = {
    background: "linear-gradient(135deg, #d4af37, #f5d76e)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "sans-serif" }}>
      <a href="/cursos" style={{ display: "flex", alignItems: "center", gap: "8px",
        textDecoration: "none", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold",
          fontSize: "1.1rem", ...logoGold }}>TestPath</span>
      </a>

      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "2.5rem", width: "100%", maxWidth: "440px" }}>
        {/* Step 1 — Experiência */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: "10px", color: "#06b6d4", letterSpacing: "0.06em",
              marginBottom: "8px" }}>PASSO 1 DE 2</div>
            <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif",
              fontWeight: "normal", marginBottom: "8px" }}>Qual sua experiência com código?</h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
              Vamos personalizar o curso para o seu nível atual.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "nenhuma", label: "Nunca programei", desc: "Sou testador manual puro" },
                { id: "basico", label: "Sei o básico", desc: "Já mexi com scripts ou automação simples" },
                { id: "intermediario", label: "Programo regularmente", desc: "JavaScript/Python/outra linguagem" },
              ].map(op => (
                <button key={op.id} onClick={() => setExperiencia(op.id)}
                  style={{ background: experiencia === op.id ? "rgba(6,182,212,0.1)" : "#0d1117",
                    border: `1px solid ${experiencia === op.id ? "#06b6d4" : "#374151"}`,
                    borderRadius: "10px", padding: "12px 14px", textAlign: "left",
                    cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600",
                    color: experiencia === op.id ? "#06b6d4" : "#e5e7eb" }}>{op.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{op.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={!experiencia}
              style={{ width: "100%", background: experiencia ? "#06b6d4" : "#1f2937",
                border: "none", borderRadius: "10px", padding: "13px", color: "#000",
                fontSize: "14px", fontWeight: "700", cursor: experiencia ? "pointer" : "default",
                marginTop: "16px", transition: "background 0.15s" }}>
              Próximo →
            </button>
          </div>
        )}

        {/* Step 2 — Disponibilidade */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: "10px", color: "#06b6d4", letterSpacing: "0.06em",
              marginBottom: "8px" }}>PASSO 2 DE 2</div>
            <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif",
              fontWeight: "normal", marginBottom: "8px" }}>Quanto tempo por dia?</h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
              Cada lab leva de 10 a 20 minutos. Sem pressão.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "30min", label: "30 minutos por dia", desc: "Ritmo tranquilo, 1-2 labs por dia" },
                { id: "1hora", label: "1 hora por dia", desc: "Ritmo moderado, 3-4 labs por dia" },
              ].map(op => (
                <button key={op.id} onClick={() => setDisponibilidade(op.id)}
                  style={{ background: disponibilidade === op.id ? "rgba(6,182,212,0.1)" : "#0d1117",
                    border: `1px solid ${disponibilidade === op.id ? "#06b6d4" : "#374151"}`,
                    borderRadius: "10px", padding: "12px 14px", textAlign: "left",
                    cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600",
                    color: disponibilidade === op.id ? "#06b6d4" : "#e5e7eb" }}>{op.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{op.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button onClick={() => setStep(1)}
                style={{ flex: 1, background: "transparent", border: "1px solid #374151",
                  borderRadius: "10px", padding: "12px", color: "#9ca3af",
                  fontSize: "13px", cursor: "pointer" }}>
                ← Voltar
              </button>
              <button onClick={concluir} disabled={!disponibilidade || loading}
                style={{ flex: 2, background: disponibilidade ? "#06b6d4" : "#1f2937",
                  border: "none", borderRadius: "10px", padding: "12px", color: "#000",
                  fontSize: "14px", fontWeight: "700",
                  cursor: disponibilidade && !loading ? "pointer" : "default" }}>
                {loading ? "Criando seu curso..." : "Começar o curso →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
