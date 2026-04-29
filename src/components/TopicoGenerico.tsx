"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import mapaCaptulos from "@/data/mapa-capitulos";
import conteudoTopicos from "@/data/conteudo-topicos";

type Etapa = "carregando" | "narrativa" | "cards" | "video" | "simulado" | "conclusao";

type ConteudoGerado = {
  narrativa: { titulo: string; paragrafos: string[] };
  cards: { emoji: string; titulo: string; explicacao: string; exemplo: string }[];
  dicaPersonalizada: string;
};

type QuestaoGerada = {
  id?: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  conceito: string;
  dificuldade: "facil" | "medio" | "dificil" | "muito_dificil";
};

type PerfilUsuario = {
  nome: string;
  nivel: string;
  objetivo: string;
  pontos: number;
};

// URLs dos vídeos — preenche conforme você vai gravando
const videosTopicos: Record<string, string | null> = {
  "por-que-testar": "https://www.youtube.com/embed/GWs-BjMtcVc", "7-principios": null, "erro-defeito-falha": null,
  "atividades-e-papeis": null, "modelos-desenvolvimento": null, "niveis-teste": null,
  "tipos-teste": null, "teste-manutencao": null, "fundamentos-estatico": null,
  "processo-revisao": null, "analise-estatica": null, "particao-equivalencia": null,
  "analise-valor-limite": null, "tabela-decisao": null, "transicao-estado": null,
  "caixa-branca": null, "baseado-experiencia": null, "planejamento-teste": null,
  "monitoramento-controle": null, "gestao-risco": null, "gestao-defeitos": null,
  "ferramentas-suporte": null, "automacao-teste": null, "selecao-ferramenta": null,
};

function calcularEstatisticas(questoes: QuestaoGerada[], respostas: number[]) {
  const resultado = questoes.map((q, i) => ({
    conceito: q.conceito,
    acertou: respostas[i] === q.correta,
    dificuldade: q.dificuldade,
  }));
  const acertos = resultado.filter(r => r.acertou).length;
  const pct = questoes.length > 0 ? Math.round((acertos / questoes.length) * 100) : 0;
  const conceitosErrados = resultado.filter(r => !r.acertou).map(e => e.conceito);
  const xpGanho = acertos * 10 + (pct >= 80 ? 20 : pct >= 65 ? 10 : 0);
  return { acertos, total: questoes.length, pct, conceitosErrados, xpGanho, resultado };
}

export default function TopicoGenerico({
  params,
  numeroCapitulo,
}: {
  params: Promise<{ id: string }>;
  numeroCapitulo: number;
}) {
  const { id } = use(params);
  const capitulo = mapaCaptulos[numeroCapitulo];
  const topicoMeta = capitulo?.topicos.find(t => t.id === id);
  const conteudoFixo = conteudoTopicos[id];

  const [etapa, setEtapa] = useState<Etapa>("carregando");
  const [conteudo, setConteudo] = useState<ConteudoGerado | null>(null);
  const [questoes, setQuestoes] = useState<QuestaoGerada[]>([]);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cardAtual, setCardAtual] = useState(0);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [msgCarregando, setMsgCarregando] = useState("Preparando conteúdo...");
  const [temRevisao, setTemRevisao] = useState(0);

  useEffect(() => { inicializar(); }, [id]);

  const inicializar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    setUserId(user.id);

    const { data: perfilData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (perfilData) setPerfil(perfilData);

    // Carrega conteúdo fixo
    setMsgCarregando("Carregando conteúdo...");
    if (conteudoFixo) {
      const dica = perfilData?.nivel === "iniciante"
        ? `${conteudoFixo.dicaEstudo} Como iniciante, leia cada card com calma.`
        : perfilData?.nivel === "intermediario"
        ? `${conteudoFixo.dicaEstudo} Foque nas nuances que o exame explora.`
        : conteudoFixo.dicaEstudo;

      setConteudo({
        narrativa: conteudoFixo.narrativa,
        cards: conteudoFixo.cards,
        dicaPersonalizada: dica,
      });
    } else {
      // Fallback via API se não tiver conteúdo fixo
      try {
        const res = await fetch("/api/conteudo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicoId: id, perfil: perfilData, userId: user.id }),
        });
        const data = await res.json();
        setConteudo(data);
      } catch { console.error("Erro ao carregar conteúdo"); }
    }

    setEtapa("narrativa");
  };

  const iniciarSimulado = async () => {
    if (!perfil) return;
    setEtapa("carregando");
    setMsgCarregando("Preparando simulado...");

    try {
      const res = await fetch("/api/simulado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicoId: id, userId, nivel: perfil.nivel, quantidade: 4, modo: "normal" }),
      });
      const data = await res.json();
      setQuestoes(data.questoes || []);
      if (data.total_revisao > 0) setTemRevisao(data.total_revisao);
    } catch { console.error("Erro ao carregar simulado"); }

    setEtapa("simulado");
  };

  const confirmarResposta = async () => {
    if (respostaSelecionada === null) return;
    setRespostaConfirmada(true);
    const acertou = respostaSelecionada === questoes[questaoAtual].correta;
    if (acertou) setAcertos(a => a + 1);

    if (userId && questoes[questaoAtual].id) {
      fetch("/api/simulado", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, questaoId: questoes[questaoAtual].id,
          topicoId: id, acertou, dificuldade: questoes[questaoAtual].dificuldade,
        }),
      }).catch(() => {});
    }
  };

  const proximaQuestao = async () => {
    const novasRespostas = [...respostas, respostaSelecionada!];
    setRespostas(novasRespostas);

    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(q => q + 1);
      setRespostaSelecionada(null);
      setRespostaConfirmada(false);
    } else {
      await salvarResultado(novasRespostas);
      setEtapa("conclusao");
    }
  };

  const salvarResultado = async (todasRespostas: number[]) => {
    if (!userId || questoes.length === 0) return;
    const stats = calcularEstatisticas(questoes, todasRespostas);

    await supabase.from("progresso_topicos").upsert({
      user_id: userId, capitulo: numeroCapitulo, topico_id: id,
      acertos: stats.acertos, total: stats.total, xp_ganho: stats.xpGanho,
      concluido: true, atualizado_em: new Date().toISOString(),
    });

    const registros = stats.resultado.map(r => ({
      user_id: userId, topico_id: id, conceito: r.conceito,
      acertou: r.acertou, dificuldade: r.dificuldade, criado_em: new Date().toISOString(),
    }));
    if (registros.length > 0) {
      await supabase.from("historico_conceitos").insert(registros);
    }

    const { data: pa } = await supabase.from("profiles").select("pontos, streak, maior_streak").eq("id", userId).single();
    if (pa) {
      const hoje = new Date().toISOString().split("T")[0];
      const novoStreak = (pa.streak || 0) + 1;
      await supabase.from("profiles").update({
        pontos: (pa.pontos || 0) + stats.xpGanho,
        streak: novoStreak,
        maior_streak: Math.max(novoStreak, pa.maior_streak || 0),
        ultimo_estudo: hoje,
      }).eq("id", userId);
    }
  };

  // Estilos
  const cor = capitulo?.cor || "#c9a84c";
  const s = {
    main: { background: "#0a0a0f", minHeight: "100vh", color: "#f0ede8", fontFamily: "sans-serif" } as React.CSSProperties,
    inner: { maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem 4rem" } as React.CSSProperties,
    card: { background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "1.75rem", marginBottom: "1rem" } as React.CSSProperties,
    btn: { background: cor, border: "none", borderRadius: "10px", padding: "13px 28px", color: "#0a0a0f", fontSize: "15px", fontWeight: "bold" as const, cursor: "pointer", width: "100%", marginTop: "1.25rem" } as React.CSSProperties,
    btnSec: { background: "transparent", border: "1px solid #2e2e3e", borderRadius: "10px", padding: "11px 28px", color: "#a0998e", fontSize: "14px", cursor: "pointer", width: "100%", marginTop: "8px" } as React.CSSProperties,
  };

  const etapas = ["narrativa", "cards", "video", "simulado", "conclusao"];
  const progressoPct = etapa === "carregando" ? 0 : (etapas.indexOf(etapa) / (etapas.length - 1)) * 100;

  const renderNav = () => (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <a href={`/capitulo/${numeroCapitulo}`} style={{ color: "#5a5a6a", fontSize: "13px", textDecoration: "none" }}>
          ← Cap. {numeroCapitulo}
        </a>
        {perfil && <span style={{ fontSize: "12px", color: "#5a5a6a" }}>{perfil.nome?.split(" ")[0]} · ⭐ {perfil.pontos} XP</span>}
      </div>
      <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "5px", marginBottom: "1rem" }}>
        <div style={{ background: `linear-gradient(90deg, ${cor}, #e8d5a3)`, width: `${progressoPct}%`, height: "5px", borderRadius: "99px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[{ e: "narrativa", icon: "📖", label: "História" }, { e: "cards", icon: "🃏", label: "Conceitos" }, { e: "video", icon: "🎬", label: "Vídeo" }, { e: "simulado", icon: "🎯", label: "Simulado" }, { e: "conclusao", icon: "🏆", label: "Fim" }]
          .map(item => {
            const idx = etapas.indexOf(item.e);
            const atual = etapas.indexOf(etapa);
            return (
              <div key={item.e} style={{ textAlign: "center", opacity: idx <= atual ? 1 : 0.3 }}>
                <div style={{ fontSize: "1.1rem" }}>{idx < atual ? "✅" : item.icon}</div>
                <div style={{ fontSize: "10px", color: idx === atual ? cor : "#5a5a6a", marginTop: "2px" }}>{item.label}</div>
              </div>
            );
          })}
      </div>
    </div>
  );

  // ---- CARREGANDO ----
  if (etapa === "carregando") return (
    <main style={{ ...s.main, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
        <p style={{ color: cor, fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>{msgCarregando}</p>
      </div>
    </main>
  );

  if (!topicoMeta) return <main style={s.main}><div style={s.inner}><p style={{ color: "#c06060" }}>Tópico não encontrado.</p></div></main>;

  // ---- NARRATIVA ----
  if (etapa === "narrativa") return (
    <main style={s.main}><div style={s.inner}>
      {renderNav()}
      <div style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "12px", background: "#1a1a0e", color: cor, border: `1px solid ${cor}44`, padding: "3px 10px", borderRadius: "99px" }}>
          Cap. {numeroCapitulo} · +{topicoMeta.xp} XP
        </span>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", margin: "0.75rem 0 0.25rem" }}>
          {topicoMeta.titulo}
        </h1>
        <p style={{ color: "#7a7a8a", fontSize: "14px", margin: 0 }}>{topicoMeta.subtitulo}</p>
      </div>

      {conteudo ? (
        <>
          <div style={s.card}>
            <h2 style={{ fontSize: "1.15rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginTop: 0, marginBottom: "1.25rem" }}>
              {conteudo.narrativa.titulo}
            </h2>
            {conteudo.narrativa.paragrafos.map((p, i) => (
              <p key={i} style={{ color: "#c0bab0", lineHeight: 1.8, fontSize: "15px", margin: "0 0 1rem" }}>{p}</p>
            ))}
          </div>
          {conteudo.dicaPersonalizada && (
            <div style={{ background: "#1a1a0e", border: `1px solid ${cor}33`, borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>💡</span>
              <div style={{ fontSize: "13px", color: "#a09060", lineHeight: 1.6 }}>
                <strong style={{ color: cor }}>Dica de estudo:</strong> {conteudo.dicaPersonalizada}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ ...s.card, textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "#5a5a6a" }}>Carregando conteúdo...</p>
        </div>
      )}

      <button style={s.btn} onClick={() => setEtapa("cards")} disabled={!conteudo}>
        Entendi! Ver os conceitos →
      </button>
    </div></main>
  );

  // ---- CARDS ----
  if (etapa === "cards" && conteudo) {
    const card = conteudo.cards[cardAtual];
    return (
      <main style={s.main}><div style={s.inner}>
        {renderNav()}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Conceito {cardAtual + 1} de {conteudo.cards.length}</span>
          <span style={{ fontSize: "13px", color: cor }}>{Math.round(((cardAtual + 1) / conteudo.cards.length) * 100)}%</span>
        </div>
        <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", marginBottom: "1.5rem" }}>
          <div style={{ background: cor, width: `${((cardAtual + 1) / conteudo.cards.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
        </div>
        <div style={{ ...s.card, borderColor: "#2a2a3e" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{card.emoji}</div>
          <h2 style={{ fontSize: "1.1rem", fontFamily: "Georgia, serif", color: "#e8d5a3", fontWeight: "normal", marginTop: 0, marginBottom: "1rem" }}>{card.titulo}</h2>
          <p style={{ color: "#c0bab0", lineHeight: 1.8, fontSize: "15px", margin: "0 0 1.25rem" }}>{card.explicacao}</p>
          <div style={{ background: "#0a0a14", border: "1px solid #2e2e4e", borderRadius: "10px", padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: "11px", color: "#5a5a8a", marginBottom: "6px", fontWeight: "bold", letterSpacing: "0.05em" }}>EXEMPLO REAL</div>
            <p style={{ color: "#9090c0", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{card.exemplo}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {cardAtual > 0 && <button onClick={() => setCardAtual(c => c - 1)} style={{ ...s.btnSec, flex: 1, marginTop: 0 }}>← Anterior</button>}
          {cardAtual < conteudo.cards.length - 1
            ? <button onClick={() => setCardAtual(c => c + 1)} style={{ ...s.btn, flex: 2, marginTop: 0 }}>Próximo →</button>
            : <button onClick={() => setEtapa("video")} style={{ ...s.btn, flex: 2, marginTop: 0 }}>Ver o vídeo! 🎬</button>
          }
        </div>
      </div></main>
    );
  }

  // ---- VÍDEO ----
  if (etapa === "video") {
    const videoUrl = videosTopicos[id];
    return (
      <main style={s.main}><div style={s.inner}>
        {renderNav()}
        <h2 style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
          Videoaula — {topicoMeta.titulo}
        </h2>
        <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.5rem" }}>Reforça o que você aprendeu antes do simulado.</p>
        {videoUrl ? (
          <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem", aspectRatio: "16/9" }}>
            <iframe src={videoUrl} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
          </div>
        ) : (
          <div style={{ ...s.card, textAlign: "center", padding: "3rem 2rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
            <h3 style={{ color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "1.1rem", marginBottom: "0.5rem" }}>Vídeo em produção...</h3>
            <p style={{ color: "#5a5a6a", fontSize: "13px", lineHeight: 1.6, maxWidth: "340px", margin: "0 auto" }}>
              O vídeo sobre <strong style={{ color: "#7a7a8a" }}>{topicoMeta.titulo}</strong> será adicionado em breve.
            </p>
          </div>
        )}

        {temRevisao > 0 && (
          <div style={{ background: "#1a0e0e", border: "1px solid #5e2e2e", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.3rem" }}>📌</span>
            <div>
              <div style={{ fontSize: "13px", color: "#c06060", fontWeight: "bold" }}>Você tem {temRevisao} questão(ões) pendente(s) de revisão!</div>
              <div style={{ fontSize: "12px", color: "#7a4a4a" }}>Quer revisar primeiro antes do novo simulado?</div>
            </div>
          </div>
        )}

        <button style={s.btn} onClick={iniciarSimulado}>Ir pro simulado! 🎯</button>
        <button style={s.btnSec} onClick={iniciarSimulado}>Pular vídeo</button>
      </div></main>
    );
  }

  // ---- SIMULADO ----
  if (etapa === "simulado") {
    if (questoes.length === 0) return (
      <main style={{ ...s.main, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎯</div>
          <p style={{ color: cor, fontFamily: "Georgia, serif" }}>Preparando simulado...</p>
        </div>
      </main>
    );

    const questao = questoes[questaoAtual];
    const dificuldadeCor = questao.dificuldade === "facil" ? "#4e9e4e" : questao.dificuldade === "medio" ? "#c9a84c" : questao.dificuldade === "dificil" ? "#c08030" : "#c06060";

    return (
      <main style={s.main}><div style={s.inner}>
        {renderNav()}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Questão {questaoAtual + 1}/{questoes.length}</span>
            <span style={{ fontSize: "11px", color: dificuldadeCor, border: `1px solid ${dificuldadeCor}44`, padding: "1px 7px", borderRadius: "99px" }}>
              {questao.dificuldade}
            </span>
          </div>
          <span style={{ fontSize: "13px", color: cor }}>⭐ {acertos * 10} pts</span>
        </div>
        <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", marginBottom: "1.5rem" }}>
          <div style={{ background: cor, width: `${((questaoAtual + 1) / questoes.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
        </div>

        <div style={{ ...s.card, marginBottom: "8px" }}>
          <div style={{ fontSize: "11px", color: "#5a5a6a", marginBottom: "8px" }}>Conceito: {questao.conceito}</div>
          <p style={{ color: "#e8d5a3", fontSize: "16px", lineHeight: 1.7, margin: 0, fontFamily: "Georgia, serif" }}>{questao.pergunta}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
          {questao.opcoes.map((opcao, i) => {
            let borderColor = "#1e1e2e", textoCor = "#c0bab0";
            if (respostaConfirmada) {
              if (i === questao.correta) { borderColor = "#2e5e2e"; textoCor = "#6ec06e"; }
              else if (i === respostaSelecionada) { borderColor = "#5e2e2e"; textoCor = "#c06060"; }
            } else if (respostaSelecionada === i) { borderColor = cor; textoCor = "#e8d5a3"; }
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
              {respostaSelecionada === questao.correta ? "✅ Correto!" : "❌ Não dessa vez..."}
            </div>
            <div style={{ fontSize: "13px", color: "#a0a090", lineHeight: 1.6 }}>{questao.explicacao}</div>
          </div>
        )}

        {!respostaConfirmada
          ? <button onClick={confirmarResposta} disabled={respostaSelecionada === null} style={{ ...s.btn, opacity: respostaSelecionada === null ? 0.4 : 1 }}>Confirmar resposta</button>
          : <button onClick={proximaQuestao} style={s.btn}>{questaoAtual < questoes.length - 1 ? "Próxima →" : "Ver resultado! 🏆"}</button>
        }
      </div></main>
    );
  }

  // ---- CONCLUSÃO ----
  const stats = questoes.length > 0
    ? calcularEstatisticas(questoes, respostas)
    : { acertos: 0, total: 0, pct: 0, xpGanho: 0, conceitosErrados: [] };
  const aprovado = stats.pct >= 65;
  const idxAtual = capitulo.topicos.findIndex(t => t.id === id);
  const proximoTopico = capitulo.topicos[idxAtual + 1];

  return (
    <main style={s.main}><div style={s.inner}>
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{aprovado ? "🏆" : "💪"}</div>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
          {aprovado ? "Arrasou!" : "Quase lá!"}
        </h1>
        <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "2rem" }}>{topicoMeta.titulo}</p>

        <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          <div><div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e8d5a3" }}>{stats.acertos}/{stats.total}</div><div style={{ fontSize: "12px", color: "#5a5a6a" }}>acertos</div></div>
          <div><div style={{ fontSize: "2rem", fontWeight: "bold", color: stats.pct >= 65 ? "#6ec06e" : "#c06060" }}>{stats.pct}%</div><div style={{ fontSize: "12px", color: "#5a5a6a" }}>aproveitamento</div></div>
          <div><div style={{ fontSize: "2rem", fontWeight: "bold", color: cor }}>+{stats.xpGanho}</div><div style={{ fontSize: "12px", color: "#5a5a6a" }}>XP ganho</div></div>
        </div>

        {stats.conceitosErrados.length > 0 && (
          <div style={{ background: "#1a0e0e", border: "1px solid #3e1e1e", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", textAlign: "left" }}>
            <div style={{ fontSize: "13px", color: "#c06060", fontWeight: "bold", marginBottom: "6px" }}>📌 Revisão agendada para:</div>
            {stats.conceitosErrados.map((c, i) => <div key={i} style={{ fontSize: "12px", color: "#7a4a4a", marginTop: "3px" }}>• {c}</div>)}
          </div>
        )}

        {aprovado && proximoTopico && (
          <div style={{ background: "#1a1a0e", border: `1px solid ${cor}33`, borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", fontSize: "13px", color: "#a09060" }}>
            🎯 Próximo: <strong style={{ color: cor }}>{proximoTopico.titulo}</strong>
          </div>
        )}

        <a href={`/capitulo/${numeroCapitulo}`}
          style={{ background: cor, color: "#0a0a0f", padding: "13px 32px", borderRadius: "10px", fontWeight: "bold", fontSize: "15px", textDecoration: "none", display: "inline-block" }}>
          {aprovado ? "Continuar trilha →" : "Voltar ao capítulo"}
        </a>

        {!aprovado && (
          <button style={s.btnSec} onClick={() => window.location.href = `/capitulo/${numeroCapitulo}/topico/${id}`}>
            Tentar novamente
          </button>
        )}
      </div>
    </div></main>
  );
}