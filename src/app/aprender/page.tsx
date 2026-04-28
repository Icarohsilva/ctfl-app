"use client";
import { useState } from "react";

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------
type Etapa = "narrativa" | "cards" | "video" | "simulado" | "conclusao";

type Card = {
  emoji: string;
  titulo: string;
  explicacao: string;
  exemplo: string;
};

type Questao = {
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
};

// -------------------------------------------------------
// CONTEÚDO DO TÓPICO — Cap. 1: Os 7 Princípios do Teste
// (cada tópico terá seu próprio conteúdo; esse é o primeiro)
// -------------------------------------------------------
const topico = {
  capitulo: 1,
  titulo: "Os 7 Princípios do Teste",
  subtitulo: "A base de tudo que um bom QA precisa saber",
  xp: 50,
  narrativa: {
    titulo: "Antes de testar, entenda o jogo 🎮",
    paragrafos: [
      "Imagina que você acabou de entrar num time de desenvolvimento. O produto vai pra produção em 2 semanas e o dev te fala: 'é só testar tudo, tá?' — como se fosse simples assim.",
      "Mas 'testar tudo' é impossível. Literalmente. Um formulário com 5 campos e 3 opções cada já tem centenas de combinações. Um sistema real tem milhões.",
      "Foi exatamente pra resolver isso que a indústria criou os 7 Princípios do Teste. Eles não são regras burocráticas — são a sabedoria de décadas de QAs que erraram (caro) antes de você.",
      "Dominar esses princípios é o que separa quem 'clica em botões' de quem pensa estrategicamente sobre qualidade. Bora entender cada um? 🚀",
    ],
  },
  cards: [
    {
      emoji: "🚫",
      titulo: "1. Teste mostra presença de defeitos",
      explicacao: "O teste pode provar que defeitos existem, mas nunca pode provar que o software está 100% livre de problemas. Mesmo sem achar nada, bugs podem estar escondidos.",
      exemplo: "Você testou o login por 3 dias e não achou nada. Isso não significa que está perfeito — significa que seus testes não encontraram defeitos naquele escopo.",
    },
    {
      emoji: "♾️",
      titulo: "2. Teste exaustivo é impossível",
      explicacao: "Testar todas as combinações possíveis de entradas e condições é inviável na prática. Por isso usamos técnicas para escolher os testes mais importantes.",
      exemplo: "Um campo de senha com 8 caracteres tem mais combinações do que estrelas na Via Láctea. A solução? Técnicas como partição de equivalência.",
    },
    {
      emoji: "⏰",
      titulo: "3. Teste antecipado economiza",
      explicacao: "Quanto mais cedo um defeito é encontrado, mais barato é corrigi-lo. Um bug achado em produção pode custar 100x mais do que o mesmo bug achado nos requisitos.",
      exemplo: "Revisar os requisitos antes de codar encontra ambiguidades que, se virassem código, custariam dias de retrabalho.",
    },
    {
      emoji: "🎯",
      titulo: "4. Agrupamento de defeitos",
      explicacao: "A maioria dos defeitos está concentrada em poucos módulos. Foque seus esforços nas áreas mais complexas ou com histórico de problemas.",
      exemplo: "O módulo de pagamento do e-commerce tem 3x mais bugs que o restante do sistema. Faz sentido testar ele com muito mais cuidado.",
    },
    {
      emoji: "🐛",
      titulo: "5. Paradoxo do pesticida",
      explicacao: "Repetir os mesmos testes vai, com o tempo, parar de encontrar novos bugs. É preciso revisar e criar novos testes regularmente.",
      exemplo: "Sua suite de regressão rodou 6 meses sem falhar. Isso pode ser ótimo... ou pode ser que ela parou de ser eficaz. Revise os casos de teste.",
    },
    {
      emoji: "🌍",
      titulo: "6. Teste depende do contexto",
      explicacao: "Não existe uma abordagem única. Testar um app bancário exige muito mais rigor do que testar um app de to-do list.",
      exemplo: "Um bug de UI num app de notas = irritante. O mesmo bug num sistema de UTI hospitalar = potencialmente fatal.",
    },
    {
      emoji: "✨",
      titulo: "7. Ausência de erros é uma ilusão",
      explicacao: "Mesmo que o software não tenha bugs, ele pode ser inútil se não atender às necessidades reais do usuário. Qualidade vai além de 'sem defeitos'.",
      exemplo: "O sistema foi entregue sem nenhum bug... mas ninguém usa porque a UX é horrível e não resolve o problema do cliente.",
    },
  ] as Card[],
  video: {
    titulo: "Resumão em vídeo — Os 7 Princípios",
    descricao: "Assiste esse vídeo de 5 minutos antes do simulado. Vai fixar tudo que você acabou de ler.",
    url: null, // null = em breve; string com URL = exibe o player
    duracao: "~5 min",
  },
  questoes: [
    {
      pergunta: "Um QA testou exaustivamente o módulo de login e não encontrou nenhum defeito. O que isso significa segundo os princípios do teste?",
      opcoes: [
        "O software está livre de defeitos nesse módulo",
        "Os testes foram bem executados e o módulo é confiável",
        "O teste reduziu o risco mas não garante ausência de defeitos",
        "É necessário refazer todos os testes para confirmar",
      ],
      correta: 2,
      explicacao: "Princípio 1: o teste pode mostrar a presença de defeitos, mas nunca provar que estão todos ausentes. Não achar bugs ≠ não ter bugs.",
    },
    {
      pergunta: "A equipe roda os mesmos testes de regressão há 8 meses sem encontrar falhas. Qual princípio explica por que isso pode ser um problema?",
      opcoes: [
        "Teste antecipado economiza",
        "Paradoxo do pesticida",
        "Agrupamento de defeitos",
        "Ausência de erros é uma ilusão",
      ],
      correta: 1,
      explicacao: "Princípio 5 — Paradoxo do pesticida: testes repetidos perdem eficácia ao longo do tempo. A suite precisa ser revisada e expandida regularmente.",
    },
    {
      pergunta: "Uma startup está desenvolvendo um app simples de lista de tarefas. A abordagem de testes deve ser:",
      opcoes: [
        "Idêntica à de um sistema bancário, por precaução",
        "Adaptada ao contexto — menor risco, menos rigor formal",
        "Focada apenas em testes de performance",
        "Dispensável, já que o app é simples",
      ],
      correta: 1,
      explicacao: "Princípio 6 — Teste depende do contexto: o nível de rigor deve ser proporcional ao risco e impacto do sistema.",
    },
    {
      pergunta: "O sistema foi entregue sem nenhum bug registrado, mas os usuários reclamam que ele não resolve suas necessidades. Qual princípio se aplica?",
      opcoes: [
        "Teste exaustivo é impossível",
        "Agrupamento de defeitos",
        "Ausência de erros é uma ilusão",
        "Teste antecipado economiza",
      ],
      correta: 2,
      explicacao: "Princípio 7: ausência de defeitos técnicos não significa qualidade. O software precisa atender às necessidades reais dos usuários.",
    },
    {
      pergunta: "Durante a revisão dos requisitos, o QA identificou uma ambiguidade que geraria retrabalho enorme se fosse para o código. Qual princípio justifica esse trabalho antecipado?",
      opcoes: [
        "Paradoxo do pesticida",
        "Teste mostra presença de defeitos",
        "Teste antecipado economiza",
        "Agrupamento de defeitos",
      ],
      correta: 2,
      explicacao: "Princípio 3: defeitos encontrados cedo custam muito menos para corrigir. Revisar requisitos é uma das formas mais baratas de garantir qualidade.",
    },
  ] as Questao[],
};

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------
export default function Aprender() {
  const [etapa, setEtapa] = useState<Etapa>("narrativa");
  const [cardAtual, setCardAtual] = useState(0);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [questoesIA, setQuestoesIA] = useState<Questao[]>([]);
  const [usandoIA, setUsandoIA] = useState(false);

  // Progresso visual no topo
  const etapas: Etapa[] = ["narrativa", "cards", "video", "simulado", "conclusao"];
  const progressoPct = ((etapas.indexOf(etapa)) / (etapas.length - 1)) * 100;

  const questoesAtivas = usandoIA && questoesIA.length > 0 ? questoesIA : topico.questoes;

  // Gera questões com IA via Claude API
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
Responda APENAS com JSON válido, sem markdown, sem explicações fora do JSON.
Formato exato:
[{"pergunta":"...","opcoes":["a","b","c","d"],"correta":0,"explicacao":"..."}]
correta é o índice (0-3) da opção correta.`,
          messages: [{
            role: "user",
            content: `Gere 3 questões CTFL sobre: ${topico.titulo}. 
Foco nos princípios: ${topico.cards.map(c => c.titulo).join(", ")}.
Nível: intermediário. Estilo ISTQB.`
          }]
        })
      });
      const data = await res.json();
      const texto = data.content?.[0]?.text || "[]";
      const questoes = JSON.parse(texto.replace(/```json|```/g, "").trim());
      setQuestoesIA(questoes);
      setUsandoIA(true);
    } catch {
      // Se falhar, usa as questões padrão
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
      setEtapa("conclusao");
    }
  };

  // -------------------------------------------------------
  // ESTILOS BASE
  // -------------------------------------------------------
  const s = {
    container: {
      background: "#0a0a0f",
      minHeight: "100vh",
      color: "#f0ede8",
      fontFamily: "sans-serif",
    } as React.CSSProperties,
    inner: {
      maxWidth: "680px",
      margin: "0 auto",
      padding: "2rem 1.5rem 4rem",
    } as React.CSSProperties,
    card: {
      background: "#0f0f18",
      border: "1px solid #1e1e2e",
      borderRadius: "16px",
      padding: "1.75rem",
      marginBottom: "1rem",
    } as React.CSSProperties,
    btn: {
      background: "#c9a84c",
      border: "none",
      borderRadius: "10px",
      padding: "13px 28px",
      color: "#0a0a0f",
      fontSize: "15px",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      marginTop: "1.25rem",
    } as React.CSSProperties,
    btnSecundario: {
      background: "transparent",
      border: "1px solid #2e2e3e",
      borderRadius: "10px",
      padding: "11px 28px",
      color: "#a0998e",
      fontSize: "14px",
      cursor: "pointer",
      width: "100%",
      marginTop: "8px",
    } as React.CSSProperties,
  };

  // -------------------------------------------------------
  // RENDER — BARRA DE PROGRESSO + NAV
  // -------------------------------------------------------
  const renderNav = () => (
    <div style={{ marginBottom: "2rem" }}>
      {/* Linha de progresso */}
      <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "5px", marginBottom: "1rem" }}>
        <div style={{ background: "linear-gradient(90deg,#c9a84c,#e8d5a3)", width: `${progressoPct}%`, height: "5px", borderRadius: "99px", transition: "width 0.5s ease" }} />
      </div>
      {/* Ícones das etapas */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[
          { e: "narrativa", icon: "📖", label: "História" },
          { e: "cards", icon: "🃏", label: "Conceitos" },
          { e: "video", icon: "🎬", label: "Vídeo" },
          { e: "simulado", icon: "🎯", label: "Simulado" },
          { e: "conclusao", icon: "🏆", label: "Conclusão" },
        ].map((item) => {
          const idx = etapas.indexOf(item.e as Etapa);
          const atual = etapas.indexOf(etapa);
          const concluida = idx < atual;
          const ativa = idx === atual;
          return (
            <div key={item.e} style={{ textAlign: "center", opacity: concluida || ativa ? 1 : 0.3 }}>
              <div style={{ fontSize: "1.2rem" }}>{concluida ? "✅" : item.icon}</div>
              <div style={{ fontSize: "10px", color: ativa ? "#c9a84c" : "#5a5a6a", marginTop: "2px" }}>{item.label}</div>
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
    <main style={s.container}>
      <div style={s.inner}>
        <a href="/dashboard" style={{ color: "#5a5a6a", fontSize: "13px", textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>← Voltar</a>
        {renderNav()}
        <div style={{ marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "12px", background: "#1a1a0e", color: "#c9a84c", border: "1px solid #c9a84c44", padding: "3px 10px", borderRadius: "99px" }}>
            Cap. {topico.capitulo} · +{topico.xp} XP
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
          <span style={{ fontSize: "1.5rem" }}>💡</span>
          <div style={{ fontSize: "13px", color: "#a09060", lineHeight: 1.5 }}>
            Esses princípios aparecem em <strong style={{ color: "#c9a84c" }}>~27% das questões</strong> do exame CTFL. Vale muito a pena dominar!
          </div>
        </div>

        <button style={s.btn} onClick={() => setEtapa("cards")}>
          Entendi! Vamos ver os conceitos →
        </button>
      </div>
    </main>
  );

  // -------------------------------------------------------
  // ETAPA 2 — CARDS DOS CONCEITOS
  // -------------------------------------------------------
  if (etapa === "cards") {
    const card = topico.cards[cardAtual];
    return (
      <main style={s.container}>
        <div style={s.inner}>
          {renderNav()}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Conceito {cardAtual + 1} de {topico.cards.length}</span>
            <span style={{ fontSize: "13px", color: "#c9a84c" }}>{Math.round(((cardAtual + 1) / topico.cards.length) * 100)}%</span>
          </div>

          {/* Barra mini dos cards */}
          <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", marginBottom: "1.5rem" }}>
            <div style={{ background: "#c9a84c", width: `${((cardAtual + 1) / topico.cards.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
          </div>

          {/* Card principal */}
          <div style={{ ...s.card, borderColor: "#2a2a3e" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{card.emoji}</div>
            <h2 style={{ fontSize: "1.1rem", fontFamily: "Georgia, serif", color: "#e8d5a3", fontWeight: "normal", marginTop: 0, marginBottom: "1rem" }}>
              {card.titulo}
            </h2>
            <p style={{ color: "#c0bab0", lineHeight: 1.8, fontSize: "15px", margin: "0 0 1.25rem" }}>
              {card.explicacao}
            </p>

            {/* Exemplo */}
            <div style={{ background: "#0a0a14", border: "1px solid #2e2e4e", borderRadius: "10px", padding: "1rem 1.25rem" }}>
              <div style={{ fontSize: "11px", color: "#5a5a8a", marginBottom: "6px", fontWeight: "bold", letterSpacing: "0.05em" }}>EXEMPLO REAL</div>
              <p style={{ color: "#9090c0", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{card.exemplo}</p>
            </div>
          </div>

          {/* Frases motivadoras por card */}
          {cardAtual === 0 && <p style={{ textAlign: "center", fontSize: "13px", color: "#5a6a5a", marginBottom: "1rem" }}>🌱 Bom começo! Cada princípio que você aprende te deixa mais perto do certificado.</p>}
          {cardAtual === 3 && <p style={{ textAlign: "center", fontSize: "13px", color: "#5a6a5a", marginBottom: "1rem" }}>⚡ Você tá na metade! Tô impressionado com seu ritmo.</p>}
          {cardAtual === 6 && <p style={{ textAlign: "center", fontSize: "13px", color: "#6a6a4a", marginBottom: "1rem" }}>🎉 Último conceito! Você aprendeu todos os 7 princípios.</p>}

          <div style={{ display: "flex", gap: "10px" }}>
            {cardAtual > 0 && (
              <button onClick={() => setCardAtual(c => c - 1)} style={{ ...s.btnSecundario, width: "auto", flex: 1, marginTop: 0 }}>
                ← Anterior
              </button>
            )}
            {cardAtual < topico.cards.length - 1 ? (
              <button onClick={() => setCardAtual(c => c + 1)} style={{ ...s.btn, flex: cardAtual > 0 ? 2 : 1, marginTop: 0 }}>
                Próximo conceito →
              </button>
            ) : (
              <button onClick={() => setEtapa("video")} style={{ ...s.btn, flex: 2, marginTop: 0 }}>
                Ver o vídeo! 🎬
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------
  // ETAPA 3 — VÍDEO
  // -------------------------------------------------------
  if (etapa === "video") return (
    <main style={s.container}>
      <div style={s.inner}>
        {renderNav()}

        <h2 style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
          {topico.video.titulo}
        </h2>
        <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.5rem" }}>{topico.video.descricao}</p>

        {topico.video.url ? (
          /* Player real quando tiver URL */
          <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem", aspectRatio: "16/9", background: "#000" }}>
            <iframe
              src={topico.video.url}
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
            />
          </div>
        ) : (
          /* Placeholder "em breve" */
          <div style={{ ...s.card, textAlign: "center", padding: "3rem 2rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
            <h3 style={{ color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Vídeo em produção...
            </h3>
            <p style={{ color: "#5a5a6a", fontSize: "13px", lineHeight: 1.6, maxWidth: "340px", margin: "0 auto" }}>
              O Ícaro está gravando as aulas. Assim que o vídeo desse tópico ficar pronto, ele aparece aqui automaticamente.
            </p>
            <div style={{ marginTop: "1.25rem", display: "inline-flex", alignItems: "center", gap: "6px", background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "99px", padding: "6px 14px" }}>
              <span style={{ fontSize: "12px", color: "#c9a84c" }}>⏱ {topico.video.duracao}</span>
            </div>
          </div>
        )}

        <div style={{ background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", gap: "10px", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "1.3rem" }}>🧠</span>
          <div style={{ fontSize: "13px", color: "#a09060", lineHeight: 1.5 }}>
            Já leu todos os conceitos — você tá mais que pronto pro simulado. Topa o desafio?
          </div>
        </div>

        <button style={s.btn} onClick={() => { gerarQuestoesIA(); setEtapa("simulado"); }}>
          Ir pro simulado! 🎯
        </button>
        <button style={s.btnSecundario} onClick={() => setEtapa("simulado")}>
          Pular e ir direto ao simulado
        </button>
      </div>
    </main>
  );

  // -------------------------------------------------------
  // ETAPA 4 — SIMULADO
  // -------------------------------------------------------
  if (etapa === "simulado") {
    const questao = questoesAtivas[questaoAtual];

    if (carregandoIA) return (
      <main style={{ ...s.container, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🤖</div>
          <p style={{ color: "#c9a84c", fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>Gerando questões com IA...</p>
          <p style={{ color: "#5a5a6a", fontSize: "13px" }}>Criando perguntas inéditas só pra você</p>
        </div>
      </main>
    );

    return (
      <main style={s.container}>
        <div style={s.inner}>
          {renderNav()}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Questão {questaoAtual + 1} de {questoesAtivas.length}</span>
              {usandoIA && <span style={{ fontSize: "11px", background: "#0a1a0e", color: "#4e9e4e", border: "1px solid #2e5e2e", padding: "2px 7px", borderRadius: "99px", marginLeft: "8px" }}>✨ IA</span>}
            </div>
            <span style={{ fontSize: "13px", color: "#c9a84c" }}>⭐ {acertos * 10} pts</span>
          </div>

          {/* Mini barra */}
          <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", marginBottom: "1.5rem" }}>
            <div style={{ background: "#c9a84c", width: `${((questaoAtual + 1) / questoesAtivas.length) * 100}%`, height: "3px", borderRadius: "99px", transition: "width 0.3s" }} />
          </div>

          {/* Pergunta */}
          <div style={s.card}>
            <p style={{ color: "#e8d5a3", fontSize: "16px", lineHeight: 1.7, margin: 0, fontFamily: "Georgia, serif" }}>
              {questao.pergunta}
            </p>
          </div>

          {/* Opções */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
            {questao.opcoes.map((opcao, i) => {
              let cor = "#1e1e2e";
              let textoCor = "#c0bab0";
              if (respostaConfirmada) {
                if (i === questao.correta) { cor = "#1e3e1e"; textoCor = "#6ec06e"; }
                else if (i === respostaSelecionada) { cor = "#3e1e1e"; textoCor = "#c06060"; }
              } else if (respostaSelecionada === i) {
                cor = "#2a2a0e"; textoCor = "#e8d5a3";
              }

              return (
                <button
                  key={i}
                  disabled={respostaConfirmada}
                  onClick={() => setRespostaSelecionada(i)}
                  style={{
                    background: "#0f0f18",
                    border: `1px solid ${respostaSelecionada === i && !respostaConfirmada ? "#c9a84c" : cor}`,
                    borderRadius: "10px",
                    padding: "14px 16px",
                    color: textoCor,
                    fontSize: "14px",
                    textAlign: "left",
                    cursor: respostaConfirmada ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.15s",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ width: "22px", height: "22px", borderRadius: "50%", border: `1.5px solid ${textoCor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, fontWeight: "bold" }}>
                    {respostaConfirmada && i === questao.correta ? "✓" : respostaConfirmada && i === respostaSelecionada && i !== questao.correta ? "✗" : ["A", "B", "C", "D"][i]}
                  </span>
                  {opcao}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
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
              {questaoAtual < questoesAtivas.length - 1 ? "Próxima questão →" : "Ver resultado! 🏆"}
            </button>
          )}
        </div>
      </main>
    );
  }

  // -------------------------------------------------------
  // ETAPA 5 — CONCLUSÃO
  // -------------------------------------------------------
  const total = questoesAtivas.length;
  const pct = Math.round((acertos / total) * 100);
  const aprovado = pct >= 65;

  return (
    <main style={s.container}>
      <div style={s.inner}>
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{aprovado ? "🏆" : "💪"}</div>
          <h1 style={{ fontSize: "1.8rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "0.5rem" }}>
            {aprovado ? "Arrasou nesse tópico!" : "Continue praticando!"}
          </h1>
          <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "2rem" }}>
            {aprovado ? "Você dominou os 7 Princípios do Teste 🎯" : "Revisar os cards vai te ajudar a fixar melhor"}
          </p>

          {/* Resultado */}
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

          {aprovado && (
            <div style={{ background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", fontSize: "13px", color: "#a09060", lineHeight: 1.6 }}>
              🎓 Tópico concluído! O próximo é <strong style={{ color: "#c9a84c" }}>Erro, Defeito e Falha</strong> — você vai ver como esses conceitos se conectam com os princípios que acabou de aprender.
            </div>
          )}

          <button style={s.btn} onClick={() => window.location.href = "/dashboard"}>
            {aprovado ? "Próximo tópico →" : "Voltar ao dashboard"}
          </button>

          {!aprovado && (
            <button style={s.btnSecundario} onClick={() => {
              setEtapa("narrativa");
              setQuestaoAtual(0);
              setAcertos(0);
              setRespostaSelecionada(null);
              setRespostaConfirmada(false);
              setUsandoIA(false);
              setQuestoesIA([]);
            }}>
              Revisar tópico do início
            </button>
          )}
        </div>
      </div>
    </main>
  );
}