"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Tipo = "opiniao" | "certificacao" | "bug";

const categorias: { tipo: Tipo; icone: string; label: string }[] = [
  { tipo: "opiniao",       icone: "💬", label: "Opinião"              },
  { tipo: "certificacao",  icone: "🎓", label: "Sugerir certificação" },
  { tipo: "bug",           icone: "🐛", label: "Reportar bug"         },
];

const locaisBug = ["Dashboard", "Trilha/Tópico", "Simulado", "Perfil", "Outro"];

export default function FeedbackWidget() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState<Tipo | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [hover, setHover] = useState(false);

  // Formulário opinião
  const [estrelas, setEstrelas] = useState(0);
  const [mensagem, setMensagem] = useState("");

  // Formulário certificação
  const [nomeCert, setNomeCert] = useState("");
  const [orgCert, setOrgCert] = useState("");
  const [motivoCert, setMotivoCert] = useState("");

  // Formulário bug
  const [localBug, setLocalBug] = useState("");
  const [descBug, setDescBug] = useState("");
  const [urlBug, setUrlBug] = useState("");

  if (pathname === "/simulado-final") return null;

  const resetar = () => {
    setTipo(null);
    setEstrelas(0); setMensagem("");
    setNomeCert(""); setOrgCert(""); setMotivoCert("");
    setLocalBug(""); setDescBug(""); setUrlBug("");
    setSucesso(false);
  };

  const fechar = () => { setAberto(false); resetar(); };

  const podeSalvar = () => {
    if (!tipo) return false;
    if (tipo === "opiniao") return estrelas > 0 && mensagem.length >= 10;
    if (tipo === "certificacao") return nomeCert.trim() !== "" && orgCert.trim() !== "" && motivoCert.length >= 10;
    if (tipo === "bug") return localBug !== "" && descBug.length >= 10;
    return false;
  };

  const enviar = async () => {
    if (!tipo || !podeSalvar()) return;
    setEnviando(true);

    let dados: Record<string, string | number> = {};
    if (tipo === "opiniao")      dados = { avaliacao: estrelas, mensagem };
    if (tipo === "certificacao") dados = { nome: nomeCert, organizacao: orgCert, motivo: motivoCert };
    if (tipo === "bug")          dados = { local: localBug, descricao: descBug, ...(urlBug ? { url: urlBug } : {}) };

    // Tentar obter token do usuário logado
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers,
        body: JSON.stringify({ tipo, dados }),
      });
      if (res.ok) {
        setSucesso(true);
        setTimeout(() => fechar(), 2000);
      }
    } finally {
      setEnviando(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0b0f1a", border: "1px solid #374151",
    borderRadius: "8px", padding: "9px 12px", color: "#e5e7eb",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setAberto(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 999,
          display: "flex", alignItems: "center", gap: "6px",
          background: "#1f2937",
          border: `1px solid ${hover ? "#3b82f6" : "#374151"}`,
          borderRadius: "99px", padding: "10px 16px",
          color: hover ? "#3b82f6" : "#9ca3af",
          fontSize: "14px", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          transition: "border-color 0.15s, color 0.15s",
        }}
      >
        <span>💬</span>
        <span>Feedback</span>
      </button>

      {/* Overlay + Modal */}
      {aberto && (
        <div
          onClick={fechar}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "1rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: "16px", padding: "1.75rem",
              width: "100%", maxWidth: "480px",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal" }}>
                Enviar feedback
              </h2>
              <button onClick={fechar} style={{ background: "none", border: "none", color: "#6b7280", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>

            {sucesso ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
                <p style={{ color: "#22c55e", fontSize: "15px", margin: 0 }}>Feedback enviado! Obrigado.</p>
              </div>
            ) : (
              <>
                {/* Seleção de categoria */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem" }}>
                  {categorias.map(c => (
                    <button
                      key={c.tipo}
                      onClick={() => setTipo(c.tipo)}
                      style={{
                        flex: 1, padding: "10px 6px", borderRadius: "10px", cursor: "pointer",
                        background: tipo === c.tipo ? "rgba(59,130,246,0.1)" : "#0b0f1a",
                        border: `1px solid ${tipo === c.tipo ? "#3b82f6" : "#374151"}`,
                        color: tipo === c.tipo ? "#3b82f6" : "#9ca3af",
                        fontSize: "12px", display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "4px", transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>{c.icone}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>

                {/* Formulário opinião */}
                {tipo === "opiniao" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Avaliação *</label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setEstrelas(n)}
                            style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", padding: "2px", lineHeight: 1 }}>
                            {n <= estrelas ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>O que você acha do TestPath? *</label>
                      <textarea value={mensagem} onChange={e => setMensagem(e.target.value)}
                        placeholder="Mínimo 10 caracteres..."
                        style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }} />
                    </div>
                  </div>
                )}

                {/* Formulário certificação */}
                {tipo === "certificacao" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Nome da certificação *</label>
                      <input value={nomeCert} onChange={e => setNomeCert(e.target.value)}
                        placeholder="Ex: CTAL-TA, PMP, IREB CPRE" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Organização / banca *</label>
                      <input value={orgCert} onChange={e => setOrgCert(e.target.value)}
                        placeholder="Ex: ISTQB, PMI, IREB" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Por que seria útil? *</label>
                      <textarea value={motivoCert} onChange={e => setMotivoCert(e.target.value)}
                        placeholder="Mínimo 10 caracteres..."
                        style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                    </div>
                  </div>
                )}

                {/* Formulário bug */}
                {tipo === "bug" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Onde aconteceu? *</label>
                      <select value={localBug} onChange={e => setLocalBug(e.target.value)}
                        style={{ ...inputStyle, appearance: "auto" }}>
                        <option value="">Selecione...</option>
                        {locaisBug.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>O que aconteceu? *</label>
                      <textarea value={descBug} onChange={e => setDescBug(e.target.value)}
                        placeholder="Mínimo 10 caracteres..."
                        style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>URL ou tela (opcional)</label>
                      <input value={urlBug} onChange={e => setUrlBug(e.target.value)}
                        placeholder="Ex: /capitulo/1/topico/niveis-teste" style={inputStyle} />
                    </div>
                  </div>
                )}

                {/* Botão enviar */}
                {tipo && (
                  <button
                    onClick={enviar}
                    disabled={!podeSalvar() || enviando}
                    style={{
                      width: "100%", marginTop: "1.25rem",
                      background: podeSalvar() && !enviando ? "#3b82f6" : "#1f2937",
                      border: "none", borderRadius: "10px",
                      padding: "12px", color: podeSalvar() && !enviando ? "#fff" : "#4b5563",
                      fontSize: "14px", fontWeight: "bold",
                      cursor: podeSalvar() && !enviando ? "pointer" : "not-allowed",
                      transition: "background 0.15s",
                    }}
                  >
                    {enviando ? "Enviando..." : "Enviar feedback"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
