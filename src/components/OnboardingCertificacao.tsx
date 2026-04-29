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

    // Verifica se já tem onboarding feito para esta cert
    const { data: existing } = await supabase
      .from("usuario_certificacoes")
      .select("id")
      .eq("user_id", user.id)
      .eq("certificacao_id", certId)
      .single();

    if (existing) {
      // Já configurou — vai direto para o dashboard da cert
      window.location.href = `/capitulo/1`;
      return;
    }

    // Busca dados do perfil para pré-preencher nível
    const { data: perfil } = await supabase.from("profiles").select("nivel").eq("id", user.id).single();
    if (perfil?.nivel) setNivelQA(perfil.nivel);

    // Busca dados da certificação
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

    // Salva configuração da certificação
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

    // Atualiza nível global no perfil
    await supabase.from("profiles").update({ nivel: nivelQA }).eq("id", user.id);

    window.location.href = `/capitulo/1`;
  };

  if (loading) return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#c9a84c", fontFamily: "Georgia, serif" }}>Carregando...</div>
    </main>
  );

  const s = {
    btn: { background: "#c9a84c", border: "none", borderRadius: "10px", padding: "13px 28px", color: "#0a0a0f", fontSize: "15px", fontWeight: "bold" as const, cursor: "pointer", width: "100%", marginTop: "1.25rem" } as React.CSSProperties,
    btnSec: { background: "transparent", border: "1px solid #2e2e3e", borderRadius: "10px", padding: "11px 28px", color: "#a0998e", fontSize: "14px", cursor: "pointer", width: "100%", marginTop: "8px" } as React.CSSProperties,
  };

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", color: "#f0ede8", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.2rem", color: "#e8d5a3" }}>TestPath</span>
      </div>

      <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "500px" }}>

        {/* Progresso */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Passo {passo} de 2</span>
            <span style={{ fontSize: "13px", color: "#c9a84c" }}>{passo === 1 ? "50%" : "100%"}</span>
          </div>
          <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "4px" }}>
            <div style={{ background: "#c9a84c", width: passo === 1 ? "50%" : "100%", height: "4px", borderRadius: "99px", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Cabeçalho da cert */}
        {cert && (
          <div style={{ background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem", display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>🎓</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e8d5a3" }}>{cert.nome}</div>
              <div style={{ fontSize: "12px", color: "#7a7a8a" }}>{cert.total_topicos} tópicos · {cert.total_capitulos} capítulos · {cert.nivel}</div>
            </div>
          </div>
        )}

        {/* PASSO 1 — Nível */}
        {passo === 1 && (
          <div>
            <h2 style={{ fontSize: "1.3rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
              Qual é o seu nível atual em QA?
            </h2>
            <p style={{ color: "#7a7a8a", fontSize: "13px", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Isso define o tom do conteúdo e a dificuldade das questões para <strong style={{ color: "#c9a84c" }}>todas</strong> as suas certificações.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { valor: "iniciante", emoji: "🌱", titulo: "Iniciante", desc: "Estou começando em QA agora — quero aprender do zero com linguagem simples" },
                { valor: "basico", emoji: "📖", titulo: "Praticante", desc: "Já trabalho com QA — conheço os conceitos básicos e quero me certificar" },
                { valor: "intermediario", emoji: "🎯", titulo: "Especialista", desc: "Tenho experiência sólida — quero questões desafiadoras e foco nas nuances" },
              ].map(n => (
                <button key={n.valor} onClick={() => setNivelQA(n.valor)}
                  style={{ background: nivelQA === n.valor ? "#1a1a0e" : "#0a0a0f", border: `1px solid ${nivelQA === n.valor ? "#c9a84c" : "#2e2e3e"}`, borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}>
                  <span style={{ fontSize: "1.5rem" }}>{n.emoji}</span>
                  <div>
                    <div style={{ color: "#e8d5a3", fontSize: "14px", fontWeight: "bold" }}>{n.titulo}</div>
                    <div style={{ color: "#7a7a8a", fontSize: "12px", lineHeight: 1.4 }}>{n.desc}</div>
                  </div>
                  {nivelQA === n.valor && <span style={{ marginLeft: "auto", color: "#c9a84c", flexShrink: 0 }}>✓</span>}
                </button>
              ))}
            </div>

            <button onClick={() => nivelQA && setPasso(2)} disabled={!nivelQA}
              style={{ ...s.btn, opacity: nivelQA ? 1 : 0.4 }}>
              Continuar →
            </button>
          </div>
        )}

        {/* PASSO 2 — Ritmo e meta */}
        {passo === 2 && (
          <div>
            <h2 style={{ fontSize: "1.3rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
              Como quer estudar o {cert?.nome}?
            </h2>
            <p style={{ color: "#7a7a8a", fontSize: "13px", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Escolha o ritmo e o app monta seu cronograma. Você pode alterar a qualquer momento no perfil.
            </p>

            {/* Ritmo */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
              {[
                { valor: "leve", emoji: "🌊", titulo: "Leve", desc: "~30min/dia · ~10 semanas · Sem pressão, avança no seu tempo", dias: 70 },
                { valor: "moderado", emoji: "📅", titulo: "Moderado", desc: "~1h/dia · ~8 semanas · Equilíbrio ideal para quem trabalha", dias: 56 },
                { valor: "intensivo", emoji: "⚡", titulo: "Intensivo", desc: "~2h/dia · ~4 semanas · Para quem tem a prova marcada em breve", dias: 28 },
              ].map(r => (
                <button key={r.valor} onClick={() => selecionarRitmo(r.valor)}
                  style={{ background: ritmo === r.valor ? "#1a1a0e" : "#0a0a0f", border: `1px solid ${ritmo === r.valor ? "#c9a84c" : "#2e2e3e"}`, borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}>
                  <span style={{ fontSize: "1.5rem" }}>{r.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e8d5a3", fontSize: "14px", fontWeight: "bold" }}>{r.titulo}</div>
                    <div style={{ color: "#7a7a8a", fontSize: "12px", lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                  {ritmo === r.valor && <span style={{ color: "#c9a84c", flexShrink: 0 }}>✓</span>}
                </button>
              ))}
            </div>

            {/* Data meta */}
            <div style={{ background: "#0a0a0f", border: "1px solid #2e2e3e", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: semMeta ? 0 : "10px" }}>
                <div>
                  <div style={{ fontSize: "13px", color: "#e8d5a3", fontWeight: "bold" }}>📅 Data alvo para o exame</div>
                  <div style={{ fontSize: "12px", color: "#5a5a6a" }}>Opcional — o app ajusta o cronograma</div>
                </div>
                <button onClick={() => { setSemMeta(!semMeta); if (!semMeta) setDataMeta(""); else if (ritmo) setDataMeta(calcularDataMeta(ritmo)); }}
                  style={{ background: semMeta ? "#1e1e2e" : "#1a1a0e", border: `1px solid ${semMeta ? "#3e3e3e" : "#c9a84c44"}`, borderRadius: "99px", padding: "4px 12px", color: semMeta ? "#5a5a6a" : "#c9a84c", fontSize: "12px", cursor: "pointer" }}>
                  {semMeta ? "Sem prazo" : "Com prazo"}
                </button>
              </div>
              {!semMeta && (
                <input
                  type="date"
                  value={dataMeta}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setDataMeta(e.target.value)}
                  style={{ width: "100%", background: "#0f0f18", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "8px 12px", color: "#f0ede8", fontSize: "14px", outline: "none", boxSizing: "border-box", marginTop: "10px" }}
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