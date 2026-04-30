"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Certificacao = {
  id: string;
  nome: string;
  descricao: string;
  nivel: string;
  total_topicos: number;
  total_capitulos: number;
};

export default function OnboardingCertificacao({ certId }: { certId: string }) {
  const [passo, setPasso] = useState(1);
  const [cert, setCert] = useState<Certificacao | null>(null);
  const [nivelQA, setNivelQA] = useState("");
  const [ritmo, setRitmo] = useState("");
  const [dataMeta, setDataMeta] = useState("");
  const [semMeta, setSemMeta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: existing } = await supabase
      .from("usuario_certificacoes")
      .select("id")
      .eq("user_id", user.id)
      .eq("certificacao_id", certId)
      .single();

    if (existing) {
      window.location.href = `/capitulo/1`;
      return;
    }

    const { data: perfil } = await supabase.from("profiles").select("nivel").eq("id", user.id).single();
    if (perfil?.nivel) setNivelQA(perfil.nivel);

    const { data: certData } = await supabase
      .from("certificacoes")
      .select("*")
      .eq("id", certId)
      .single();

    if (certData) setCert(certData);
    setLoading(false);
  };

  const calcularDataMeta = (ritmoSelecionado: string) => {
    const hoje = new Date();
    const dias = ritmoSelecionado === "leve" ? 70 : ritmoSelecionado === "moderado" ? 56 : 28;
    hoje.setDate(hoje.getDate() + dias);
    return hoje.toISOString().split("T")[0];
  };

  const selecionarRitmo = (r: string) => {
    setRitmo(r);
    if (!semMeta) setDataMeta(calcularDataMeta(r));
  };

  const finalizar = async () => {
    if (!nivelQA || (!semMeta && !dataMeta)) return;
    setSalvando(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("usuario_certificacoes").upsert({
      user_id: user.id,
      certificacao_id: certId,
      status: "em_andamento",
      data_inicio: new Date().toISOString().split("T")[0],
      data_meta: semMeta ? null : dataMeta,
      ritmo: ritmo || "moderado",
      semana_atual: 1,
      pontos: 0,
      streak: 0,
    });

    await supabase.from("profiles").update({ nivel: nivelQA }).eq("id", user.id);

    window.location.href = `/capitulo/1`;
  };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#3b82f6", fontFamily: "Georgia, serif" }}>Carregando...</div>
    </main>
  );

  const s = {
    btn: { background: "#3b82f6", border: "none", borderRadius: "10px", padding: "13px 28px", color: "#ffffff", fontSize: "15px", fontWeight: "bold" as const, cursor: "pointer", width: "100%", marginTop: "1.25rem" } as React.CSSProperties,
    btnSec: { background: "transparent", border: "1px solid #374151", borderRadius: "10px", padding: "11px 28px", color: "#9ca3af", fontSize: "14px", cursor: "pointer", width: "100%", marginTop: "8px" } as React.CSSProperties,
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.2rem", background: "linear-gradient(135deg, #d4af37, #f5d76e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>TestPath</span>
      </div>

      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "500px" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Passo {passo} de 2</span>
            <span style={{ fontSize: "13px", color: "#3b82f6" }}>{passo === 1 ? "50%" : "100%"}</span>
          </div>
          <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px" }}>
            <div style={{ background: "#3b82f6", width: passo === 1 ? "50%" : "100%", height: "4px", borderRadius: "99px", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {cert && (
          <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem", display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>🎓</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb" }}>{cert.nome}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>{cert.total_topicos} tópicos · {cert.total_capitulos} capítulos · {cert.nivel}</div>
            </div>
          </div>
        )}

        {passo === 1 && (
          <div>
            <h2 style={{ fontSize: "1.3rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.5rem" }}>
              Qual é o seu nível atual em QA?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Isso define o tom do conteúdo e a dificuldade das questões para <strong style={{ color: "#3b82f6" }}>todas</strong> as suas certificações.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { valor: "iniciante", emoji: "🌱", titulo: "Iniciante", desc: "Estou começando em QA agora — quero aprender do zero com linguagem simples" },
                { valor: "basico", emoji: "📖", titulo: "Praticante", desc: "Já trabalho com QA — conheço os conceitos básicos e quero me certificar" },
                { valor: "intermediario", emoji: "🎯", titulo: "Especialista", desc: "Tenho experiência sólida — quero questões desafiadoras e foco nas nuances" },
              ].map(n => (
                <button key={n.valor} onClick={() => setNivelQA(n.valor)}
                  style={{ background: nivelQA === n.valor ? "rgba(59,130,246,0.08)" : "#0b0f1a", border: `1px solid ${nivelQA === n.valor ? "#3b82f6" : "#374151"}`, borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}>
                  <span style={{ fontSize: "1.5rem" }}>{n.emoji}</span>
                  <div>
                    <div style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "bold" }}>{n.titulo}</div>
                    <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.4 }}>{n.desc}</div>
                  </div>
                  {nivelQA === n.valor && <span style={{ marginLeft: "auto", color: "#3b82f6", flexShrink: 0 }}>✓</span>}
                </button>
              ))}
            </div>

            <button onClick={() => nivelQA && setPasso(2)} disabled={!nivelQA}
              style={{ ...s.btn, opacity: nivelQA ? 1 : 0.4 }}>
              Continuar →
            </button>
          </div>
        )}

        {passo === 2 && (
          <div>
            <h2 style={{ fontSize: "1.3rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.5rem" }}>
              Como quer estudar o {cert?.nome}?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Escolha o ritmo e o app monta seu cronograma. Você pode alterar a qualquer momento no perfil.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
              {[
                { valor: "leve", emoji: "🌊", titulo: "Leve", desc: "~30min/dia · ~10 semanas · Sem pressão, avança no seu tempo", dias: 70 },
                { valor: "moderado", emoji: "📅", titulo: "Moderado", desc: "~1h/dia · ~8 semanas · Equilíbrio ideal para quem trabalha", dias: 56 },
                { valor: "intensivo", emoji: "⚡", titulo: "Intensivo", desc: "~2h/dia · ~4 semanas · Para quem tem a prova marcada em breve", dias: 28 },
              ].map(r => (
                <button key={r.valor} onClick={() => selecionarRitmo(r.valor)}
                  style={{ background: ritmo === r.valor ? "rgba(59,130,246,0.08)" : "#0b0f1a", border: `1px solid ${ritmo === r.valor ? "#3b82f6" : "#374151"}`, borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}>
                  <span style={{ fontSize: "1.5rem" }}>{r.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "bold" }}>{r.titulo}</div>
                    <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                  {ritmo === r.valor && <span style={{ color: "#3b82f6", flexShrink: 0 }}>✓</span>}
                </button>
              ))}
            </div>

            <div style={{ background: "#0b0f1a", border: "1px solid #374151", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: semMeta ? 0 : "10px" }}>
                <div>
                  <div style={{ fontSize: "13px", color: "#e5e7eb", fontWeight: "bold" }}>📅 Data alvo para o exame</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>Opcional — o app ajusta o cronograma</div>
                </div>
                <button onClick={() => { setSemMeta(!semMeta); if (!semMeta) setDataMeta(""); else if (ritmo) setDataMeta(calcularDataMeta(ritmo)); }}
                  style={{ background: semMeta ? "#1f2937" : "rgba(59,130,246,0.08)", border: `1px solid ${semMeta ? "#374151" : "rgba(59,130,246,0.3)"}`, borderRadius: "99px", padding: "4px 12px", color: semMeta ? "#6b7280" : "#3b82f6", fontSize: "12px", cursor: "pointer" }}>
                  {semMeta ? "Sem prazo" : "Com prazo"}
                </button>
              </div>
              {!semMeta && (
                <input
                  type="date"
                  value={dataMeta}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setDataMeta(e.target.value)}
                  style={{ width: "100%", background: "#111827", border: "1px solid #374151", borderRadius: "8px", padding: "8px 12px", color: "#e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box", marginTop: "10px" }}
                />
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setPasso(1)} style={{ ...s.btnSec, flex: 1, marginTop: 0 }}>← Voltar</button>
              <button onClick={finalizar} disabled={salvando || !ritmo}
                style={{ ...s.btn, flex: 2, marginTop: 0, opacity: (salvando || !ritmo) ? 0.4 : 1 }}>
                {salvando ? "Configurando..." : "Começar trilha →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
