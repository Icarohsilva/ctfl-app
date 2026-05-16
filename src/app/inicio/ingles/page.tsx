// src/app/inicio/ingles/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { bancoNivelamento } from "@/data/ingles-nivelamento";
import type { NivelCEFR, MetaIngles } from "@/data/ingles-curriculum";
import type { QuestaoNivelamento } from "@/data/ingles-nivelamento";

type EstadoNivelamento = {
  score: number;
  nivel_corrente: NivelCEFR;
  usados: string[];
};

const COR_NIVEL: Record<NivelCEFR, string> = {
  A1: "#22c55e", A2: "#3b82f6", B1: "#8b5cf6", B2: "#f97316",
};

const DESC_NIVEL: Record<NivelCEFR, string> = {
  A1: "Você está começando do zero. Perfeito — vamos construir uma base sólida com vocabulário essencial de QA.",
  A2: "Você já tem uma base. Vamos trabalhar bug reports, sprint vocabulary e expressões para reuniões.",
  B1: "Bom nível! Vamos focar em entrevistas técnicas, code reviews e comunicação avançada com stakeholders.",
  B2: "Nível avançado! Vamos trabalhar liderança, apresentações e negociação em inglês.",
};

const logoGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function InicioIngles() {
  const [step, setStep] = useState<"meta" | "teste" | "resultado">("meta");
  const [meta, setMeta] = useState<MetaIngles | "">("");
  const [questaoAtual, setQuestaoAtual] = useState<QuestaoNivelamento | null>(null);
  const [estado, setEstado] = useState<EstadoNivelamento>({
    score: 0, nivel_corrente: "A2", usados: [],
  });
  const [questaoIdx, setQuestaoIdx] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [nivelFinal, setNivelFinal] = useState<NivelCEFR | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("usuario_certificacoes")
        .select("id").eq("user_id", user.id).eq("certificacao_id", "ingles").single();
      if (data) window.location.href = "/ingles";
    })();
  }, []);

  const iniciarTeste = () => {
    // Primeira questão — começa em A2
    const primeira = bancoNivelamento.find(q => q.nivel === "A2");
    if (!primeira) return;
    setQuestaoAtual(primeira);
    setEstado({ score: 0, nivel_corrente: "A2", usados: [primeira.id] });
    setStep("teste");
  };

  const responder = async (idx: number) => {
    if (respostaSelecionada !== null) return;
    setRespostaSelecionada(idx);
    setMostrarFeedback(true);
  };

  const avancar = async () => {
    if (!questaoAtual) return;
    const acertou = respostaSelecionada === questaoAtual.correta;

    const res = await fetch("/api/ingles/nivelamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questao_idx: questaoIdx, acertou, estado }),
    });
    const data = await res.json();

    if (data.fim) {
      setNivelFinal(data.nivel);
      setStep("resultado");
    } else {
      setQuestaoAtual(data.questao);
      setEstado(data.estado);
      setQuestaoIdx(q => q + 1);
      setRespostaSelecionada(null);
      setMostrarFeedback(false);
    }
  };

  const concluir = async () => {
    if (!nivelFinal) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("usuario_certificacoes").insert({
      user_id: user.id,
      certificacao_id: "ingles",
      status: "em_andamento",
      semana_atual: 0,
      pontos: 0,
      streak: 0,
      maior_streak: 0,
      data_inicio: new Date().toISOString().split("T")[0],
      data_meta: null,
    });

    await supabase.from("ingles_progresso").upsert({
      user_id: user.id,
      nivel_atual: nivelFinal,
      meta: meta || "docs",
      licoes_concluidas: [],
    });

    window.location.href = "/ingles";
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "sans-serif" }}>

      <a href="/cursos" style={{ display: "flex", alignItems: "center", gap: "8px",
        textDecoration: "none", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", ...logoGold }}>
          TestPath
        </span>
      </a>

      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "2.5rem", width: "100%", maxWidth: "480px" }}>

        {/* STEP: META */}
        {step === "meta" && (
          <div>
            <div style={{ fontSize: "10px", color: "#22c55e", letterSpacing: "0.06em", marginBottom: "8px" }}>
              ENGLISH FOR QA
            </div>
            <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif",
              fontWeight: "normal", marginBottom: "8px" }}>
              Qual é o seu objetivo com inglês?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
              Vamos personalizar o curso para o que você mais precisa.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {([
                { id: "docs", label: "Ler documentação técnica", desc: "Entender docs, RFCs, changelogs e API docs em inglês" },
                { id: "calls", label: "Participar de calls e reuniões", desc: "Stand-ups, sprints, demos e reuniões com times internacionais" },
                { id: "entrevistas", label: "Passar em entrevistas", desc: "Entrevistas técnicas em inglês para empresas globais" },
              ] as { id: MetaIngles; label: string; desc: string }[]).map(op => (
                <button key={op.id} onClick={() => setMeta(op.id)}
                  style={{ background: meta === op.id ? "rgba(34,197,94,0.1)" : "#0d1117",
                    border: `1px solid ${meta === op.id ? "#22c55e" : "#374151"}`,
                    borderRadius: "10px", padding: "12px 14px", textAlign: "left",
                    cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600",
                    color: meta === op.id ? "#22c55e" : "#e5e7eb" }}>{op.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{op.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={iniciarTeste} disabled={!meta}
              style={{ width: "100%", background: meta ? "#22c55e" : "#1f2937",
                border: "none", borderRadius: "10px", padding: "13px",
                color: meta ? "#000" : "#6b7280", fontSize: "14px", fontWeight: "700",
                cursor: meta ? "pointer" : "default", transition: "background 0.15s" }}>
              Fazer teste de nivelamento →
            </button>
          </div>
        )}

        {/* STEP: TESTE */}
        {step === "teste" && questaoAtual && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.06em" }}>
                QUESTÃO {questaoIdx + 1} DE 10
              </div>
              <div style={{ fontSize: "10px", color: "#22c55e" }}>
                Nível detectado: {estado.nivel_corrente}
              </div>
            </div>
            <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px", marginBottom: "20px" }}>
              <div style={{ background: "#22c55e", width: `${(questaoIdx / 10) * 100}%`,
                height: "4px", borderRadius: "99px", transition: "width 0.3s" }} />
            </div>
            <p style={{ color: "#e5e7eb", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
              {questaoAtual.pergunta}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {questaoAtual.opcoes.map((opcao, i) => {
                let bg = "#0d1117"; let border = "#374151"; let cor = "#e5e7eb";
                if (mostrarFeedback) {
                  if (i === questaoAtual.correta) { bg = "rgba(34,197,94,0.1)"; border = "#22c55e"; cor = "#22c55e"; }
                  else if (i === respostaSelecionada) { bg = "rgba(239,68,68,0.1)"; border = "#ef4444"; cor = "#ef4444"; }
                } else if (i === respostaSelecionada) {
                  bg = "rgba(34,197,94,0.1)"; border = "#22c55e"; cor = "#22c55e";
                }
                return (
                  <button key={i} onClick={() => responder(i)}
                    style={{ background: bg, border: `1px solid ${border}`, borderRadius: "10px",
                      padding: "11px 14px", textAlign: "left", cursor: "pointer",
                      fontSize: "13px", color: cor, transition: "all 0.15s" }}>
                    {opcao}
                  </button>
                );
              })}
            </div>
            {mostrarFeedback && (
              <button onClick={avancar}
                style={{ width: "100%", background: "#22c55e", border: "none",
                  borderRadius: "10px", padding: "12px", color: "#000",
                  fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                {questaoIdx >= 9 ? "Ver meu nível →" : "Próxima →"}
              </button>
            )}
          </div>
        )}

        {/* STEP: RESULTADO */}
        {step === "resultado" && nivelFinal && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
            <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.1em", marginBottom: "8px" }}>
              SEU NÍVEL
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", fontFamily: "Georgia, serif",
              color: COR_NIVEL[nivelFinal], marginBottom: "16px" }}>
              {nivelFinal}
            </div>
            <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.7", marginBottom: "24px" }}>
              {DESC_NIVEL[nivelFinal]}
            </p>
            <button onClick={concluir} disabled={loading}
              style={{ width: "100%", background: COR_NIVEL[nivelFinal], border: "none",
                borderRadius: "10px", padding: "13px", color: "#000",
                fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {loading ? "Criando sua trilha..." : `Começar trilha ${nivelFinal} →`}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
