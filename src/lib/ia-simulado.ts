// -------------------------------------------------------
// MOTOR DE SIMULADO ADAPTATIVO COM IA
// Gera questões focadas nos pontos fracos do usuário
// -------------------------------------------------------

export type HistoricoQuestao = {
  topicoId: string;
  conceito: string;
  acertou: boolean;
  vezes: number; // quantas vezes errou este conceito
};

export type QuestaoGerada = {
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  conceito: string; // para rastrear qual conceito foi testado
  dificuldade: "facil" | "medio" | "dificil";
};

export type ConfigSimulado = {
  topicoId: string;
  tituloTopico: string;
  conceitos: string[];
  historico: HistoricoQuestao[];
  nivel: "iniciante" | "basico" | "intermediario";
  quantidade: number; // quantas questões gerar
};

// -------------------------------------------------------
// FUNÇÃO PRINCIPAL — Gera simulado adaptativo
// -------------------------------------------------------
export async function gerarSimulado(config: ConfigSimulado): Promise<QuestaoGerada[]> {

  // Identifica conceitos mais errados
  const conceitosFrageis = config.historico
    .filter(h => !h.acertou && h.topicoId === config.topicoId)
    .sort((a, b) => b.vezes - a.vezes)
    .map(h => h.conceito);

  // Se tem histórico de erros, foca neles. Se não, cobre todos os conceitos.
  const conceitosFoco = conceitosFrageis.length > 0
    ? conceitosFrageis.slice(0, 3)
    : config.conceitos;

  const nivelTexto = config.nivel === "iniciante"
    ? "questões mais diretas, com enunciados claros e alternativas bem distintas"
    : config.nivel === "basico"
    ? "questões de nível intermediário com situações práticas"
    : "questões desafiadoras com cenários complexos e alternativas próximas";

  const prompt = `Você é um gerador de questões para certificação CTFL da ISTQB.

CONTEXTO:
- Tópico: ${config.tituloTopico}
- Nível do aluno: ${config.nivel} (gere ${nivelTexto})
- Conceitos do tópico: ${config.conceitos.join(", ")}
- Conceitos com mais erros (priorizar): ${conceitosFoco.length > 0 ? conceitosFoco.join(", ") : "nenhum — cobrir todos igualmente"}

INSTRUÇÕES:
- Gere exatamente ${config.quantidade} questões
- Cada questão deve testar UM conceito específico
- Priorize questões sobre os conceitos com mais erros
- Use estilo ISTQB: enunciados de situação real, 4 alternativas, apenas 1 correta
- A explicação deve ser educativa e mencionar o conceito testado
- Varie a dificuldade: ${Math.ceil(config.quantidade * 0.4)} fáceis, ${Math.ceil(config.quantidade * 0.4)} médias, ${Math.floor(config.quantidade * 0.2)} difíceis
- NÃO repita questões similares entre si
- Questões difíceis devem ter alternativas distratoras bem elaboradas

Responda APENAS com JSON válido, sem markdown:
[
  {
    "pergunta": "enunciado completo da questão",
    "opcoes": ["alternativa A", "alternativa B", "alternativa C", "alternativa D"],
    "correta": 0,
    "explicacao": "por que esta é a resposta correta e por que as outras estão erradas",
    "conceito": "nome exato do conceito testado",
    "dificuldade": "facil"
  }
]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: "Você é um especialista em certificações ISTQB CTFL. Gere questões desafiadoras e educativas em português do Brasil.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const texto = data.content?.[0]?.text || "[]";
  const questoes = JSON.parse(texto.replace(/```json|```/g, "").trim());
  return questoes as QuestaoGerada[];
}

// -------------------------------------------------------
// FUNÇÃO — Salva histórico de erros no Supabase
// (chamada após cada questão respondida)
// -------------------------------------------------------
export function calcularEstatisticas(questoes: QuestaoGerada[], respostas: number[]) {
  const resultado = questoes.map((q, i) => ({
    conceito: q.conceito,
    acertou: respostas[i] === q.correta,
    dificuldade: q.dificuldade,
  }));

  const acertos = resultado.filter(r => r.acertou).length;
  const erros = resultado.filter(r => !r.acertou);
  const pct = Math.round((acertos / questoes.length) * 100);

  const conceitosErrados = erros.map(e => e.conceito);
  const xpGanho = acertos * 10 + (pct >= 80 ? 20 : pct >= 65 ? 10 : 0); // bônus por performance

  return { acertos, total: questoes.length, pct, conceitosErrados, xpGanho, resultado };
}