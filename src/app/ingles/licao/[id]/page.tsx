// src/app/ingles/licao/[id]/page.tsx
"use client";
import { use, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getNode, getProximoNode } from "@/data/ingles-curriculum";
import type { Exercicio } from "@/app/api/ingles/exercicios/route";

const logoGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function LicaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const info = getNode(id);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [idx, setIdx] = useState(0);
  const [respostaUsuario, setRespostaUsuario] = useState<string>("");
  const [palavrasSelecionadas, setPalavrasSelecionadas] = useState<string[]>([]);
  const [respostaIdx, setRespostaIdx] = useState<number | null>(null);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [acertou, setAcertou] = useState(false);
  const [xpGanho, setXpGanho] = useState(0);
  const [concluida, setConcluida] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [acertosCount, setAcertosCount] = useState(0);
  const isCheckpoint = info?.node.tipo === "checkpoint";
  const [scorePronuncia, setScorePronuncia] = useState<number | null>(null);
  const [transcriptAtual, setTranscriptAtual] = useState("");
  const [gravando, setGravando] = useState(false);
  const [suportaSpeech, setSuportaSpeech] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setSuportaSpeech("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    carregar();
  }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    setUserId(user.id);

    const { data: prog } = await supabase.from("ingles_progresso")
      .select("nivel_atual, meta").eq("user_id", user.id).single();
    if (!prog) { window.location.href = "/ingles"; return; }

    const { data: cert } = await supabase.from("usuario_certificacoes")
      .select("pontos").eq("user_id", user.id).eq("certificacao_id", "ingles").single();
    if (!cert) { window.location.href = "/ingles"; return; }

    const res = await fetch("/api/ingles/exercicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        licao_id: id,
        nivel: prog.nivel_atual,
        meta: prog.meta,
        quantidade: info?.node.tipo === "checkpoint" ? 10 : 6,
      }),
    });
    const data = await res.json();
    setExercicios(data.exercicios ?? []);
    setLoading(false);
  };

  const exercicioAtual = exercicios[idx];
  const cor = info?.nivel.cor ?? "#22c55e";

  const verificarMultipla = (i: number) => {
    if (mostrarFeedback) return;
    setRespostaIdx(i);
    const ex = exercicioAtual as { tipo: "multipla"; correta: number };
    const ok = i === ex.correta;
    setAcertou(ok);
    setMostrarFeedback(true);
    if (!ok) salvarRevisao();
  };

  const verificarTexto = () => {
    if (!respostaUsuario.trim() || mostrarFeedback) return;
    const ex = exercicioAtual as { tipo: "traducao" | "completar" | "listening"; resposta_esperada?: string; lacuna?: string; frase?: string };
    const esperada = ex.resposta_esperada ?? ex.lacuna ?? "";
    const ok = respostaUsuario.trim().toLowerCase() === esperada.toLowerCase();
    setAcertou(ok);
    setMostrarFeedback(true);
    if (!ok) salvarRevisao();
  };

  const verificarOrdenar = () => {
    if (mostrarFeedback) return;
    const ex = exercicioAtual as { tipo: "ordenar"; frase_correta: string };
    const montada = palavrasSelecionadas.join(" ");
    const ok = montada.toLowerCase() === ex.frase_correta.toLowerCase();
    setAcertou(ok);
    setMostrarFeedback(true);
    if (!ok) salvarRevisao();
  };

  const salvarRevisao = async () => {
    if (!userId) return;
    const ex = exercicioAtual;
    const item = ex.tipo === "traducao" ? (ex as { frase_pt: string }).frase_pt
      : ex.tipo === "ordenar" ? (ex as { frase_correta: string }).frase_correta
      : ex.tipo === "speaking" ? (ex as { frase: string }).frase
      : (ex as { frase?: string; pergunta?: string }).frase ?? (ex as { pergunta?: string }).pergunta ?? "";
    await supabase.from("ingles_revisao").upsert({
      user_id: userId, licao_id: id, item, tipo: ex.tipo,
      tentativas: 1, acertos: 0, proxima_revisao: new Date().toISOString(),
    });
  };

  const iniciarGravacao = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setTranscriptAtual(t);
    };
    recognition.onend = async () => {
      setGravando(false);
      const ex = exercicioAtual as { tipo: "speaking"; frase: string };
      if (!transcriptAtual) return;
      const res = await fetch("/api/ingles/pronuncia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ esperado: ex.frase, transcript: transcriptAtual,
          nivel: info?.nivel.nivel ?? "A2", user_id: userId, licao_id: id }),
      });
      const data = await res.json();
      setScorePronuncia(data.score);
      setAcertou(data.score >= 60);
      setMostrarFeedback(true);
      if (data.score < 60) salvarRevisao();
    };
    recognition.start();
    recognitionRef.current = recognition;
    setGravando(true);
  };

  const pararGravacao = () => { recognitionRef.current?.stop(); };

  const tocarAudio = (frase: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(frase);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const avancar = async () => {
    const xp = acertou ? 10 : 0;
    setXpGanho(t => t + xp);
    const novosAcertos = acertosCount + (acertou ? 1 : 0);
    setAcertosCount(novosAcertos);

    if (idx >= exercicios.length - 1) {
      if (isCheckpoint && novosAcertos / exercicios.length < 0.7) {
        alert(`Você acertou ${novosAcertos}/${exercicios.length}. Precisa de ${Math.ceil(exercicios.length * 0.7)} para passar. Tente novamente!`);
        window.location.href = `/ingles/licao/${id}`;
        return;
      }
      const xpTotal = xpGanho + xp + (info?.node.xp ?? 30);
      await supabase.from("ingles_progresso").select("licoes_concluidas")
        .eq("user_id", userId).single().then(async ({ data }) => {
          if (!data) return;
          const novas = [...(data.licoes_concluidas ?? []), id];
          await supabase.from("ingles_progresso")
            .update({ licoes_concluidas: novas }).eq("user_id", userId);
        });
      await supabase.from("usuario_certificacoes")
        .select("pontos").eq("user_id", userId).eq("certificacao_id", "ingles")
        .single().then(async ({ data }) => {
          if (!data) return;
          await supabase.from("usuario_certificacoes")
            .update({ pontos: (data.pontos ?? 0) + xpTotal, ultimo_estudo: new Date().toISOString().split("T")[0] })
            .eq("user_id", userId).eq("certificacao_id", "ingles");
        });
      setConcluida(true);
      return;
    }

    setIdx(i => i + 1);
    setRespostaUsuario("");
    setPalavrasSelecionadas([]);
    setRespostaIdx(null);
    setMostrarFeedback(false);
    setAcertou(false);
    setScorePronuncia(null);
    setTranscriptAtual("");
  };

  const renderExercicio = () => {
    if (!exercicioAtual) return null;
    const ex = exercicioAtual;

    if (ex.tipo === "multipla") return (
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>ESCOLHA A OPÇÃO CORRETA</div>
        <p style={{ color: "#e5e7eb", fontSize: "14px", marginBottom: "16px" }}>{ex.pergunta}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {ex.opcoes.map((op, i) => {
            let bg = "#0d1117", border = "#374151", cor2 = "#e5e7eb";
            if (mostrarFeedback) {
              if (i === ex.correta) { bg = "rgba(34,197,94,0.1)"; border = "#22c55e"; cor2 = "#22c55e"; }
              else if (i === respostaIdx) { bg = "rgba(239,68,68,0.1)"; border = "#ef4444"; cor2 = "#ef4444"; }
            } else if (i === respostaIdx) { bg = "rgba(34,197,94,0.1)"; border = cor; cor2 = cor; }
            return (
              <button key={i} onClick={() => verificarMultipla(i)}
                style={{ background: bg, border: `1px solid ${border}`, borderRadius: "10px",
                  padding: "11px 14px", textAlign: "left", cursor: "pointer",
                  fontSize: "13px", color: cor2, transition: "all 0.15s" }}>
                {op}
              </button>
            );
          })}
        </div>
        {mostrarFeedback && <p style={{ marginTop: "12px", fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>}
      </div>
    );

    if (ex.tipo === "traducao") return (
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>TRADUZA PARA O INGLÊS</div>
        <p style={{ color: "#e5e7eb", fontSize: "15px", fontStyle: "italic", marginBottom: "16px" }}>"{ex.frase_pt}"</p>
        <input value={respostaUsuario} onChange={e => setRespostaUsuario(e.target.value)}
          onKeyDown={e => e.key === "Enter" && verificarTexto()}
          disabled={mostrarFeedback}
          placeholder="Type in English..."
          style={{ width: "100%", background: "#0d1117", border: `1px solid ${mostrarFeedback ? (acertou ? "#22c55e" : "#ef4444") : "#374151"}`,
            borderRadius: "10px", padding: "11px 14px", color: "#e5e7eb",
            fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
        {mostrarFeedback && (
          <div style={{ marginTop: "10px" }}>
            {!acertou && <p style={{ fontSize: "12px", color: "#22c55e" }}>✓ {ex.resposta_esperada}</p>}
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>
          </div>
        )}
        {!mostrarFeedback && (
          <button onClick={verificarTexto} style={{ marginTop: "12px", width: "100%",
            background: cor, border: "none", borderRadius: "10px", padding: "11px",
            color: "#000", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
            Verificar
          </button>
        )}
      </div>
    );

    if (ex.tipo === "ordenar") {
      const palavrasDisponiveis = ex.palavras.filter(p => !palavrasSelecionadas.includes(p));
      return (
        <div>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>MONTE A FRASE</div>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>{ex.instrucao}</p>
          <div style={{ minHeight: "44px", border: `1px dashed ${mostrarFeedback ? (acertou ? "#22c55e" : "#ef4444") : "#374151"}`,
            borderRadius: "10px", padding: "8px 10px", marginBottom: "12px",
            display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            {palavrasSelecionadas.map((p, i) => (
              <button key={i} onClick={() => !mostrarFeedback && setPalavrasSelecionadas(s => s.filter((_, j) => j !== i))}
                style={{ background: `${cor}22`, border: `1px solid ${cor}44`, borderRadius: "6px",
                  padding: "4px 10px", fontSize: "12px", color: cor, cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {palavrasDisponiveis.map((p, i) => (
              <button key={i} onClick={() => !mostrarFeedback && setPalavrasSelecionadas(s => [...s, p])}
                style={{ background: "#111827", border: "1px solid #374151", borderRadius: "6px",
                  padding: "4px 10px", fontSize: "12px", color: "#9ca3af", cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
          {mostrarFeedback && !acertou && (
            <p style={{ fontSize: "12px", color: "#22c55e", marginBottom: "8px" }}>✓ {ex.frase_correta}</p>
          )}
          {mostrarFeedback && <p style={{ fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>}
          {!mostrarFeedback && palavrasSelecionadas.length > 0 && (
            <button onClick={verificarOrdenar} style={{ width: "100%", background: cor, border: "none",
              borderRadius: "10px", padding: "11px", color: "#000",
              fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
              Verificar
            </button>
          )}
        </div>
      );
    }

    if (ex.tipo === "speaking") return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>REPITA EM VOZ ALTA</div>
        <p style={{ color: "#e5e7eb", fontSize: "16px", fontStyle: "italic", marginBottom: "20px" }}>"{ex.frase}"</p>
        {!suportaSpeech ? (
          <div style={{ background: "#1f2937", borderRadius: "10px", padding: "14px",
            fontSize: "12px", color: "#6b7280", marginBottom: "12px" }}>
            Speaking não disponível no seu navegador. Use Chrome para esta funcionalidade.
          </div>
        ) : (
          <>
            <button onClick={gravando ? pararGravacao : iniciarGravacao}
              disabled={mostrarFeedback}
              style={{ width: "64px", height: "64px", borderRadius: "50%",
                background: gravando ? "rgba(239,68,68,0.2)" : `${cor}22`,
                border: `2px solid ${gravando ? "#ef4444" : cor}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.6rem", cursor: "pointer", margin: "0 auto 12px" }}>
              🎙
            </button>
            {gravando && <p style={{ fontSize: "11px", color: "#ef4444", marginBottom: "8px" }}>Ouvindo... clique para parar</p>}
            {transcriptAtual && (
              <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: "8px",
                padding: "8px 12px", fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
                "{transcriptAtual}"
              </div>
            )}
          </>
        )}
        {mostrarFeedback && scorePronuncia !== null && (
          <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: "10px", padding: "12px" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: scorePronuncia >= 80 ? "#22c55e" : scorePronuncia >= 60 ? "#d4af37" : "#ef4444" }}>
              {scorePronuncia}<span style={{ fontSize: "12px", color: "#6b7280" }}>/100</span>
            </div>
          </div>
        )}
        {!suportaSpeech && !mostrarFeedback && (
          <button onClick={() => { setAcertou(true); setMostrarFeedback(true); }}
            style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "10px",
              padding: "10px 20px", color: "#6b7280", fontSize: "12px", cursor: "pointer", marginTop: "8px" }}>
            Pular este exercício
          </button>
        )}
      </div>
    );

    if (ex.tipo === "completar") return (
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>COMPLETE A FRASE</div>
        <p style={{ color: "#e5e7eb", fontSize: "14px", marginBottom: "16px" }}>{ex.frase}</p>
        {ex.opcoes && ex.opcoes.length > 0 ? (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
            {ex.opcoes.map((op, i) => (
              <button key={i} onClick={() => { if (!mostrarFeedback) { setRespostaUsuario(op); const ok = op.toLowerCase() === ex.lacuna.toLowerCase(); setAcertou(ok); setMostrarFeedback(true); if (!ok) salvarRevisao(); }}}
                style={{ background: mostrarFeedback && op.toLowerCase() === ex.lacuna.toLowerCase() ? "rgba(34,197,94,0.1)" : respostaUsuario === op ? `${cor}22` : "#0d1117",
                  border: `1px solid ${mostrarFeedback && op.toLowerCase() === ex.lacuna.toLowerCase() ? "#22c55e" : respostaUsuario === op ? cor : "#374151"}`,
                  borderRadius: "8px", padding: "8px 14px", fontSize: "13px",
                  color: mostrarFeedback && op.toLowerCase() === ex.lacuna.toLowerCase() ? "#22c55e" : "#e5e7eb",
                  cursor: "pointer" }}>
                {op}
              </button>
            ))}
          </div>
        ) : (
          <input value={respostaUsuario} onChange={e => setRespostaUsuario(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verificarTexto()}
            disabled={mostrarFeedback} placeholder="Digite a palavra..."
            style={{ width: "100%", background: "#0d1117", border: `1px solid #374151`,
              borderRadius: "10px", padding: "11px 14px", color: "#e5e7eb",
              fontSize: "13px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }} />
        )}
        {mostrarFeedback && <p style={{ fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>}
        {!mostrarFeedback && !ex.opcoes?.length && (
          <button onClick={verificarTexto} style={{ width: "100%", background: cor, border: "none",
            borderRadius: "10px", padding: "11px", color: "#000", fontWeight: "700",
            fontSize: "13px", cursor: "pointer" }}>Verificar</button>
        )}
      </div>
    );

    if (ex.tipo === "listening") return (
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>OUÇA E ESCREVA</div>
        <button onClick={() => tocarAudio(ex.frase)}
          style={{ width: "64px", height: "64px", borderRadius: "50%",
            background: `${cor}22`, border: `2px solid ${cor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem", cursor: "pointer", margin: "0 auto 16px" }}>
          👂
        </button>
        {!("speechSynthesis" in window) && (
          <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", marginBottom: "12px" }}>
            Áudio não disponível no seu navegador. Frase: <em>"{ex.frase}"</em>
          </p>
        )}
        <input value={respostaUsuario} onChange={e => setRespostaUsuario(e.target.value)}
          onKeyDown={e => e.key === "Enter" && verificarTexto()}
          disabled={mostrarFeedback} placeholder="What did you hear?"
          style={{ width: "100%", background: "#0d1117", border: `1px solid ${mostrarFeedback ? (acertou ? "#22c55e" : "#ef4444") : "#374151"}`,
            borderRadius: "10px", padding: "11px 14px", color: "#e5e7eb",
            fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
        {mostrarFeedback && (
          <div style={{ marginTop: "10px" }}>
            {!acertou && <p style={{ fontSize: "12px", color: "#22c55e" }}>✓ {ex.frase}</p>}
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>
          </div>
        )}
        {!mostrarFeedback && (
          <button onClick={verificarTexto} style={{ marginTop: "12px", width: "100%",
            background: cor, border: "none", borderRadius: "10px", padding: "11px",
            color: "#000", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
            Verificar
          </button>
        )}
      </div>
    );

    return null;
  };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#22c55e", fontFamily: "Georgia, serif" }}>Preparando lição...</div>
    </main>
  );

  if (concluida) {
    const proximo = info ? getProximoNode(id) : undefined;
    return (
      <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "2rem", fontFamily: "sans-serif" }}>
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
          padding: "2.5rem", width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
          <h2 style={{ color: "#e5e7eb", fontFamily: "Georgia, serif", fontSize: "1.3rem",
            fontWeight: "normal", marginBottom: "8px" }}>Lição concluída!</h2>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
            +{info?.node.xp ?? 30} XP ganhos
          </p>
          <button onClick={() => window.location.href = proximo ? `/ingles/licao/${proximo.id}` : "/ingles"}
            style={{ width: "100%", background: cor, border: "none", borderRadius: "10px",
              padding: "13px", color: "#000", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {proximo ? `Próxima lição →` : "Ver minha trilha →"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937" }}>
        <a href="/ingles" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="" style={{ width: "22px", height: "22px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1rem", ...logoGold }}>TestPath</span>
        </a>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>{info?.node.titulo}</div>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
          {exercicios.map((_, i) => (
            <div key={i} style={{ flex: 1, height: "6px", borderRadius: "99px",
              background: i < idx ? cor : i === idx ? `${cor}88` : "#1f2937" }} />
          ))}
          <span style={{ fontSize: "11px", color: "#6b7280", marginLeft: "8px", whiteSpace: "nowrap" }}>
            {idx + 1}/{exercicios.length}
          </span>
        </div>

        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.5rem" }}>
          {renderExercicio()}
        </div>

        {mostrarFeedback && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ background: acertou ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${acertou ? "#22c55e" : "#ef4444"}`, borderRadius: "10px",
              padding: "12px", marginBottom: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "1.2rem" }}>{acertou ? "✅" : "❌"}</span>
              <span style={{ fontSize: "12px", color: acertou ? "#22c55e" : "#ef4444", fontWeight: "600" }}>
                {acertou ? "Correto!" : "Incorreto — continue praticando."}
              </span>
            </div>
            <button onClick={avancar}
              style={{ width: "100%", background: cor, border: "none", borderRadius: "10px",
                padding: "13px", color: "#000", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {idx >= exercicios.length - 1 ? "Concluir lição 🎉" : "Continuar →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
