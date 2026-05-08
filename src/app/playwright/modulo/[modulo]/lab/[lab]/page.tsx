"use client";
import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapaModulos } from "@/data/playwright-modulos";
import { conteudoLabs } from "@/data/playwright-labs";
import LabPassos from "@/components/LabPassos";

export default function LabPage({
  params,
}: {
  params: Promise<{ modulo: string; lab: string }>;
}) {
  const { modulo, lab } = use(params);
  const numModulo = Number(modulo);
  const mod = mapaModulos[numModulo];
  const conteudo = conteudoLabs[lab];

  if (!mod || !conteudo) notFound();

  const labMeta = mod.labs.find(l => l.id === lab);
  if (!labMeta) notFound();

  const [userId, setUserId] = useState<string | null>(null);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      setUserId(user.id);
      const { data } = await supabase.from("progresso_topicos")
        .select("id").eq("user_id", user.id)
        .eq("certificacao_id", "playwright")
        .eq("capitulo", numModulo).eq("topico_id", lab).eq("concluido", true).single();
      if (data) setConcluido(true);
    })();
  }, [numModulo, lab]);

  const salvarProgresso = async (xp: number) => {
    if (!userId || concluido) return;
    await supabase.from("progresso_topicos").upsert({
      user_id: userId,
      certificacao_id: "playwright",
      capitulo: numModulo,
      topico_id: lab,
      concluido: true,
      xp_ganho: xp,
      atualizado_em: new Date().toISOString(),
    }, { onConflict: "user_id,certificacao_id,capitulo,topico_id" });

    const { data: cert } = await supabase.from("usuario_certificacoes")
      .select("pontos, streak, maior_streak, semana_atual")
      .eq("user_id", userId).eq("certificacao_id", "playwright").single();

    if (cert) {
      const hoje = new Date().toISOString().split("T")[0];
      const novoStreak = (cert.streak || 0) + 1;
      const idxAtualLab = mod.labs.findIndex(l => l.id === lab);
      const todosModuloConcluidos = idxAtualLab === mod.labs.length - 1;
      await supabase.from("usuario_certificacoes").update({
        pontos: (cert.pontos || 0) + xp,
        streak: novoStreak,
        maior_streak: Math.max(novoStreak, cert.maior_streak || 0),
        ultimo_estudo: hoje,
        ...(todosModuloConcluidos && cert.semana_atual === numModulo
          ? { semana_atual: numModulo + 1 } : {}),
      }).eq("user_id", userId).eq("certificacao_id", "playwright");
    }

    setConcluido(true);
    // Navegar para o próximo lab ou de volta ao módulo
    const idxAtual = mod.labs.findIndex(l => l.id === lab);
    if (idxAtual < mod.labs.length - 1) {
      window.location.href = `/playwright/modulo/${numModulo}/lab/${mod.labs[idxAtual + 1].id}`;
    } else {
      window.location.href = `/playwright/modulo/${numModulo}`;
    }
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb",
      fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px",
          fontSize: "12px", color: "#6b7280", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="/playwright" style={{ color: "#9ca3af", textDecoration: "none" }}>
            Playwright
          </a>
          <span>›</span>
          <a href={`/playwright/modulo/${numModulo}`}
            style={{ color: "#9ca3af", textDecoration: "none" }}>
            Módulo {numModulo} — {mod.titulo}
          </a>
          <span>›</span>
          <span style={{ color: "#06b6d4" }}>Lab {labMeta.numero}</span>
        </div>

        {/* Título */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "10px", color: "#06b6d4", fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "6px" }}>
            {mod.emoji} MÓDULO {numModulo} · LAB {labMeta.numero}/{mod.labs.length}
          </div>
          <h1 style={{ fontSize: "1.5rem", fontFamily: "Georgia, serif",
            fontWeight: "normal", color: "#e5e7eb", margin: "0 0 4px" }}>
            {labMeta.titulo}
          </h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>{labMeta.subtitulo}</p>
        </div>

        {/* Lab já concluído */}
        {concluido ? (
          <div style={{ background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px",
            padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✅</div>
            <div style={{ color: "#22c55e", fontWeight: "bold", marginBottom: "4px" }}>
              Lab concluído!
            </div>
            <div style={{ color: "#6b7280", fontSize: "13px", marginBottom: "16px" }}>
              Você já completou este lab.
            </div>
            <a href={`/playwright/modulo/${numModulo}`}
              style={{ color: "#06b6d4", fontSize: "13px", textDecoration: "none" }}>
              ← Voltar ao módulo
            </a>
          </div>
        ) : (
          <LabPassos lab={conteudo} xp={labMeta.xp} onConcluido={salvarProgresso} />
        )}
      </div>
    </main>
  );
}
