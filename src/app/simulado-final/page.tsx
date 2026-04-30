"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Questao = {
  id?: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  conceito: string;
  capitulo: number;
  dificuldade: string;
};

type Estado = "intro" | "carregando" | "simulado" | "revisao" | "resultado";

const TOTAL_QUESTOES = 40;
const TEMPO_MINUTOS = 60;

const distribuicao = [
  { capitulo: 1, titulo: "Fundamentos de Teste", quantidade: 10, peso: "27%" },
  { capitulo: 4, titulo: "Técnicas de Teste", quantidade: 10, peso: "25%" },
  { capitulo: 2, titulo: "Ciclo de Vida", quantidade: 7, peso: "17%" },
  { capitulo: 5, titulo: "Gerenciamento", quantidade: 7, peso: "17%" },
  { capitulo: 3, titulo: "Teste Estático", quantidade: 4, peso: "10%" },
  { capitulo: 6, titulo: "Ferramentas", quantidade: 2, peso: "5%" },
];

export default function SimuladoFinal() {
  const [estado, setEstado] = useState<Estado>("intro");
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<(number | null)[]>([]);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [tempoRestante, setTempoRestante] = useState(TEMPO_MINUTOS * 60);
  const [tempoInicio, setTempoInicio] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<{ nome: string; nivel: string } | null>(null);
  const [revisaoIdx, setRevisaoIdx] = useState<number | null>(null);
  const [msgCarregando, setMsgCarregando] = useState("Preparando seu simulado...");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    carregarPerfil();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (estado === "simulado") {
      timerRef.current = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finalizarSimulado();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [estado]);

  const carregarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    setUserId(user.id);
    const { data } = await supabase.from("profiles").select("nome, nivel").eq("id", user.id).single();
    if (data) setPerfil(data);
  };

  const iniciarSimulado = async () => {
    setEstado("carregando");
    setMsgCarregando("Gerando 40 questões personalizadas...");

    try {
      const todasQuestoes: Questao[] = [];

      for (const dist of distribuicao) {
        setMsgCarregando(`Gerando questões do Capítulo ${dist.capitulo}...`);

        const res = await fetch("/api/simulado-final", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            capitulo: dist.capitulo,
            quantidade: dist.quantidade,
            nivel: perfil?.nivel || "basico",
            userId,
          }),
        });
        const data = await res.json();
        if (Array.isArray(data.questoes)) {
          todasQuestoes.push(...data.questoes.slice(0, dist.quantidade));
        }
      }

      setQuestoes(todasQuestoes.sort(() => Math.random() - 0.5));
      setRespostas(new Array(todasQuestoes.length).fill(null));
      setTempoRestante(TEMPO_MINUTOS * 60);
      setTempoInicio(Date.now());
      setQuestaoAtual(0);
      setEstado("simulado");
    } catch (e) {
      console.error("Erro ao gerar simulado:", e);
      setEstado("intro");
    }
  };

  const responder = (opcao: number) => {
    setRespostaSelecionada(opcao);
    const novasRespostas = [...respostas];
    novasRespostas[questaoAtual] = opcao;
    setRespostas(novasRespostas);
  };

  const avancar = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(q => q + 1);
      setRespostaSelecionada(respostas[questaoAtual + 1]);
    }
  };

  const voltar = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(q => q - 1);
      setRespostaSelecionada(respostas[questaoAtual - 1]);
    }
  };

  const finalizarSimulado = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const tempoGasto = Math.round((Date.now() - tempoInicio) / 1000);
    await salvarResultado(tempoGasto);
    setEstado("resultado");
  };

  const salvarResultado = async (tempoGasto: number) => {
    if (!userId) return;
    const acertos = questoes.filter((q, i) => respostas[i] === q.correta).length;
    const pct = Math.round((acertos / questoes.length) * 100);
    const aprovado = pct >= 65;
    const xpGanho = aprovado ? 500 : Math.round(acertos * 10);

    const patches = questoes.map((q, i) => {
      if (!q.id) return Promise.resolve();
      return fetch("/api/simulado-final", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          questaoId: q.id,
          capitulo: q.capitulo,
          acertou: respostas[i] === q.correta,
        }),
      });
    });
    await Promise.all(patches);

    await supabase.from("progresso_topicos").insert({
      user_id: userId,
      capitulo: 0,
      topico_id: "simulado-final",
      certificacao_id: "ctfl",
      acertos,
      total: questoes.length,
      xp_ganho: xpGanho,
      concluido: true,
      atualizado_em: new Date().toISOString(),
    });

    const { data: pa } = await supabase.from("usuario_certificacoes")
      .select("pontos, streak, maior_streak")
      .eq("user_id", userId).eq("certificacao_id", "ctfl").single();

    if (pa) {
      const hoje = new Date().toISOString().split("T")[0];
      const novoStreak = (pa.streak || 0) + 1;
      await supabase.from("usuario_certificacoes").update({
        pontos: (pa.pontos || 0) + xpGanho,
        streak: novoStreak,
        maior_streak: Math.max(novoStreak, pa.maior_streak || 0),
        ultimo_estudo: hoje,
        ...(aprovado && { status: "concluida" }),
      }).eq("user_id", userId).eq("certificacao_id", "ctfl");
    }
  };

  const formatarTempo = (segundos: number) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const acertos = questoes.filter((q, i) => respostas[i] === q.correta).length;
  const pct = questoes.length > 0 ? Math.round((acertos / questoes.length) * 100) : 0;
  const aprovado = pct >= 65;
  const respondidas = respostas.filter(r => r !== null).length;
  const tempoAlerta = tempoRestante < 600;

  const corDificuldade = (d: string) => {
    if (d === "facil") return { bg: "rgba(34,197,94,0.12)", fg: "#22c55e" };
    if (d === "medio") return { bg: "rgba(245,158,11,0.12)", fg: "#f59e0b" };
    return { bg: "rgba(239,68,68,0.12)", fg: "#ef4444" };
  };

  // INTRO
  if (estado === "intro") return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <a href="/dashboard" style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>← Dashboard</a>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
          <h1 style={{ fontSize: "2rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.5rem" }}>
            Simulado Final CTFL
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Idêntico ao exame real da ISTQB
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "2rem" }}>
          {[
            { valor: "40", label: "questões" },
            { valor: "60min", label: "duração" },
            { valor: "65%", label: "para passar" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#3b82f6" }}>{s.valor}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "1rem", fontWeight: "bold" }}>Distribuição das questões</div>
          {distribuicao.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", background: "#1f2937", color: "#9ca3af", padding: "2px 7px", borderRadius: "99px" }}>Cap. {d.capitulo}</span>
                <span style={{ fontSize: "13px", color: "#e5e7eb" }}>{d.titulo}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>{d.quantidade} questões</span>
                <span style={{ fontSize: "11px", background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)", padding: "2px 7px", borderRadius: "99px" }}>{d.peso}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "12px", padding: "1.25rem", marginBottom: "2rem" }}>
          <div style={{ fontSize: "13px", color: "#3b82f6", fontWeight: "bold", marginBottom: "8px" }}>📋 Como funciona</div>
          {[
            "Você pode navegar entre questões e alterar respostas",
            "O timer conta regressivamente — gerencie bem o tempo",
            "Ao finalizar, veja o resultado detalhado por capítulo",
            "Precisa de 26/40 (65%) para ser aprovado",
            "As questões são geradas por IA — únicas a cada simulado",
          ].map((r, i) => (
            <div key={i} style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>• {r}</div>
          ))}
        </div>

        <button onClick={iniciarSimulado}
          style={{ width: "100%", background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "10px", padding: "14px", color: "#ffffff", fontSize: "16px", fontWeight: "600", cursor: "pointer", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.18)" }}>
          Iniciar simulado →
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "12px", color: "#6b7280" }}>
          Recomendamos fazer o simulado apenas após completar todos os capítulos
        </p>
      </div>
    </main>
  );

  // CARREGANDO
  if (estado === "carregando") return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "340px", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
        <p style={{ color: "#3b82f6", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{msgCarregando}</p>
        <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "1.5rem" }}>Gerando 40 questões únicas baseadas no syllabus CTFL v4.0</p>
        <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px" }}>
          <div style={{ background: "linear-gradient(90deg,#3b82f6,#60a5fa)", height: "4px", borderRadius: "99px", width: "60%", animation: "pulse 1.5s infinite" }} />
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    </main>
  );

  // SIMULADO
  if (estado === "simulado" && questoes.length > 0) {
    const questao = questoes[questaoAtual];
    const resposta = respostas[questaoAtual];
    const dif = corDificuldade(questao.dificuldade);

    return (
      <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>

        <div style={{ position: "sticky", top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1f2937", padding: "0.75rem 1.5rem", zIndex: 100 }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>
              Questão <strong style={{ color: "#e5e7eb" }}>{questaoAtual + 1}</strong> de {questoes.length}
              <span style={{ marginLeft: "12px", fontSize: "11px", color: "#6b7280" }}>
                {respondidas}/{questoes.length} respondidas
              </span>
            </div>

            <div style={{ background: tempoAlerta ? "rgba(239,68,68,0.12)" : "#111827", border: `1px solid ${tempoAlerta ? "#ef4444" : "#374151"}`, borderRadius: "8px", padding: "6px 14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px" }}>{tempoAlerta ? "⚠️" : "⏱"}</span>
              <span style={{ fontSize: "16px", fontWeight: "bold", color: tempoAlerta ? "#fca5a5" : "#3b82f6", fontFamily: "monospace" }}>
                {formatarTempo(tempoRestante)}
              </span>
            </div>

            <button onClick={() => {
              if (confirm("Finalizar o simulado agora?")) finalizarSimulado();
            }} style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "6px 14px", color: "#9ca3af", fontSize: "12px", cursor: "pointer", transition: "border-color 0.15s, color 0.15s" }}>
              Finalizar
            </button>
          </div>

          <div style={{ maxWidth: "760px", margin: "8px auto 0" }}>
            <div style={{ background: "#1f2937", borderRadius: "99px", height: "3px" }}>
              <div style={{ background: "linear-gradient(90deg,#3b82f6,#60a5fa)", width: `${((questaoAtual + 1) / questoes.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "1.5rem" }}>

          <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", background: "#1f2937", color: "#9ca3af", padding: "2px 8px", borderRadius: "99px" }}>
              Cap. {questao.capitulo}
            </span>
            <span style={{ fontSize: "11px", background: "#1f2937", color: "#9ca3af", padding: "2px 8px", borderRadius: "99px" }}>
              {questao.conceito}
            </span>
            <span style={{ fontSize: "11px", background: dif.bg, color: dif.fg, padding: "2px 8px", borderRadius: "99px" }}>
              {questao.dificuldade}
            </span>
          </div>

          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
            <p style={{ color: "#e5e7eb", fontSize: "16px", lineHeight: 1.7, margin: 0, fontFamily: "Georgia, serif" }}>
              {questao.pergunta}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
            {questao.opcoes.map((opcao, i) => (
              <button key={i} onClick={() => responder(i)}
                style={{
                  background: resposta === i ? "rgba(59,130,246,0.08)" : "#111827",
                  border: `1px solid ${resposta === i ? "#3b82f6" : "#1f2937"}`,
                  borderRadius: "10px", padding: "14px 16px",
                  color: resposta === i ? "#e5e7eb" : "#9ca3af",
                  fontSize: "14px", textAlign: "left", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "10px",
                  transition: "all 0.15s", lineHeight: 1.5,
                }}>
                <span style={{ width: "26px", height: "26px", borderRadius: "50%", border: `1.5px solid ${resposta === i ? "#3b82f6" : "#374151"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, fontWeight: "bold", color: resposta === i ? "#3b82f6" : "#6b7280" }}>
                  {["A", "B", "C", "D"][i]}
                </span>
                {opcao}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
            <button onClick={voltar} disabled={questaoAtual === 0}
              style={{ flex: 1, background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "11px", color: "#9ca3af", fontSize: "14px", cursor: questaoAtual === 0 ? "not-allowed" : "pointer", opacity: questaoAtual === 0 ? 0.4 : 1, transition: "border-color 0.15s, color 0.15s" }}>
              ← Anterior
            </button>
            {questaoAtual < questoes.length - 1 ? (
              <button onClick={avancar}
                style={{ flex: 2, background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px", padding: "11px", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)" }}>
                Próxima →
              </button>
            ) : (
              <button onClick={() => { if (confirm(`Finalizar? ${respondidas}/${questoes.length} respondidas.`)) finalizarSimulado(); }}
                style={{ flex: 2, background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px", padding: "11px", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)" }}>
                Finalizar simulado 🏆
              </button>
            )}
          </div>

          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px" }}>Navegação rápida</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {questoes.map((_, i) => (
                <button key={i} onClick={() => { setQuestaoAtual(i); setRespostaSelecionada(respostas[i]); }}
                  style={{ width: "32px", height: "32px", borderRadius: "6px", border: `1px solid ${i === questaoAtual ? "#3b82f6" : respostas[i] !== null ? "rgba(34,197,94,0.4)" : "#374151"}`, background: i === questaoAtual ? "rgba(59,130,246,0.12)" : respostas[i] !== null ? "rgba(34,197,94,0.12)" : "#0b0f1a", color: i === questaoAtual ? "#3b82f6" : respostas[i] !== null ? "#22c55e" : "#9ca3af", fontSize: "11px", cursor: "pointer", fontWeight: i === questaoAtual ? "bold" : "normal" }}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "11px", color: "#9ca3af" }}>
              <span>⬜ Não respondida</span>
              <span style={{ color: "#22c55e" }}>🟩 Respondida</span>
              <span style={{ color: "#3b82f6" }}>🟦 Atual</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // RESULTADO
  if (estado === "resultado") {
    const porCapitulo = distribuicao.map(d => {
      const questoesCap = questoes.filter(q => q.capitulo === d.capitulo);
      const acertosCap = questoesCap.filter((q) => {
        const idx = questoes.indexOf(q);
        return respostas[idx] === q.correta;
      }).length;
      return { ...d, acertos: acertosCap, total: questoesCap.length, pct: questoesCap.length > 0 ? Math.round((acertosCap / questoesCap.length) * 100) : 0 };
    });

    return (
      <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem" }}>

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{aprovado ? "🏆" : "💪"}</div>
            <h1 style={{ fontSize: "2rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.5rem" }}>
              {aprovado ? "Aprovado!" : "Continue praticando!"}
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>
              {aprovado ? "Você está pronto para o exame CTFL! 🎓" : `Você precisa de ${26 - acertos} acertos a mais para passar.`}
            </p>
          </div>

          <div style={{ background: "#111827", border: `2px solid ${aprovado ? "#22c55e" : "#3b82f6"}`, borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: aprovado ? "#22c55e" : "#ef4444" }}>{pct}%</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>aproveitamento</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#e5e7eb" }}>{acertos}/40</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>acertos</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#d4af37" }}>+{aprovado ? 500 : acertos * 10}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>XP ganho</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>
                {formatarTempo(TEMPO_MINUTOS * 60 - tempoRestante)}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>tempo usado</div>
            </div>
          </div>

          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "1rem", fontWeight: "bold" }}>Resultado por capítulo</div>
            {porCapitulo.map((c, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", color: "#e5e7eb" }}>Cap. {c.capitulo} — {c.titulo}</span>
                  <span style={{ fontSize: "13px", color: c.pct >= 65 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
                    {c.acertos}/{c.total} ({c.pct}%)
                  </span>
                </div>
                <div style={{ background: "#1f2937", borderRadius: "99px", height: "5px" }}>
                  <div style={{ background: c.pct >= 65 ? "#22c55e" : "#ef4444", width: `${c.pct}%`, height: "5px", borderRadius: "99px", transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setEstado("revisao")}
            style={{ width: "100%", background: "transparent", border: "1px solid #374151", borderRadius: "10px", padding: "12px", color: "#9ca3af", fontSize: "14px", cursor: "pointer", marginBottom: "10px", transition: "border-color 0.15s, color 0.15s" }}>
            Revisar questões e gabaritos
          </button>

          {aprovado ? (
            <a href="https://bstqb.qa/credito-exame" target="_blank" rel="noopener noreferrer"
              style={{ display: "block", width: "100%", background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "10px", padding: "14px", color: "#ffffff", fontSize: "15px", fontWeight: "600", cursor: "pointer", textAlign: "center", textDecoration: "none", boxSizing: "border-box", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.18)" }}>
              Agendar o exame real na BSTQB →
            </a>
          ) : (
            <button onClick={() => setEstado("intro")}
              style={{ width: "100%", background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "10px", padding: "14px", color: "#ffffff", fontSize: "15px", fontWeight: "600", cursor: "pointer", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.18)" }}>
              Tentar novamente
            </button>
          )}

          <a href="/dashboard" style={{ display: "block", textAlign: "center", marginTop: "1rem", color: "#9ca3af", fontSize: "13px", textDecoration: "none" }}>
            Voltar ao dashboard
          </a>
        </div>
      </main>
    );
  }

  // REVISAO
  if (estado === "revisao") {
    const q = revisaoIdx !== null ? questoes[revisaoIdx] : null;
    const r = revisaoIdx !== null ? respostas[revisaoIdx] : null;

    return (
      <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <button onClick={() => { setRevisaoIdx(null); setEstado("resultado"); }}
              style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "6px 14px", color: "#9ca3af", fontSize: "13px", cursor: "pointer", transition: "border-color 0.15s, color 0.15s" }}>
              ← Voltar ao resultado
            </button>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>
              {acertos}/40 acertos · {pct}%
            </span>
          </div>

          {revisaoIdx === null ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "8px" }}>Clique em uma questão para ver o gabarito:</div>
              {questoes.map((q, i) => {
                const acertou = respostas[i] === q.correta;
                const respondeu = respostas[i] !== null;
                return (
                  <button key={i} onClick={() => setRevisaoIdx(i)}
                    style={{ background: "#111827", border: `1px solid ${acertou ? "rgba(34,197,94,0.4)" : respondeu ? "rgba(239,68,68,0.4)" : "#1f2937"}`, borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: acertou ? "rgba(34,197,94,0.12)" : respondeu ? "rgba(239,68,68,0.12)" : "#1f2937", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, color: acertou ? "#22c55e" : respondeu ? "#ef4444" : "#9ca3af" }}>
                      {acertou ? "✓" : respondeu ? "✗" : i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", color: "#e5e7eb", marginBottom: "2px" }}>
                        Q{i + 1} · Cap. {q.capitulo} · {q.conceito}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "500px" }}>
                        {q.pergunta}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : q && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <button onClick={() => setRevisaoIdx(null)}
                  style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "6px 14px", color: "#9ca3af", fontSize: "13px", cursor: "pointer" }}>
                  ← Lista
                </button>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => setRevisaoIdx(Math.max(0, revisaoIdx - 1))} disabled={revisaoIdx === 0}
                    style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "6px 12px", color: "#9ca3af", fontSize: "13px", cursor: "pointer", opacity: revisaoIdx === 0 ? 0.4 : 1 }}>
                    ‹
                  </button>
                  <span style={{ fontSize: "13px", color: "#9ca3af", padding: "6px 12px" }}>{revisaoIdx + 1}/{questoes.length}</span>
                  <button onClick={() => setRevisaoIdx(Math.min(questoes.length - 1, revisaoIdx + 1))} disabled={revisaoIdx === questoes.length - 1}
                    style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "6px 12px", color: "#9ca3af", fontSize: "13px", cursor: "pointer", opacity: revisaoIdx === questoes.length - 1 ? 0.4 : 1 }}>
                    ›
                  </button>
                </div>
              </div>

              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "8px" }}>Cap. {q.capitulo} · {q.conceito}</div>
                <p style={{ color: "#e5e7eb", fontSize: "16px", lineHeight: 1.7, margin: 0, fontFamily: "Georgia, serif" }}>{q.pergunta}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
                {q.opcoes.map((opcao, i) => {
                  const isCorreta = i === q.correta;
                  const isMinha = i === r;
                  const isErrada = isMinha && !isCorreta;
                  return (
                    <div key={i} style={{ background: isCorreta ? "rgba(34,197,94,0.08)" : isErrada ? "rgba(239,68,68,0.08)" : "#111827", border: `1px solid ${isCorreta ? "rgba(34,197,94,0.4)" : isErrada ? "rgba(239,68,68,0.4)" : "#1f2937"}`, borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: `1.5px solid ${isCorreta ? "#22c55e" : isErrada ? "#ef4444" : "#374151"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, color: isCorreta ? "#22c55e" : isErrada ? "#ef4444" : "#9ca3af", fontWeight: "bold" }}>
                        {isCorreta ? "✓" : isErrada ? "✗" : ["A", "B", "C", "D"][i]}
                      </span>
                      <span style={{ fontSize: "14px", color: isCorreta ? "#86efac" : isErrada ? "#fca5a5" : "#9ca3af" }}>{opcao}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: r === q.correta ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${r === q.correta ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`, borderRadius: "12px", padding: "1rem 1.25rem" }}>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: r === q.correta ? "#22c55e" : "#ef4444", marginBottom: "6px" }}>
                  {r === q.correta ? "✅ Correto!" : r === null ? "⚪ Não respondida" : "❌ Incorreta"}
                </div>
                <div style={{ fontSize: "13px", color: "#e5e7eb", lineHeight: 1.6 }}>{q.explicacao}</div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return null;
}
