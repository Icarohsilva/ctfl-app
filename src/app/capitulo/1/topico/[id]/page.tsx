"use client";
import { useState, use } from "react";
import { supabase } from "@/lib/supabase";
import capitulo1, { Card, Questao } from "@/data/capitulo1";

type Etapa = "narrativa" | "cards" | "video" | "simulado" | "conclusao";

export default function TopicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const topico = capitulo1.topicos.find(t => t.id === id);

  const [etapa, setEtapa] = useState<Etapa>("narrativa");
  const [cardAtual, setCardAtual] = useState(0);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [questoesIA, setQuestoesIA] = useState<Questao[]>([]);
  const [usandoIA, setUsandoIA] = useState(false);
  const [salvando, setSalvando] = useState(false);

  if (!topico) return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#c9a84c" }}>Tópico não encontrado.</div>
    </main>
  );

  const etapas: Etapa[] = ["narrativa", "cards", "video", "simulado", "conclusao"];
  const progressoPct = (etapas.indexOf(etapa) / (etapas.length - 1)) * 100;
  const questoesAtivas = usandoIA && questoesIA.length > 0 ? questoesIA : topico.questoes;

  const salvarProgresso = async () => {
    setSalvando(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("progresso_topicos").upsert({
      user_id: user.id,
      capitulo: 1,
      topico_id: topico.id,
      acertos,
      total: questoesAtivas.length,
      xp_ganho: acertos * 10,
      concluido: true,
      atualizado_em: new Date().toISOString(),
    });

    // Atualiza XP total no perfil
    const { data: perfil } = await supabase.from("profiles").select("pontos").eq("id", user.id).single();
    if (perfil) {
      await supabase.from("profiles").update({ pontos: (perfil.pontos || 0) + (acertos * 10) }).eq("id", user.id);
    }
    setSalvando(false);
  };

  const gerarQuestoesIA = async () => {
    setCarregandoIA(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Você é um gerador de questões para certificação CTFL da ISTQB.
Gere 3 questões de múltipla escolha sobre o tópico solicitado.
Responda APENAS com JSON válido, sem markdown, sem texto fora do JSON.
Formato: [{"pergunta":"...","opcoes":["a","b","c","d"],"correta":0,"explicacao":"..."}]
correta é o índice (0-3) da opção correta.`,
          messages: [{
            role: "user",
            content: `Gere 3 questões CTFL sobre: "${topico.titulo}".
Conceitos cobertos: ${topico.cards.map(c => c.titulo).join(", ")}.
Nível: intermediário. Estilo ISTQB oficial.`
          }]
        })
      });
      const data = await res.json();
      const texto = data.content?.[0]?.text || "[]";
      const questoes = JSON.parse(texto.replace(/```json|```/g, "").trim());
      setQuestoesIA(questoes);
      setUsandoIA(true);
    } catch {
      // Usa questões padrão
    } finally {
      setCarregandoIA(false);
    }
  };

  const confirmarResposta = () => {
    if (respostaSelecionada === null) return;
    setRespostaConfirmada(true);
    if (respostaSelecionada === questoesAtivas[questaoAtual].correta) {
      setAcertos(a => a + 1);
    }
  };

  const proximaQuestao = () => {
    if (questaoAtual < questoesAtivas.length - 1) {
      setQuestaoAtual(q => q + 1);
      setRespostaSelecionada(null);
      setRespostaConfirmada(false);
    } else {
      salvarProgresso();
      setEtapa("conclusao");
    }
  };

  // -------------------------------------------------------
  // ESTILOS
  // -------------------------------------------------------
  const s = {
    main: { background: "#0a0a0f", minHeight: "100vh", color: "#f0ede8", fontFamily: "sans-serif" } as React.CSSProperties,
    inner: { maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem 4rem" } as React.CSSProperties,
    card: { background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "1.75rem", marginBottom: "1rem" } as React.CSSProperties,
    btn: { background: "#c9a84c", border: "none", borderRadius: "10px", padding: "13px 28px", color: "#0a0a0f", fontSize: "15px", fontWeight: "bold" as const, cursor: "pointer", width: "100%", marginTop: "1.25rem" } as React.CSSProperties,
    btnSec: { background: "transparent", border: "1px solid #2e2e3e", borderRadius: "10px", padding: "11px 28px", color: "#a0998e", fontSize: "14px", cursor: "pointer", width: "100%", marginTop: "8px" } as React.CSSProperties,
  };

  // -------------------------------------------------------
  // BARRA DE PROGRESSO
  // -------------------------------------------------------
  const renderNav = () => (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <a href={`/capitulo/1`} style={{ color: "#5a5a6a", fontSize: "13px", textDecoration: "none" }}>← Cap. 1</a>
        <span style={{ fontSize: "12px", color: "#5a5a6a" }}>Tópico {topico.numero}/{capitulo1.topicos.length}</span>
      </div>
      <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "5px", marginBottom: "1rem" }}>
        <div style={{ background: "linear-gradient(90deg,#c9a84c,#e8d5a3)", width: `${progressoPct}%`, height: "5px", borderRadius: "99px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[
          { e: "narrativa", icon: "📖", label: "História" },
          { e: "cards", icon: "🃏", label: "Conceitos" },
          { e: "video", icon: "🎬", label: "Vídeo" },
          { e: "simulado", icon: "🎯", label: "Simulado" },
          { e: "conclusao", icon: "🏆", label: "Fim" },
        ].map(item => {
          const idx = etapas.indexOf(item.e as Etapa);
          const atual = etapas.indexOf(etapa);
          return (
            <div key={item.e} style={{ textAlign: "center", opacity: idx <= atual ? 1 : 0.3 }}>
              <div style={{ fontSize: "1.1rem" }}>{idx < atual ? "✅" : item.icon}</div>
              <div style={{ fontSize: "10px", color: idx === atual ? "#c9a84c" : "#5a5a6a", marginTop: "2px" }}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // -------------------------------------------------------
  // ETAPA 1 — NARRATIVA
  // -------------------------------------------------------
  if (etapa === "narrativa") return (
    <main style={s.main}><div style={s.inner}>
      {renderNav()}
      <div style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "12px", background: "#1a1a0e", color: "#c9a84c", border: "1px solid #c9a84c44", padding: "3px 10px", borderRadius: "99px" }}>
          +{topico.xp} XP
        </span>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", margin: "0.75rem 0 0.25rem" }}>
          {topico.titulo}
        </h1>
        <p style={{ color: "#7a7a8a", fontSize: "14px", margin: 0 }}>{topico.subtitulo}</p>
      </div>
      <div style={s.card}>
        <h2 style={{ fontSize: "1.15rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginTop: 0, marginBottom: "1.25rem" }}>
          {topico.narrativa.titulo}
        </h2>
        {topico.narrativa.paragrafos.map((p, i) => (
          <p key={i} style={{ color: "#c0bab0", lineHeight: 1.8, fontSize: "15px", margin: "0 0 1rem" }}>{p}</p>
        ))}
      </div>
      <div style={{ background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", gap: "10px", alignItems: "center" }}>
        <span style={{ fontSize: "1.3rem" }}>💡</span>
        <div style={{ fontSize: "13px", color: "#a09060", lineHeight: 1.5 }}>
          Este tópico tem <strong style={{ color: "#c9a84c" }}>{topico.cards.length} conceitos</strong> e {topico.questoes.length} questões de simulado.
        </div>
      </div>
      <button style={s.btn} onClick={() => setEtapa("cards")}>Entendi! Ver os conceitos →</button>
    </div></main>
  );

  // -------------------------------------------------------
  // ETAPA 2 — CARDS
  // -------------------------------------------------------
  if (etapa === "cards") {
    const card = topico.cards[cardAtual];
    return (
      <main style={s.main}><div style={s.inner}>
        {renderNav()}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Conceito {cardAtual + 1} de {topico.cards.length}</span>
          <span style={{ fontSize: "13px", color: "#c9a84c" }}>{Math.round(((cardAtual + 1) / topico.cards.length) * 100)}%</span>
        </div>
        <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", marginBottom: "1.5rem" }}>
          <div style={{ background: "#c9a84c", width: `${((cardAtual + 1) / topico.cards.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
        </div>
        <div style={{ ...s.card, borderColor: "#2a2a3e" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{card.emoji}</div>
          <h2 style={{ fontSize: "1.1rem", fontFamily: "Georgia, serif", color: "#e8d5a3", fontWeight: "normal", marginTop: 0, marginBottom: "1rem" }}>
            {card.titulo}
          </h2>
          <p style={{ color: "#c0bab0", lineHeight: 1.8, fontSize: "15px", margin: "0 0 1.25rem" }}>{card.explicacao}</p>
          <div style={{ background: "#0a0a14", border: "1px solid #2e2e4e", borderRadius: "10px", padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: "11px", color: "#5a5a8a", marginBottom: "6px", fontWeight: "bold", letterSpacing: "0.05em" }}>EXEMPLO REAL</div>
            <p style={{ color: "#9090c0", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{card.exemplo}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {cardAtual > 0 && (
            <button onClick={() => setCardAtual(c => c - 1)} style={{ ...s.btnSec, flex: 1, marginTop: 0 }}>← Anterior</button>
          )}
          {cardAtual < topico.cards.length - 1 ? (
            <button onClick={() => setCardAtual(c => c + 1)} style={{ ...s.btn, flex: 2, marginTop: 0 }}>Próximo →</button>
          ) : (
            <button onClick={() => setEtapa("video")} style={{ ...s.btn, flex: 2, marginTop: 0 }}>Ver o vídeo! 🎬</button>
          )}
        </div>
      </div></main>
    );
  }

  // -------------------------------------------------------
  // ETAPA 3 — VÍDEO
  // -------------------------------------------------------
  if (etapa === "video") return (
    <main style={s.main}><div style={s.inner}>
      {renderNav()}
      <h2 style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
        {topico.video.titulo}
      </h2>
      <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.5rem" }}>{topico.video.descricao}</p>
      {topico.video.url ? (
        <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem", aspectRatio: "16/9" }}>
          <iframe src={topico.video.url} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
        </div>
      ) : (
        <div style={{ ...s.card, textAlign: "center", padding: "3rem 2rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
          <h3 style={{ color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            Vídeo em produção...
          </h3>
          <p style={{ color: "#5a5a6a", fontSize: "13px", lineHeight: 1.6, maxWidth: "340px", margin: "0 auto 1rem" }}>
            O vídeo sobre <strong style={{ color: "#7a7a8a" }}>{topico.titulo}</strong> será adicionado em breve.
          </p>
          <span style={{ fontSize: "12px", color: "#c9a84c", background: "#1a1a0e", border: "1px solid #c9a84c33", padding: "4px 12px", borderRadius: "99px" }}>
            ⏱ {topico.video.duracao}
          </span>
        </div>
      )}
      <button style={s.btn} onClick={() => { gerarQuestoesIA(); setEtapa("simulado"); }}>
        Ir pro simulado! 🎯
      </button>
      <button style={s.btnSec} onClick={() => setEtapa("simulado")}>
        Pular vídeo
      </button>
    </div></main>
  );

  // -------------------------------------------------------
  // ETAPA 4 — SIMULADO
  // -------------------------------------------------------
  if (etapa === "simulado") {
    if (carregandoIA) return (
      <main style={{ ...s.main, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🤖</div>
          <p style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>Gerando questões com IA...</p>
          <p style={{ color: "#5a5a6a", fontSize: "13px" }}>Criando perguntas inéditas sobre {topico.titulo}</p>
        </div>
      </main>
    );

    const questao = questoesAtivas[questaoAtual];
    return (
      <main style={s.main}><div style={s.inner}>
        {renderNav()}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Questão {questaoAtual + 1} de {questoesAtivas.length}</span>
            {usandoIA && <span style={{ fontSize: "11px", background: "#0a1a0e", color: "#4e9e4e", border: "1px solid #2e5e2e", padding: "2px 7px", borderRadius: "99px", marginLeft: "8px" }}>✨ IA</span>}
          </div>
          <span style={{ fontSize: "13px", color: "#c9a84c" }}>⭐ {acertos * 10} pts</span>
        </div>
        <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", marginBottom: "1.5rem" }}>
          <div style={{ background: "#c9a84c", width: `${((questaoAtual + 1) / questoesAtivas.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
        </div>
        <div style={s.card}>
          <p style={{ color: "#e8d5a3", fontSize: "16px", lineHeight: 1.7, margin: 0, fontFamily: "Georgia, serif" }}>
            {questao.pergunta}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
          {questao.opcoes.map((opcao, i) => {
            let borderColor = "#1e1e2e";
            let textoCor = "#c0bab0";
            if (respostaConfirmada) {
              if (i === questao.correta) { borderColor = "#2e5e2e"; textoCor = "#6ec06e"; }
              else if (i === respostaSelecionada) { borderColor = "#5e2e2e"; textoCor = "#c06060"; }
            } else if (respostaSelecionada === i) {
              borderColor = "#c9a84c"; textoCor = "#e8d5a3";
            }
            return (
              <button key={i} disabled={respostaConfirmada} onClick={() => setRespostaSelecionada(i)}
                style={{ background: "#0f0f18", border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "14px 16px", color: textoCor, fontSize: "14px", textAlign: "left", cursor: respostaConfirmada ? "default" : "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s", lineHeight: 1.5 }}>
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", border: `1.5px solid ${textoCor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, fontWeight: "bold" }}>
                  {respostaConfirmada && i === questao.correta ? "✓" : respostaConfirmada && i === respostaSelecionada && i !== questao.correta ? "✗" : ["A", "B", "C", "D"][i]}
                </span>
                {opcao}
              </button>
            );
          })}
        </div>
        {respostaConfirmada && (
          <div style={{ background: respostaSelecionada === questao.correta ? "#0e2e0e" : "#2e0e0e", border: `1px solid ${respostaSelecionada === questao.correta ? "#2e5e2e" : "#5e2e2e"}`, borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
            <div style={{ fontWeight: "bold", color: respostaSelecionada === questao.correta ? "#6ec06e" : "#c06060", marginBottom: "6px", fontSize: "14px" }}>
              {respostaSelecionada === questao.correta ? "✅ Correto! Muito bem!" : "❌ Não dessa vez..."}
            </div>
            <div style={{ fontSize: "13px", color: "#a0a090", lineHeight: 1.6 }}>{questao.explicacao}</div>
          </div>
        )}
        {!respostaConfirmada ? (
          <button onClick={confirmarResposta} disabled={respostaSelecionada === null}
            style={{ ...s.btn, opacity: respostaSelecionada === null ? 0.4 : 1 }}>
            Confirmar resposta
          </button>
        ) : (
          <button onClick={proximaQuestao} style={s.btn}>
            {questaoAtual < questoesAtivas.length - 1 ? "Próxima questão →" : salvando ? "Salvando..." : "Ver resultado! 🏆"}
          </button>
        )}
      </div></main>
    );
  }

  // -------------------------------------------------------
  // ETAPA 5 — CONCLUSÃO
  // -------------------------------------------------------
  const total = questoesAtivas.length;
  const pct = Math.round((acertos / total) * 100);
  const aprovado = pct >= 65;
  const proximoTopico = capitulo1.topicos[topico.numero]; // próximo pelo índice

  return (
    <main style={s.main}><div style={s.inner}>
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{aprovado ? "🏆" : "💪"}</div>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
          {aprovado ? "Tópico concluído!" : "Continue praticando!"}
        </h1>
        <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "2rem" }}>
          {topico.titulo}
        </p>
        <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e8d5a3" }}>{acertos}/{total}</div>
            <div style={{ fontSize: "12px", color: "#5a5a6a" }}>acertos</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: pct >= 65 ? "#6ec06e" : "#c06060" }}>{pct}%</div>
            <div style={{ fontSize: "12px", color: "#5a5a6a" }}>aproveitamento</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#c9a84c" }}>+{acertos * 10}</div>
            <div style={{ fontSize: "12px", color: "#5a5a6a" }}>XP ganho</div>
          </div>
        </div>

        {aprovado && proximoTopico && (
          <div style={{ background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", fontSize: "13px", color: "#a09060", lineHeight: 1.6 }}>
            🎓 Próximo tópico: <strong style={{ color: "#c9a84c" }}>{proximoTopico.titulo}</strong>
          </div>
        )}

        {aprovado ? (
          <a href={`/capitulo/1`}
            style={{ background: "#c9a84c", color: "#0a0a0f", padding: "13px 32px", borderRadius: "10px", fontWeight: "bold", fontSize: "15px", textDecoration: "none", display: "inline-block" }}>
            {proximoTopico ? "Próximo tópico →" : "Ver capítulo completo →"}
          </a>
        ) : (
          <>
            <button style={s.btn} onClick={() => window.location.href = `/capitulo/1/topico/${topico.id}`}>
              Revisar tópico do início
            </button>
            <a href="/capitulo/1" style={{ ...s.btnSec, display: "block", textAlign: "center", textDecoration: "none" }}>
              Voltar ao capítulo
            </a>
          </>
        )}
      </div>
    </div></main>
  );
}