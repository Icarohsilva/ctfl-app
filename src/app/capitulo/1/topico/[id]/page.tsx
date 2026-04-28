"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";

// Mapa de todos os tópicos do CTFL
const mapaTopicos: Record<string, { capitulo: number; titulo: string; conceitos: string[] }> = {
  "por-que-testar": { capitulo: 1, titulo: "Por que testar?", conceitos: ["objetivos do teste", "custo de defeitos", "teste vs QA", "confiança no software", "conformidade regulatória"] },
  "7-principios": { capitulo: 1, titulo: "Os 7 Princípios do Teste", conceitos: ["teste mostra presença de defeitos", "teste exaustivo impossível", "teste antecipado", "agrupamento de defeitos", "paradoxo do pesticida", "teste depende do contexto", "ausência de erros é ilusão"] },
  "erro-defeito-falha": { capitulo: 1, titulo: "Erro, Defeito e Falha", conceitos: ["erro como ação humana", "defeito no artefato", "falha em execução", "cadeia erro-defeito-falha", "como reportar"] },
  "atividades-e-papeis": { capitulo: 1, titulo: "Atividades e Papéis no Teste", conceitos: ["planejamento", "análise", "modelagem", "implementação", "execução", "conclusão", "analista de teste", "testador"] },
  "modelos-desenvolvimento": { capitulo: 2, titulo: "Modelos de Desenvolvimento", conceitos: ["cascata", "V-Model", "iterativo", "incremental", "ágil", "Scrum", "DevOps", "shift-left"] },
  "niveis-teste": { capitulo: 2, titulo: "Níveis de Teste", conceitos: ["teste de componente", "teste de integração", "teste de sistema", "teste de aceite"] },
  "tipos-teste": { capitulo: 2, titulo: "Tipos de Teste", conceitos: ["teste funcional", "teste não-funcional", "caixa-branca", "teste de confirmação", "teste de regressão"] },
  "teste-manutencao": { capitulo: 2, titulo: "Teste de Manutenção", conceitos: ["análise de impacto", "teste de regressão em manutenção", "triggers de manutenção"] },
  "fundamentos-estatico": { capitulo: 3, titulo: "Fundamentos do Teste Estático", conceitos: ["teste estático vs dinâmico", "tipos de artefatos revisáveis", "benefícios do teste estático"] },
  "processo-revisao": { capitulo: 3, titulo: "Processo de Revisão", conceitos: ["revisão informal", "walkthrough", "revisão técnica", "inspeção", "papéis na revisão", "fatores de sucesso"] },
  "analise-estatica": { capitulo: 3, titulo: "Análise Estática com Ferramentas", conceitos: ["linters", "análise de fluxo de dados", "métricas de código", "verificação de padrões"] },
  "particao-equivalencia": { capitulo: 4, titulo: "Partição de Equivalência", conceitos: ["partições válidas e inválidas", "partições de valor único", "cobertura de EP"] },
  "analise-valor-limite": { capitulo: 4, titulo: "Análise de Valor Limite", conceitos: ["BVA de 2 valores", "BVA de 3 valores", "limites mínimo e máximo", "cobertura de BVA"] },
  "tabela-decisao": { capitulo: 4, titulo: "Teste de Tabela de Decisão", conceitos: ["condições e ações", "regras de decisão", "cobertura de tabela de decisão"] },
  "transicao-estado": { capitulo: 4, titulo: "Teste de Transição de Estado", conceitos: ["diagrama de estados", "tabela de transição", "cobertura de estados", "cobertura de transições"] },
  "caixa-branca": { capitulo: 4, titulo: "Técnicas de Caixa-Branca", conceitos: ["cobertura de instrução", "cobertura de decisão", "critérios de cobertura"] },
  "baseado-experiencia": { capitulo: 4, titulo: "Técnicas Baseadas em Experiência", conceitos: ["suposição de erro", "teste exploratório", "sessões e charters", "teste baseado em checklist"] },
  "planejamento-teste": { capitulo: 5, titulo: "Planejamento do Teste", conceitos: ["propósito do plano de teste", "abordagem de teste", "critérios de entrada e saída", "estimativas"] },
  "monitoramento-controle": { capitulo: 5, titulo: "Monitoramento e Controle", conceitos: ["métricas de teste", "relatórios de progresso", "relatório de conclusão"] },
  "gestao-risco": { capitulo: 5, titulo: "Gestão de Risco no Teste", conceitos: ["risco de produto", "risco de projeto", "análise de risco", "teste baseado em risco"] },
  "gestao-defeitos": { capitulo: 5, titulo: "Gestão de Defeitos", conceitos: ["relatório de defeito", "ciclo de vida do defeito", "classificação de defeitos"] },
  "ferramentas-suporte": { capitulo: 6, titulo: "Ferramentas de Suporte ao Teste", conceitos: ["categorias de ferramentas", "ferramentas de gestão", "ferramentas de execução"] },
  "automacao-teste": { capitulo: 6, titulo: "Automação de Teste", conceitos: ["benefícios da automação", "riscos da automação", "ROI de automação", "quando automatizar"] },
  "selecao-ferramenta": { capitulo: 6, titulo: "Seleção e Introdução de Ferramentas", conceitos: ["critérios de seleção", "prova de conceito", "piloto de ferramenta"] },
};

// URLs dos vídeos — preenche conforme você vai gravando
const videosTopicos: Record<string, string | null> = {
  "por-que-testar": null,
  "7-principios": null,
  "erro-defeito-falha": null,
  "atividades-e-papeis": null,
  "modelos-desenvolvimento": null,
  "niveis-teste": null,
  "tipos-teste": null,
  "teste-manutencao": null,
  "fundamentos-estatico": null,
  "processo-revisao": null,
  "analise-estatica": null,
  "particao-equivalencia": null,
  "analise-valor-limite": null,
  "tabela-decisao": null,
  "transicao-estado": null,
  "caixa-branca": null,
  "baseado-experiencia": null,
  "planejamento-teste": null,
  "monitoramento-controle": null,
  "gestao-risco": null,
  "gestao-defeitos": null,
  "ferramentas-suporte": null,
  "automacao-teste": null,
  "selecao-ferramenta": null,
};

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
  errosAnteriores: string[];
  topicosFeitos: string[];
};

function calcularEstatisticas(questoes: QuestaoGerada[], respostas: number[]) {
  const resultado = questoes.map((q, i) => ({
    conceito: q.conceito,
    acertou: respostas[i] === q.correta,
    dificuldade: q.dificuldade,
  }));
  const acertos = resultado.filter(r => r.acertou).length;
  const erros = resultado.filter(r => !r.acertou);
  const pct = Math.round((acertos / questoes.length) * 100);
  const conceitosErrados = erros.map(e => e.conceito);
  const xpGanho = acertos * 10 + (pct >= 80 ? 20 : pct >= 65 ? 10 : 0);
  return { acertos, total: questoes.length, pct, conceitosErrados, xpGanho, resultado };
}

export default function TopicoAdaptativo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const topico = mapaTopicos[id];

  const [etapa, setEtapa] = useState<Etapa>("carregando");
  const [conteudo, setConteudo] = useState<ConteudoGerado | null>(null);
  const [questoes, setQuestoes] = useState<QuestaoGerada[]>([]);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [cardAtual, setCardAtual] = useState(0);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [msgCarregando, setMsgCarregando] = useState("Preparando seu conteúdo...");
  const [temRevisao, setTemRevisao] = useState(0);

  useEffect(() => { inicializar(); }, [id]);

  const inicializar = async () => {
    if (!topico) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: perfilData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!perfilData) return;

    setMsgCarregando("Analisando seu histórico...");
    const { data: historicoData } = await supabase
      .from("historico_conceitos")
      .select("*")
      .eq("user_id", user.id);

    const { data: topicosFeitos } = await supabase
      .from("progresso_topicos")
      .select("topico_id")
      .eq("user_id", user.id)
      .eq("concluido", true);

    const errosAnteriores = (historicoData || [])
      .filter((h: { acertou: boolean }) => !h.acertou)
      .map((h: { topico_id: string }) => h.topico_id);

    const perfilCompleto: PerfilUsuario = {
      nome: perfilData.nome,
      nivel: perfilData.nivel || "iniciante",
      objetivo: perfilData.objetivo || "8semanas",
      pontos: perfilData.pontos || 0,
      errosAnteriores,
      topicosFeitos: (topicosFeitos || []).map((t: { topico_id: string }) => t.topico_id),
    };
    setPerfil(perfilCompleto);

    setMsgCarregando(`Criando conteúdo personalizado para ${perfilData.nome.split(" ")[0]}...`);
    try {
      const res = await fetch("/api/conteudo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicoId: id, perfil: perfilCompleto, userId: user.id }),
      });
      const conteudoGerado = await res.json();
      setConteudo(conteudoGerado);
    } catch {
      console.error("Erro ao gerar conteúdo");
    }
    setEtapa("narrativa");
  };

  const iniciarSimulado = async () => {
    if (!perfil || !topico) return;
    setEtapa("carregando");
    setMsgCarregando("Preparando seu simulado...");

    const { data: { user } } = await supabase.auth.getUser();

    try {
      const res = await fetch("/api/simulado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicoId: id,
          userId: user?.id,
          nivel: perfil.nivel,
          quantidade: 4,
          modo: "normal",
        }),
      });
      const data = await res.json();
      setQuestoes(data.questoes || []);
      if (data.total_revisao > 0) {
        setTemRevisao(data.total_revisao);
      }
    } catch (error) {
      console.error("Erro ao carregar simulado:", error);
    }
    setEtapa("simulado");
  };

  const confirmarResposta = async () => {
    if (respostaSelecionada === null) return;
    setRespostaConfirmada(true);
    const acertou = respostaSelecionada === questoes[questaoAtual].correta;
    if (acertou) setAcertos(a => a + 1);

    // Salva resultado no banco de questões e fila de revisão
    const { data: { user } } = await supabase.auth.getUser();
    if (user && questoes[questaoAtual].id) {
      fetch("/api/simulado", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          questaoId: questoes[questaoAtual].id,
          topicoId: id,
          acertou,
          dificuldade: questoes[questaoAtual].dificuldade,
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || questoes.length === 0) return;

    const stats = calcularEstatisticas(questoes, todasRespostas);

    await supabase.from("progresso_topicos").upsert({
      user_id: user.id,
      capitulo: topico?.capitulo,
      topico_id: id,
      acertos: stats.acertos,
      total: stats.total,
      xp_ganho: stats.xpGanho,
      concluido: true,
      atualizado_em: new Date().toISOString(),
    });

    const registros = stats.resultado.map(r => ({
      user_id: user.id,
      topico_id: id,
      conceito: r.conceito,
      acertou: r.acertou,
      dificuldade: r.dificuldade,
      criado_em: new Date().toISOString(),
    }));
    if (registros.length > 0) {
      await supabase.from("historico_conceitos").insert(registros);
    }

    const { data: perfilAtual } = await supabase
      .from("profiles").select("pontos, streak, maior_streak").eq("id", user.id).single();
    if (perfilAtual) {
      const hoje = new Date().toISOString().split("T")[0];
      const novoStreak = (perfilAtual.streak || 0) + 1;
      const maiorStreak = Math.max(novoStreak, perfilAtual.maior_streak || 0);
      await supabase.from("profiles").update({
        pontos: (perfilAtual.pontos || 0) + stats.xpGanho,
        streak: novoStreak,
        maior_streak: maiorStreak,
        ultimo_estudo: hoje,
      }).eq("id", user.id);
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

  const etapas = ["narrativa", "cards", "video", "simulado", "conclusao"];
  const progressoPct = etapa === "carregando" ? 0 : (etapas.indexOf(etapa) / (etapas.length - 1)) * 100;

  const renderNav = () => (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <a href={`/capitulo/${topico?.capitulo}`} style={{ color: "#5a5a6a", fontSize: "13px", textDecoration: "none" }}>
          ← Cap. {topico?.capitulo}
        </a>
        {perfil && <span style={{ fontSize: "12px", color: "#5a5a6a" }}>{perfil.nome.split(" ")[0]} · ⭐ {perfil.pontos} XP</span>}
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
          const idx = etapas.indexOf(item.e);
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
  // CARREGANDO
  // -------------------------------------------------------
  if (etapa === "carregando") return (
    <main style={{ ...s.main, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "300px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
        <p style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          {msgCarregando}
        </p>
        <p style={{ color: "#3a3a4a", fontSize: "12px" }}>
          A IA está personalizando o conteúdo para o seu perfil
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "1.5rem" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c9a84c", opacity: 0.3 + i * 0.35 }} />
          ))}
        </div>
      </div>
    </main>
  );

  if (!topico) return (
    <main style={s.main}><div style={s.inner}>
      <p style={{ color: "#c06060" }}>Tópico não encontrado.</p>
    </div></main>
  );

  // -------------------------------------------------------
  // NARRATIVA
  // -------------------------------------------------------
  if (etapa === "narrativa") return (
    <main style={s.main}><div style={s.inner}>
      {renderNav()}
      <div style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "12px", background: "#1a1a0e", color: "#c9a84c", border: "1px solid #c9a84c44", padding: "3px 10px", borderRadius: "99px" }}>
          Cap. {topico.capitulo} · IA personalizada
        </span>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", margin: "0.75rem 0 0.25rem" }}>
          {topico.titulo}
        </h1>
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
            <div style={{ background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>💡</span>
              <div style={{ fontSize: "13px", color: "#a09060", lineHeight: 1.6 }}>
                <strong style={{ color: "#c9a84c" }}>Dica para você:</strong> {conteudo.dicaPersonalizada}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ ...s.card, textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "#5a5a6a" }}>Não foi possível gerar o conteúdo. Tente novamente.</p>
          <button style={{ ...s.btn, marginTop: "1rem" }} onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      )}

      <button style={s.btn} onClick={() => setEtapa("cards")} disabled={!conteudo}>
        {conteudo ? "Entendi! Ver os conceitos →" : "Carregando..."}
      </button>
    </div></main>
  );

  // -------------------------------------------------------
  // CARDS
  // -------------------------------------------------------
  if (etapa === "cards" && conteudo) {
    const card = conteudo.cards[cardAtual];
    return (
      <main style={s.main}><div style={s.inner}>
        {renderNav()}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Conceito {cardAtual + 1} de {conteudo.cards.length}</span>
          <span style={{ fontSize: "13px", color: "#c9a84c" }}>{Math.round(((cardAtual + 1) / conteudo.cards.length) * 100)}%</span>
        </div>
        <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", marginBottom: "1.5rem" }}>
          <div style={{ background: "#c9a84c", width: `${((cardAtual + 1) / conteudo.cards.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
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

        {cardAtual === Math.floor(conteudo.cards.length / 2) && (
          <p style={{ textAlign: "center", fontSize: "13px", color: "#5a6a5a", marginBottom: "1rem" }}>⚡ Metade do caminho! Continue assim.</p>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          {cardAtual > 0 && (
            <button onClick={() => setCardAtual(c => c - 1)} style={{ ...s.btnSec, flex: 1, marginTop: 0 }}>← Anterior</button>
          )}
          {cardAtual < conteudo.cards.length - 1 ? (
            <button onClick={() => setCardAtual(c => c + 1)} style={{ ...s.btn, flex: 2, marginTop: 0 }}>Próximo →</button>
          ) : (
            <button onClick={() => setEtapa("video")} style={{ ...s.btn, flex: 2, marginTop: 0 }}>Ver o vídeo! 🎬</button>
          )}
        </div>
      </div></main>
    );
  }

  // -------------------------------------------------------
  // VÍDEO
  // -------------------------------------------------------
  if (etapa === "video") {
    const videoUrl = videosTopicos[id];
    return (
      <main style={s.main}><div style={s.inner}>
        {renderNav()}
        <h2 style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
          Videoaula — {topico.titulo}
        </h2>
        <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.5rem" }}>
          Reforça o que você aprendeu antes do simulado.
        </p>
        {videoUrl ? (
          <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem", aspectRatio: "16/9" }}>
            <iframe src={videoUrl} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
          </div>
        ) : (
          <div style={{ ...s.card, textAlign: "center", padding: "3rem 2rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
            <h3 style={{ color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Vídeo em produção...
            </h3>
            <p style={{ color: "#5a5a6a", fontSize: "13px", lineHeight: 1.6, maxWidth: "340px", margin: "0 auto" }}>
              O vídeo sobre <strong style={{ color: "#7a7a8a" }}>{topico.titulo}</strong> será adicionado em breve.
            </p>
          </div>
        )}
        <button style={s.btn} onClick={iniciarSimulado}>Ir pro simulado adaptativo! 🎯</button>
        <button style={s.btnSec} onClick={iniciarSimulado}>Pular vídeo</button>
      </div></main>
    );
  }

  // -------------------------------------------------------
  // SIMULADO
  // -------------------------------------------------------
  if (etapa === "simulado") {
    if (questoes.length === 0) return (
      <main style={{ ...s.main, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🤖</div>
          <p style={{ color: "#c9a84c", fontFamily: "Georgia, serif" }}>Gerando simulado adaptativo...</p>
          <p style={{ color: "#5a5a6a", fontSize: "13px" }}>Criando questões baseadas no seu histórico</p>
        </div>
      </main>
    );

    const questao = questoes[questaoAtual];
    const dificuldadeCor = questao.dificuldade === "facil" ? "#4e9e4e" : questao.dificuldade === "medio" ? "#c9a84c" : "#c06060";

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
          <span style={{ fontSize: "13px", color: "#c9a84c" }}>⭐ {acertos * 10} pts</span>
        </div>
        <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", marginBottom: "1.5rem" }}>
          <div style={{ background: "#c9a84c", width: `${((questaoAtual + 1) / questoes.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
        </div>

        <div style={{ ...s.card, marginBottom: "8px" }}>
          <div style={{ fontSize: "11px", color: "#5a5a6a", marginBottom: "8px" }}>Conceito: {questao.conceito}</div>
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
              {respostaSelecionada === questao.correta ? "✅ Correto!" : "❌ Não dessa vez..."}
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
            {questaoAtual < questoes.length - 1 ? "Próxima →" : "Ver resultado! 🏆"}
          </button>
        )}
      </div></main>
    );
  }

  // -------------------------------------------------------
  // CONCLUSÃO
  // -------------------------------------------------------
  const statsFinais = questoes.length > 0
    ? calcularEstatisticas(questoes, respostas)
    : { acertos: 0, total: 0, pct: 0, xpGanho: 0, conceitosErrados: [] };
  const aprovado = statsFinais.pct >= 65;

  return (
    <main style={s.main}><div style={s.inner}>
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{aprovado ? "🏆" : "💪"}</div>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
          {aprovado ? "Arrasou!" : "Quase lá!"}
        </h1>
        <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "2rem" }}>{topico.titulo}</p>

        <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e8d5a3" }}>{statsFinais.acertos}/{statsFinais.total}</div>
            <div style={{ fontSize: "12px", color: "#5a5a6a" }}>acertos</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: statsFinais.pct >= 65 ? "#6ec06e" : "#c06060" }}>{statsFinais.pct}%</div>
            <div style={{ fontSize: "12px", color: "#5a5a6a" }}>aproveitamento</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#c9a84c" }}>+{statsFinais.xpGanho}</div>
            <div style={{ fontSize: "12px", color: "#5a5a6a" }}>XP ganho</div>
          </div>
        </div>

        {statsFinais.conceitosErrados.length > 0 && (
          <div style={{ background: "#1a0e0e", border: "1px solid #3e1e1e", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", textAlign: "left" }}>
            <div style={{ fontSize: "13px", color: "#c06060", fontWeight: "bold", marginBottom: "6px" }}>
              📌 A IA vai reforçar esses conceitos na próxima sessão:
            </div>
            {statsFinais.conceitosErrados.map((c, i) => (
              <div key={i} style={{ fontSize: "12px", color: "#7a4a4a", marginTop: "3px" }}>• {c}</div>
            ))}
          </div>
        )}

        {aprovado && (
          <div style={{ background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", fontSize: "13px", color: "#a09060" }}>
            🔥 +1 no streak! A IA adaptou o próximo tópico com base no seu desempenho.
          </div>
        )}

        <a href={`/capitulo/${topico.capitulo}`}
          style={{ background: "#c9a84c", color: "#0a0a0f", padding: "13px 32px", borderRadius: "10px", fontWeight: "bold", fontSize: "15px", textDecoration: "none", display: "inline-block" }}>
          {aprovado ? "Próximo tópico →" : "Voltar ao capítulo"}
        </a>

        {!aprovado && (
          <button style={s.btnSec} onClick={() => window.location.href = `/capitulo/${topico.capitulo}/topico/${id}`}>
            Revisar com novo conteúdo IA
          </button>
        )}
      </div>
    </div></main>
  );
}