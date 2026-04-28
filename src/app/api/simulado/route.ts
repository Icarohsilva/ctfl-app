/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

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

type Questao = {
  id?: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  conceito: string;
  dificuldade: "facil" | "medio" | "dificil" | "muito_dificil";
};

function criarSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function gerarEsalvarQuestoes(
  topicoId: string,
  dificuldade: string,
  conceitos: string[],
  tituloTopico: string,
  quantidade: number = 5
): Promise<Questao[]> {
  const nivelTexto =
    dificuldade === "facil" ? "questões básicas e diretas, linguagem simples, alternativas bem distintas" :
    dificuldade === "medio" ? "questões intermediárias com situações práticas reais de QA" :
    dificuldade === "dificil" ? "questões desafiadoras com cenários complexos e alternativas próximas" :
    "questões muito difíceis que combinam múltiplos conceitos, exigem análise profunda, estilo exame real CTFL";

  const prompt = `Você é um especialista em certificação CTFL da ISTQB. Gere questões de múltipla escolha em português do Brasil.

TÓPICO: ${tituloTopico}
DIFICULDADE: ${dificuldade} — ${nivelTexto}
CONCEITOS: ${conceitos.join(", ")}

REGRAS:
- Gere exatamente ${quantidade} questões de dificuldade ${dificuldade}
- Cada questão testa UM conceito específico
- Estilo ISTQB: situação real de QA, 4 alternativas, apenas 1 correta
- Alternativas erradas devem ser plausíveis mas incorretas para quem estudou
- Explicação detalhada de por que a correta está certa e as outras erradas

RESPONDA APENAS COM JSON VÁLIDO SEM MARKDOWN:
[{"pergunta":"...","opcoes":["A","B","C","D"],"correta":0,"explicacao":"...","conceito":"...","dificuldade":"${dificuldade}"}]`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Especialista CTFL ISTQB. Responda APENAS com JSON válido sem markdown." },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 2500,
  });

  const texto = completion.choices[0]?.message?.content || "[]";
  const questoes: Questao[] = JSON.parse(texto.replace(/```json|```/g, "").trim());

  // Salva no banco compartilhado
  const supabase = criarSupabase();
  const registros = questoes.map(q => ({
    topico_id: topicoId,
    conceito: q.conceito,
    dificuldade: q.dificuldade,
    pergunta: q.pergunta,
    opcoes: q.opcoes,
    correta: q.correta,
    explicacao: q.explicacao,
  }));

  const { data: salvas } = await supabase
    .from("banco_questoes")
    .insert(registros)
    .select("id, pergunta, opcoes, correta, explicacao, conceito, dificuldade");

  console.log(`✅ Groq gerou e salvou ${registros.length} questões [${dificuldade}] para ${topicoId}`);
  return ((salvas as Questao[]) || questoes);
}

// -------------------------------------------------------
// POST — Busca ou gera simulado
// -------------------------------------------------------
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topicoId, userId, nivel, quantidade, modo } = body;

  const topico = mapaTopicos[topicoId];
  if (!topico) return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });

  const supabase = criarSupabase();
  const qtd = quantidade || 4;

  // -------------------------------------------------------
  // MODO REVISÃO — questões que o usuário errou
  // -------------------------------------------------------
  if (modo === "revisao" && userId) {
    const { data: fila } = await supabase
      .from("fila_revisao")
      .select("questao_id, tentativas, banco_questoes(*)")
      .eq("user_id", userId)
      .eq("topico_id", topicoId)
      .eq("resolvida", false)
      .order("tentativas", { ascending: false })
      .limit(qtd);

    if (fila && fila.length > 0) {
      const questoes = fila.map((f: any) => ({
        ...(f.banco_questoes as Questao),
        _fila_id: f.questao_id,
        _tentativas: f.tentativas,
        _revisao: true,
      }));
      return NextResponse.json({ questoes, modo: "revisao", total_revisao: fila.length });
    }
  }

  // -------------------------------------------------------
  // MODO NORMAL — distribuição por dificuldade
  // -------------------------------------------------------
  const distribuicao: Record<string, number> =
    nivel === "iniciante"   ? { facil: 2, medio: 1, dificil: 1, muito_dificil: 0 } :
    nivel === "basico"      ? { facil: 1, medio: 2, dificil: 1, muito_dificil: 0 } :
                              { facil: 1, medio: 1, dificil: 1, muito_dificil: 1 };

  const questoesFinais: Questao[] = [];
  const idsUsados = new Set<string>();

  for (const [dificuldade, qtdNivel] of Object.entries(distribuicao)) {
    if (qtdNivel === 0) continue;

    const { data: existentes } = await supabase
      .from("banco_questoes")
      .select("id, pergunta, opcoes, correta, explicacao, conceito, dificuldade")
      .eq("topico_id", topicoId)
      .eq("dificuldade", dificuldade)
      .order("vezes_usada", { ascending: true })
      .limit(qtdNivel * 3);

    const disponiveis = ((existentes as Questao[]) || []).filter(
      (q: Questao) => q.id && !idsUsados.has(q.id)
    );

    if (disponiveis.length >= qtdNivel) {
      const selecionadas = disponiveis.slice(0, qtdNivel);
      selecionadas.forEach((q: Questao) => {
        if (q.id) idsUsados.add(q.id);
        questoesFinais.push(q);
      });

      // Atualiza contador sem crash se RPC não existir
      const ids = selecionadas.map((q: Questao) => q.id).filter(Boolean);
      try { await supabase.rpc("incrementar_uso_questoes", { ids_questoes: ids }); } catch {}

      console.log(`📦 Banco: ${selecionadas.length} questões [${dificuldade}] para ${topicoId}`);
    } else {
      try {
        const geradas = await gerarEsalvarQuestoes(
          topicoId, dificuldade, topico.conceitos, topico.titulo,
          Math.max(qtdNivel, 5)
        );
        geradas.slice(0, qtdNivel).forEach(q => questoesFinais.push(q));
      } catch (error) {
        console.error(`Erro ao gerar [${dificuldade}]:`, error);
        disponiveis.slice(0, qtdNivel).forEach(q => questoesFinais.push(q));
      }
    }
  }

  // Embaralha
  const embaralhadas = questoesFinais.sort(() => Math.random() - 0.5);

  // Conta revisões pendentes
  let totalRevisao = 0;
  if (userId) {
    const { count } = await supabase
      .from("fila_revisao")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("topico_id", topicoId)
      .eq("resolvida", false);
    totalRevisao = count || 0;
  }

  return NextResponse.json({ questoes: embaralhadas, modo: "normal", total_revisao: totalRevisao });
}

// -------------------------------------------------------
// PATCH — Salva resultado de cada questão respondida
// -------------------------------------------------------
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { userId, questaoId, topicoId, acertou, dificuldade } = body;

  if (!userId || !questaoId) {
    return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 });
  }

  const supabase = criarSupabase();

  // Atualiza estatísticas da questão
  if (acertou) {
    try { await supabase.rpc("incrementar_acerto_questao", { id_questao: questaoId }); } catch {};
  } else {
    try { await supabase.rpc("incrementar_erro_questao", { id_questao: questaoId }); } catch {};
  }

  if (acertou) {
    // Remove da fila de revisão
    const { data: naFila } = await supabase
      .from("fila_revisao")
      .select("id")
      .eq("user_id", userId)
      .eq("questao_id", questaoId)
      .maybeSingle();

    if (naFila) {
      await supabase
        .from("fila_revisao")
        .update({ resolvida: true })
        .eq("user_id", userId)
        .eq("questao_id", questaoId);

      // Gera nova questão substituta em background
      const topicoEntry = mapaTopicos[topicoId];
      if (topicoEntry) {
        gerarEsalvarQuestoes(topicoId, dificuldade, topicoEntry.conceitos, topicoEntry.titulo, 1)
          .catch(() => {});
      }
    }
  } else {
    // Adiciona ou incrementa na fila de revisão
    const { data: existente } = await supabase
      .from("fila_revisao")
      .select("id, tentativas")
      .eq("user_id", userId)
      .eq("questao_id", questaoId)
      .maybeSingle();

    if (existente) {
      await supabase
        .from("fila_revisao")
        .update({
          tentativas: (existente as any).tentativas + 1,
          ultima_tentativa: new Date().toISOString(),
          resolvida: false,
        })
        .eq("id", (existente as any).id);
    } else {
      await supabase.from("fila_revisao").insert({
        user_id: userId,
        questao_id: questaoId,
        topico_id: topicoId,
        tentativas: 1,
      });
    }
  }

  return NextResponse.json({ ok: true });
}