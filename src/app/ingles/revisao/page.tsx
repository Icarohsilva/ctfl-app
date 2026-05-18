// src/app/ingles/revisao/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type ItemRevisao = {
  id: string;
  item: string;
  tipo: string;
  tentativas: number;
  acertos: number;
};

const logoGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function RevisaoPage() {
  const [itens, setItens] = useState<ItemRevisao[]>([]);
  const [idxAtual, setIdxAtual] = useState(0);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [concluida, setConcluida] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("ingles_revisao")
        .select("*").eq("user_id", user.id)
        .lte("proxima_revisao", new Date().toISOString())
        .order("tentativas", { ascending: false }).limit(10);
      setItens(data ?? []);
      setLoading(false);
    })();
  }, []);

  const itemAtual = itens[idxAtual];

  const marcarAcerto = async () => {
    await supabase.from("ingles_revisao").update({
      acertos: itemAtual.acertos + 1,
      proxima_revisao: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    }).eq("id", itemAtual.id);
    avancar();
  };

  const marcarErro = async () => {
    await supabase.from("ingles_revisao").update({
      tentativas: itemAtual.tentativas + 1,
      proxima_revisao: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }).eq("id", itemAtual.id);
    avancar();
  };

  const avancar = () => {
    if (idxAtual >= itens.length - 1) { setConcluida(true); return; }
    setIdxAtual(i => i + 1);
    setMostrarResposta(false);
  };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#22c55e", fontFamily: "Georgia, serif" }}>Carregando revisão...</div>
    </main>
  );

  if (concluida || itens.length === 0) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "2.5rem", width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>✅</div>
        <h2 style={{ color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "8px" }}>
          {itens.length === 0 ? "Nenhum item para revisar agora!" : "Revisão concluída!"}
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
          {itens.length === 0 ? "Continue praticando para acumular itens aqui." : `${itens.length} itens revisados.`}
        </p>
        <a href="/ingles" style={{ display: "block", background: "#22c55e", borderRadius: "10px",
          padding: "13px", color: "#000", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
          Voltar à trilha →
        </a>
      </div>
    </main>
  );

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937" }}>
        <a href="/ingles" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="" style={{ width: "22px", height: "22px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1rem", ...logoGold }}>TestPath</span>
        </a>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>🔁 Revisão · {idxAtual + 1}/{itens.length}</div>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px", marginBottom: "24px" }}>
          <div style={{ background: "#22c55e", width: `${((idxAtual) / itens.length) * 100}%`,
            height: "4px", borderRadius: "99px", transition: "width 0.3s" }} />
        </div>

        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.5rem" }}>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>
            REVISÃO — {itemAtual.tipo.toUpperCase()} · {itemAtual.tentativas} tentativas
          </div>
          <p style={{ color: "#e5e7eb", fontSize: "15px", lineHeight: "1.6", marginBottom: "20px" }}>
            {itemAtual.item}
          </p>

          {!mostrarResposta ? (
            <button onClick={() => setMostrarResposta(true)}
              style={{ width: "100%", background: "#22c55e", border: "none", borderRadius: "10px",
                padding: "12px", color: "#000", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
              Ver resposta / praticar
            </button>
          ) : (
            <div>
              <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "16px" }}>
                Você conseguiu usar esta frase corretamente?
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={marcarErro}
                  style={{ flex: 1, background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444",
                    borderRadius: "10px", padding: "11px", color: "#ef4444",
                    fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                  ❌ Ainda não
                </button>
                <button onClick={marcarAcerto}
                  style={{ flex: 1, background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e",
                    borderRadius: "10px", padding: "11px", color: "#22c55e",
                    fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                  ✅ Consegui!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
