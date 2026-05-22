"use client";
import { useState } from "react";
import type { QuizPergunta } from "@/data/guia/types";

type Props = {
  perguntas: QuizPergunta[];
  slugArtigo: string;
};

export default function QuizArtigo({ perguntas, slugArtigo }: Props) {
  const [atual, setAtual] = useState(0);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const pergunta = perguntas[atual];

  const confirmar = () => {
    if (selecionada === null) return;
    setConfirmada(true);
    if (selecionada === pergunta.correta) setAcertos(a => a + 1);
  };

  const avancar = () => {
    if (atual + 1 >= perguntas.length) {
      setFinalizado(true);
    } else {
      setAtual(a => a + 1);
      setSelecionada(null);
      setConfirmada(false);
    }
  };

  if (finalizado) {
    const pct = Math.round((acertos / perguntas.length) * 100);
    return (
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          {pct >= 80 ? "🏆" : pct >= 60 ? "📚" : "💪"}
        </div>
        <h3 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
          {acertos} de {perguntas.length} corretas ({pct}%)
        </h3>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.5rem" }}>
          {pct >= 80 ? "Excelente! Você domina esse conteúdo." : pct >= 60 ? "Bom resultado! Revise os pontos que errou." : "Continue estudando — você vai chegar lá!"}
        </p>
        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "#e5e7eb", fontSize: "14px", marginBottom: "0.75rem", fontWeight: 600 }}>
            Quer mais questões sobre esse tópico?
          </p>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "1rem" }}>
            Na plataforma você tem simulados completos com IA, fila de revisão adaptativa e progresso salvo.
          </p>
          <a href="/cadastro" style={{ display: "inline-block", background: "#3b82f6", color: "#fff", padding: "10px 24px", borderRadius: "8px", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
            Criar conta grátis →
          </a>
        </div>
        <button onClick={() => { setAtual(0); setSelecionada(null); setConfirmada(false); setAcertos(0); setFinalizado(false); }}
          style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "8px 20px", color: "#9ca3af", fontSize: "13px", cursor: "pointer" }}>
          Refazer quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "12px", color: "#6b7280", letterSpacing: "0.05em" }}>MINI-QUIZ</span>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>{atual + 1} / {perguntas.length}</span>
      </div>
      <p style={{ color: "#e5e7eb", fontSize: "15px", lineHeight: 1.6, marginBottom: "1.25rem", fontWeight: 500 }}>
        {pergunta.pergunta}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
        {pergunta.opcoes.map((opcao, i) => {
          let bg = "#0b0f1a";
          let border = "#374151";
          let color = "#9ca3af";
          if (selecionada === i && !confirmada) { bg = "rgba(59,130,246,0.08)"; border = "#3b82f6"; color = "#3b82f6"; }
          if (confirmada && i === pergunta.correta) { bg = "rgba(16,185,129,0.08)"; border = "#10b981"; color = "#10b981"; }
          if (confirmada && selecionada === i && i !== pergunta.correta) { bg = "rgba(239,68,68,0.08)"; border = "#ef4444"; color = "#ef4444"; }
          return (
            <button key={i} onClick={() => !confirmada && setSelecionada(i)}
              style={{ background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px", color, fontSize: "14px", cursor: confirmada ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}>
              {opcao}
            </button>
          );
        })}
      </div>
      {confirmada && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: "8px", padding: "12px", marginBottom: "1rem" }}>
          <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>
            💡 {pergunta.explicacao}
          </p>
        </div>
      )}
      {!confirmada ? (
        <button onClick={confirmar} disabled={selecionada === null}
          style={{ background: selecionada !== null ? "#3b82f6" : "#1f2937", border: "none", borderRadius: "8px", padding: "10px 24px", color: selecionada !== null ? "#fff" : "#6b7280", fontSize: "14px", fontWeight: 600, cursor: selecionada !== null ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
          Confirmar
        </button>
      ) : (
        <button onClick={avancar}
          style={{ background: "#3b82f6", border: "none", borderRadius: "8px", padding: "10px 24px", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          {atual + 1 >= perguntas.length ? "Ver resultado" : "Próxima pergunta →"}
        </button>
      )}
    </div>
  );
}
