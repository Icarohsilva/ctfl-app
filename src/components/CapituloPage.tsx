"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import mapaCaptulos, { type CapituloMeta } from "@/data/mapa-capitulos";
import AdBanner from "@/components/AdBanner";

export default function CapituloPage({ numeroCapitulo }: { numeroCapitulo: number }) {
  const capitulo: CapituloMeta = mapaCaptulos[numeroCapitulo];
  const [topicosFeitos, setTopicosFeitos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProgresso();
  }, []);

  const carregarProgresso = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data } = await supabase
      .from("progresso_topicos")
      .select("topico_id")
      .eq("user_id", user.id)
      .eq("capitulo", numeroCapitulo)
      .eq("concluido", true);

    if (data) setTopicosFeitos(data.map((d: { topico_id: string }) => d.topico_id));
    setLoading(false);
  };

  if (!capitulo) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#ef4444" }}>Capítulo não encontrado.</div>
    </main>
  );

  const totalXP = capitulo.topicos.reduce((acc, t) => acc + t.xp, 0);
  const xpGanho = capitulo.topicos.filter(t => topicosFeitos.includes(t.id)).reduce((acc, t) => acc + t.xp, 0);
  const progresso = capitulo.topicos.length > 0
    ? Math.round((topicosFeitos.length / capitulo.topicos.length) * 100)
    : 0;

  const capAnteriorCompleto = numeroCapitulo === 1 ? true : (() => {
    return true;
  })();

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#3b82f6", fontFamily: "Georgia, serif" }}>Carregando...</div>
    </main>
  );

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        <a href="/dashboard" style={{ color: "#6b7280", fontSize: "13px", textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>
          ← Voltar ao dashboard
        </a>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", background: "#111827", color: capitulo.cor, border: `1px solid ${capitulo.cor}44`, padding: "3px 10px", borderRadius: "99px" }}>
              Capítulo {capitulo.numero}
            </span>
            <span style={{ fontSize: "12px", background: "#1f2937", color: "#6b7280", padding: "3px 10px", borderRadius: "99px" }}>
              {capitulo.peso} do exame
            </span>
          </div>
          <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", margin: "0 0 0.5rem" }}>
            {capitulo.titulo}
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>{capitulo.descricao}</p>
        </div>

        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Progresso do capítulo</span>
            <span style={{ fontSize: "13px", color: capitulo.cor, fontWeight: "bold" }}>{progresso}%</span>
          </div>
          <div style={{ background: "#1f2937", borderRadius: "99px", height: "6px", marginBottom: "10px" }}>
            <div style={{
              background: `linear-gradient(90deg, ${capitulo.cor}, #9ca3af)`,
              width: `${progresso}%`,
              height: "6px",
              borderRadius: "99px",
              transition: "width 0.5s ease",
              minWidth: progresso > 0 ? "6px" : "0"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>{topicosFeitos.length} de {capitulo.topicos.length} tópicos concluídos</span>
            <span style={{ fontSize: "12px", color: capitulo.cor }}>⭐ {xpGanho}/{totalXP} XP</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {capitulo.topicos.map((topico, idx) => {
            const concluido = topicosFeitos.includes(topico.id);
            const anteriorFeito = idx === 0 || topicosFeitos.includes(capitulo.topicos[idx - 1].id);
            const bloqueado = !anteriorFeito && !concluido;
            const atual = !concluido && anteriorFeito;

            return (
              <div
                key={topico.id}
                onClick={() => !bloqueado && (window.location.href = `/capitulo/${numeroCapitulo}/topico/${topico.id}`)}
                style={{
                  background: concluido ? "rgba(34,197,94,0.08)" : "#111827",
                  border: `1px solid ${concluido ? "rgba(34,197,94,0.3)" : atual ? capitulo.cor + "66" : "#1f2937"}`,
                  borderRadius: "14px",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  cursor: bloqueado ? "not-allowed" : "pointer",
                  opacity: bloqueado ? 0.4 : 1,
                  transition: "border-color 0.2s, transform 0.15s",
                }}
                onMouseEnter={e => { if (!bloqueado) (e.currentTarget as HTMLElement).style.borderColor = capitulo.cor + "66"; }}
                onMouseLeave={e => { if (!bloqueado) (e.currentTarget as HTMLElement).style.borderColor = concluido ? "rgba(34,197,94,0.3)" : atual ? capitulo.cor + "44" : "#1f2937"; }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                  background: concluido ? "rgba(34,197,94,0.15)" : atual ? capitulo.cor + "22" : "#1f2937",
                  border: `2px solid ${concluido ? "#22c55e" : atual ? capitulo.cor : "#374151"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: concluido ? "1.1rem" : "0.95rem",
                  color: concluido ? "#22c55e" : atual ? capitulo.cor : "#6b7280",
                  fontWeight: "bold",
                }}>
                  {concluido ? "✓" : bloqueado ? "🔒" : topico.numero}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: concluido ? "#22c55e" : "#e5e7eb" }}>
                      {topico.titulo}
                    </span>
                    {concluido && (
                      <span style={{ fontSize: "11px", background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", padding: "1px 7px", borderRadius: "99px" }}>
                        Concluído ✓
                      </span>
                    )}
                    {atual && (
                      <span style={{ fontSize: "11px", background: "#111827", color: capitulo.cor, border: `1px solid ${capitulo.cor}44`, padding: "1px 7px", borderRadius: "99px" }}>
                        Próximo
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                    {topico.subtitulo} · ⭐ +{topico.xp} XP
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {["📖", "🃏", "🎬", "🎯", "🏆"].map((icon, i) => (
                      <span key={i} style={{ fontSize: "11px", opacity: concluido ? 1 : 0.3 }}>{icon}</span>
                    ))}
                  </div>
                </div>

                {!bloqueado && (
                  <span style={{ color: concluido ? "rgba(34,197,94,0.5)" : capitulo.cor, fontSize: "1.2rem", flexShrink: 0 }}>›</span>
                )}
              </div>
            );
          })}
        </div>

        {progresso === 100 && (
          <div style={{ marginTop: "2rem", background: "rgba(34,197,94,0.08)", border: `1px solid ${capitulo.cor}44`, borderRadius: "14px", padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎓</div>
            <div style={{ color: "#e5e7eb", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Capítulo {capitulo.numero} concluído!
            </div>
            <div style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "1.25rem" }}>
              Você ganhou {totalXP} XP. {numeroCapitulo < 6 ? `Capítulo ${numeroCapitulo + 1} desbloqueado!` : "Todos os capítulos concluídos! 🏆"}
            </div>
            {numeroCapitulo < 6 && (
              <a href={`/capitulo/${numeroCapitulo + 1}`} style={{ background: capitulo.cor, color: "#0b0f1a", padding: "10px 24px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", textDecoration: "none", display: "inline-block" }}>
                Próximo capítulo →
              </a>
            )}
          </div>
        )}
      <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || ""} format="horizontal" style={{ marginTop: "2rem" }} />
      </div>
    </main>
  );
}
