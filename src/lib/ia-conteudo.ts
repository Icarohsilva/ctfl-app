// -------------------------------------------------------
// MOTOR DE CONTEÚDO PERSONALIZADO COM IA
// Gera narrativa, cards e vídeo-desc adaptados ao perfil
// -------------------------------------------------------

export type PerfilUsuario = {
  nome: string;
  nivel: "iniciante" | "basico" | "intermediario";
  objetivo: "4semanas" | "8semanas" | "livre";
  pontos: number;
  errosAnteriores: string[]; // IDs dos tópicos com <65% de acerto
  topicosFeitos: string[];   // IDs dos tópicos já concluídos
};

export type ConteudoGerado = {
  narrativa: { titulo: string; paragrafos: string[] };
  cards: { emoji: string; titulo: string; explicacao: string; exemplo: string }[];
  dicaPersonalizada: string;
};

// -------------------------------------------------------
// MAPA DE TÓPICOS — Syllabus CTFL v4.0
// Usado para passar contexto preciso à IA
// -------------------------------------------------------
export const mapaTopicos: Record<string, { capitulo: number; titulo: string; conceitos: string[] }> = {
  // CAP 1
  "por-que-testar": {
    capitulo: 1,
    titulo: "Por que testar?",
    conceitos: ["objetivos do teste", "custo de defeitos", "teste vs QA", "confiança no software", "conformidade regulatória"],
  },
  "7-principios": {
    capitulo: 1,
    titulo: "Os 7 Princípios do Teste",
    conceitos: ["teste mostra presença de defeitos", "teste exaustivo impossível", "teste antecipado", "agrupamento de defeitos", "paradoxo do pesticida", "teste depende do contexto", "ausência de erros é ilusão"],
  },
  "erro-defeito-falha": {
    capitulo: 1,
    titulo: "Erro, Defeito e Falha",
    conceitos: ["erro como ação humana", "defeito no artefato", "falha em execução", "cadeia erro-defeito-falha", "como reportar"],
  },
  "atividades-e-papeis": {
    capitulo: 1,
    titulo: "Atividades e Papéis no Teste",
    conceitos: ["planejamento", "análise", "modelagem", "implementação", "execução", "conclusão", "analista de teste", "testador"],
  },

  // CAP 2
  "modelos-desenvolvimento": {
    capitulo: 2,
    titulo: "Modelos de Desenvolvimento de Software",
    conceitos: ["cascata", "V-Model", "iterativo", "incremental", "ágil", "Scrum", "DevOps", "shift-left"],
  },
  "niveis-teste": {
    capitulo: 2,
    titulo: "Níveis de Teste",
    conceitos: ["teste de componente (unitário)", "teste de integração", "teste de sistema", "teste de aceite"],
  },
  "tipos-teste": {
    capitulo: 2,
    titulo: "Tipos de Teste",
    conceitos: ["teste funcional", "teste não-funcional", "caixa-branca", "teste de confirmação (reteste)", "teste de regressão"],
  },
  "teste-manutencao": {
    capitulo: 2,
    titulo: "Teste de Manutenção",
    conceitos: ["análise de impacto", "teste de regressão em manutenção", "triggers de manutenção"],
  },

  // CAP 3
  "fundamentos-estatico": {
    capitulo: 3,
    titulo: "Fundamentos do Teste Estático",
    conceitos: ["teste estático vs dinâmico", "tipos de artefatos revisáveis", "benefícios do teste estático"],
  },
  "processo-revisao": {
    capitulo: 3,
    titulo: "Processo de Revisão",
    conceitos: ["revisão informal", "walkthrough", "revisão técnica", "inspeção", "papéis na revisão", "fatores de sucesso"],
  },
  "analise-estatica": {
    capitulo: 3,
    titulo: "Análise Estática com Ferramentas",
    conceitos: ["linters", "análise de fluxo de dados", "métricas de código", "verificação de padrões"],
  },

  // CAP 4
  "particao-equivalencia": {
    capitulo: 4,
    titulo: "Partição de Equivalência",
    conceitos: ["partições válidas e inválidas", "partições de valor único", "cobertura de EP", "aplicação em diferentes tipos de dado"],
  },
  "analise-valor-limite": {
    capitulo: 4,
    titulo: "Análise de Valor Limite",
    conceitos: ["BVA de 2 valores", "BVA de 3 valores", "limites mínimo e máximo", "cobertura de BVA"],
  },
  "tabela-decisao": {
    capitulo: 4,
    titulo: "Teste de Tabela de Decisão",
    conceitos: ["condições e ações", "regras de decisão", "cobertura de tabela de decisão", "simplificação de tabela"],
  },
  "transicao-estado": {
    capitulo: 4,
    titulo: "Teste de Transição de Estado",
    conceitos: ["diagrama de estados", "tabela de transição", "cobertura de estados", "cobertura de transições", "sequências de teste"],
  },
  "caixa-branca": {
    capitulo: 4,
    titulo: "Técnicas de Caixa-Branca",
    conceitos: ["cobertura de instrução (statement)", "cobertura de decisão (branch)", "critérios de cobertura", "valor da caixa-branca"],
  },
  "baseado-experiencia": {
    capitulo: 4,
    titulo: "Técnicas Baseadas em Experiência",
    conceitos: ["suposição de erro (error guessing)", "teste exploratório", "sessões e charters", "teste baseado em checklist"],
  },

  // CAP 5
  "planejamento-teste": {
    capitulo: 5,
    titulo: "Planejamento do Teste",
    conceitos: ["propósito do plano de teste", "contexto do teste", "abordagem de teste", "critérios de entrada e saída", "estimativas"],
  },
  "monitoramento-controle": {
    capitulo: 5,
    titulo: "Monitoramento e Controle do Teste",
    conceitos: ["métricas de teste", "relatórios de progresso", "relatório de conclusão", "controle do teste"],
  },
  "gestao-risco": {
    capitulo: 5,
    titulo: "Gestão de Risco no Teste",
    conceitos: ["risco de produto", "risco de projeto", "análise de risco", "mitigação de risco", "teste baseado em risco"],
  },
  "gestao-defeitos": {
    capitulo: 5,
    titulo: "Gestão de Defeitos",
    conceitos: ["relatório de defeito", "ciclo de vida do defeito", "classificação de defeitos", "ferramentas de rastreamento"],
  },

  // CAP 6
  "ferramentas-suporte": {
    capitulo: 6,
    titulo: "Ferramentas de Suporte ao Teste",
    conceitos: ["categorias de ferramentas", "ferramentas de gestão de teste", "ferramentas de teste estático", "ferramentas de execução"],
  },
  "automacao-teste": {
    capitulo: 6,
    titulo: "Automação de Teste",
    conceitos: ["benefícios da automação", "riscos da automação", "ROI de automação", "quando automatizar"],
  },
  "selecao-ferramenta": {
    capitulo: 6,
    titulo: "Seleção e Introdução de Ferramentas",
    conceitos: ["critérios de seleção", "prova de conceito (PoC)", "piloto de ferramenta", "fatores de adoção"],
  },
};

// -------------------------------------------------------
// FUNÇÃO PRINCIPAL — Gera conteúdo personalizado
// -------------------------------------------------------
export async function gerarConteudo(
  topicoId: string,
  perfil: PerfilUsuario
): Promise<ConteudoGerado> {

  const topico = mapaTopicos[topicoId];
  if (!topico) throw new Error(`Tópico ${topicoId} não encontrado`);

  const temErrosNesseCap = perfil.errosAnteriores.some(e => mapaTopicos[e]?.capitulo === topico.capitulo);
  const nivelTexto = perfil.nivel === "iniciante" ? "nunca estudou CTFL" : perfil.nivel === "basico" ? "conhece conceitos básicos" : "já estudou mas não fez a prova";
  const ritmo = perfil.objetivo === "4semanas" ? "estuda intensivamente 2h/dia" : "estuda 1h/dia em ritmo equilibrado";

  const prompt = `Você é um professor especialista em CTFL da ISTQB criando conteúdo de aprendizado personalizado.

PERFIL DO ALUNO:
- Nome: ${perfil.nome}
- Nível: ${nivelTexto}
- Ritmo: ${ritmo}
- XP acumulado: ${perfil.pontos} pontos
- Tópicos já estudados: ${perfil.topicosFeitos.length}
- Tem erros anteriores neste capítulo: ${temErrosNesseCap ? "SIM — reforçar conceitos base" : "NÃO — pode avançar normalmente"}

TÓPICO A ENSINAR:
- Capítulo: ${topico.capitulo}
- Título: ${topico.titulo}
- Conceitos obrigatórios: ${topico.conceitos.join(", ")}

INSTRUÇÕES:
1. A narrativa deve ser engajante, leve e motivadora (estilo Duolingo). Use uma situação real do dia a dia de QA como gancho.
2. Se o aluno é iniciante, use linguagem mais simples e mais exemplos práticos.
3. Se tem erros anteriores neste capítulo, comece reforçando os conceitos base antes de avançar.
4. Cada card deve cobrir UM conceito específico com explicação clara e um exemplo real de QA.
5. A dica personalizada deve ser específica para o perfil deste aluno.

Responda APENAS com JSON válido, sem markdown, sem texto fora do JSON:
{
  "narrativa": {
    "titulo": "título engajante com emoji",
    "paragrafos": ["parágrafo 1", "parágrafo 2", "parágrafo 3", "parágrafo 4"]
  },
  "cards": [
    {
      "emoji": "emoji único",
      "titulo": "nome do conceito",
      "explicacao": "explicação clara em 2-3 frases",
      "exemplo": "exemplo prático do dia a dia de QA"
    }
  ],
  "dicaPersonalizada": "dica específica para este aluno baseada no perfil dele"
}

Gere ${topico.conceitos.length} cards — um para cada conceito listado.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: "Você é um especialista em CTFL da ISTQB e educação adaptativa. Responda sempre em português do Brasil.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const texto = data.content?.[0]?.text || "{}";
  const conteudo = JSON.parse(texto.replace(/```json|```/g, "").trim());
  return conteudo as ConteudoGerado;
}