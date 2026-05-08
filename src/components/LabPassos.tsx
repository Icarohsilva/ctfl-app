// src/components/LabPassos.tsx
"use client";
import { useState } from "react";
import type { LabConteudo } from "@/data/playwright-labs";

type Props = {
  lab: LabConteudo;
  onConcluido: (xp: number) => void;
  xp: number;
};

export default function LabPassos({ lab, onConcluido, xp }: Props) {
  const [passo, setPasso] = useState(1);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null);
  const [respondeu, setRespondeu] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(lab.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const responder = (idx: number) => {
    if (respondeu) return;
    setOpcaoSelecionada(idx);
    setRespondeu(true);
  };

  const concluir = () => onConcluido(xp);

  const corPasso = "#06b6d4";

  return (
    <div>
      {/* Barra de progresso dos 4 passos */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
        {[1, 2, 3, 4].map(n => (
          <div key={n} style={{ flex: 1, height: "3px", borderRadius: "99px",
            background: n <= passo ? corPasso : "#1f2937", transition: "background 0.3s" }} />
        ))}
      </div>

      {/* PASSO 1 — CONCEITO */}
      {passo === 1 && (
        <div>
          <div style={{ fontSize: "10px", color: corPasso, fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "12px" }}>📖 PASSO 1 — CONCEITO</div>
          <div style={{ background: "#111827", border: `1px solid ${corPasso}44`,
            borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", color: "#d1d5db", lineHeight: 1.8,
              margin: 0, whiteSpace: "pre-line" }}>{lab.conceito}</p>
          </div>
          <button onClick={() => setPasso(2)}
            style={{ width: "100%", background: corPasso, border: "none",
              borderRadius: "10px", padding: "13px", color: "#000",
              fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Próximo: ver o código →
          </button>
        </div>
      )}

      {/* PASSO 2 — CÓDIGO */}
      {passo === 2 && (
        <div>
          <div style={{ fontSize: "10px", color: corPasso, fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "12px" }}>💻 PASSO 2 — CÓDIGO</div>
          <div style={{ background: "#0d1117", border: "1px solid #374151",
            borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "10px 16px",
              borderBottom: "1px solid #1f2937" }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>TypeScript</span>
              <button onClick={copiar}
                style={{ background: "transparent", border: "1px solid #374151",
                  borderRadius: "6px", padding: "4px 10px", color: "#9ca3af",
                  fontSize: "11px", cursor: "pointer" }}>
                {copiado ? "✓ Copiado!" : "Copiar"}
              </button>
            </div>
            <pre style={{ margin: 0, padding: "16px", overflowX: "auto",
              fontSize: "12px", color: "#e5e7eb", lineHeight: 1.7 }}>
              <code>{lab.codigo}</code>
            </pre>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setPasso(1)}
              style={{ flex: 1, background: "transparent", border: "1px solid #374151",
                borderRadius: "10px", padding: "12px", color: "#9ca3af",
                fontSize: "13px", cursor: "pointer" }}>
              ← Voltar
            </button>
            <button onClick={() => setPasso(3)}
              style={{ flex: 2, background: corPasso, border: "none",
                borderRadius: "10px", padding: "12px", color: "#000",
                fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              Próximo: executar →
            </button>
          </div>
        </div>
      )}

      {/* PASSO 3 — EXECUTE */}
      {passo === 3 && (
        <div>
          <div style={{ fontSize: "10px", color: corPasso, fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "12px" }}>🏃 PASSO 3 — EXECUTE</div>
          <div style={{ background: "#111827", border: `1px solid ${corPasso}44`,
            borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#d1d5db", lineHeight: 1.8,
              margin: 0, whiteSpace: "pre-line", fontFamily: "monospace" }}>
              {lab.instrucaoExecucao}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setPasso(2)}
              style={{ flex: 1, background: "transparent", border: "1px solid #374151",
                borderRadius: "10px", padding: "12px", color: "#9ca3af",
                fontSize: "13px", cursor: "pointer" }}>
              ← Voltar
            </button>
            <button onClick={() => setPasso(4)}
              style={{ flex: 2, background: corPasso, border: "none",
                borderRadius: "10px", padding: "12px", color: "#000",
                fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              Próximo: reflexão →
            </button>
          </div>
        </div>
      )}

      {/* PASSO 4 — REFLEXÃO */}
      {passo === 4 && (
        <div>
          <div style={{ fontSize: "10px", color: corPasso, fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "12px" }}>💡 PASSO 4 — REFLEXÃO</div>
          <div style={{ background: "#111827", border: `1px solid ${corPasso}44`,
            borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", color: "#e5e7eb", fontWeight: "600",
              marginBottom: "16px" }}>{lab.reflexao.pergunta}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {lab.reflexao.opcoes.map((opcao, i) => {
                const acertou = respondeu && i === lab.reflexao.correta;
                const errou = respondeu && i === opcaoSelecionada && i !== lab.reflexao.correta;
                return (
                  <button key={i} onClick={() => responder(i)} disabled={respondeu}
                    style={{ background: acertou ? "rgba(34,197,94,0.12)"
                      : errou ? "rgba(239,68,68,0.12)" : "#0d1117",
                      border: `1px solid ${acertou ? "#22c55e" : errou ? "#ef4444" : "#374151"}`,
                      borderRadius: "8px", padding: "12px 14px", color: "#e5e7eb",
                      fontSize: "13px", textAlign: "left", cursor: respondeu ? "default" : "pointer",
                      transition: "all 0.15s" }}>
                    {acertou ? "✅ " : errou ? "❌ " : ""}{opcao}
                  </button>
                );
              })}
            </div>
            {respondeu && (
              <div style={{ marginTop: "16px", padding: "12px",
                background: "rgba(6,182,212,0.08)", border: "1px solid #06b6d444",
                borderRadius: "8px", fontSize: "13px", color: "#9ca3af",
                lineHeight: 1.7 }}>
                {lab.reflexao.explicacao}
              </div>
            )}
          </div>
          <button onClick={() => setPasso(3)}
            style={{ background: "transparent", border: "1px solid #374151",
              borderRadius: "10px", padding: "10px 16px", color: "#9ca3af",
              fontSize: "13px", cursor: "pointer", marginBottom: "8px" }}>
            ← Voltar
          </button>
          {respondeu && (
            <button onClick={concluir}
              style={{ width: "100%", background: "#22c55e", border: "none",
                borderRadius: "10px", padding: "14px", color: "#000",
                fontSize: "15px", fontWeight: "700", cursor: "pointer",
                display: "block", boxShadow: "0 0 0 1px rgba(34,197,94,0.4), 0 8px 20px rgba(34,197,94,0.2)" }}>
              ✅ Concluir lab (+{xp} XP)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
