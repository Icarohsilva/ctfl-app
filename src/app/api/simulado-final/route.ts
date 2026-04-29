import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const mapaCapitulos: Record<number, { titulo: string; conceitos: string[] }> = {
  1: {
    titulo: "Fundamentos de Teste",
    conceitos: ["objetivos do teste", "7 princípios", "erro defeito falha", "processo de teste", "papéis e atividades", "teste vs QA", "psicologia do teste"],
  },
  2: {
    titulo: "Ciclo de Vida de Desenvolvimento",
    conceitos: ["V-Model", "modelos ágeis", "shift-left", "níveis de teste", "tipos de teste", "teste de confirmação", "teste de regressão", "teste de manutenção"],
  },
  3: {
    titulo: "Teste Estático",
    conceitos: ["benefícios do teste estático", "revisão informal", "walkthrough", "revisão técnica", "inspeção", "análise estática", "papéis na revisão"],
  },
  4: {
    titulo: "Técnicas de Teste",
    conceitos: ["partição de equivalência", "análise de valor limite", "tabela de decisão", "transição de estado", "cobertura de instrução", "cobertura de decisão", "teste exploratório", "error guessing"],
  },
  5: {
    titulo: "Gerenciamento de Testes",
    conceitos: ["plano de teste", "estimativas", "risco de produto", "risco de projeto", "monitoramento", "relatórios", "gestão de defeitos", "teste baseado em risco"],
  },
  6: {
    titulo: "Ferramentas de Teste",
    conceitos: ["categorias de ferramentas", "benefícios da automação", "riscos da automação", "seleção de ferramentas", "piloto de ferramenta"],
  },
};

export async function POST(req: NextRequest) {
  const { capitulo, quantidade, nivel, userId } = await req.json();

  const cap = mapaCapitulos[capitulo];
  if (!cap) return NextResponse.json({ error: "Capítulo inválido" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Tenta buscar questões do banco (mais rápido)
  if (userId) {
    const { data: existentes } = await supabase
      .from("banco_questoes")
      .select("id, pergunta, opcoes, correta, explicacao, conceito, dificuldade")
      .eq("topico_id", `simulado-cap-${capitulo}`)
      .order("vezes_usada", { ascending: true })
      .limit(quantidade * 2);

    if (existentes && existentes.length >= quantidade) {
      // Embaralha e retorna
      const selecionadas = existentes
        .sort(() => Math.random() - 0.5)
        .slice(0, quantidade)
        .map(q => ({ ...q, capitulo }));

      return NextResponse.json({ questoes: selecionadas, fonte: "banco" });
    }
  }

  // 2. Gera com Groq se não tiver no banco
  const nivelTexto = nivel === "iniciante"
    ? "questões básicas com situações diretas"
    : nivel === "basico"
    ? "questões de nível intermediário com situações práticas"
    : "questões desafiadoras estilo exame real CTFL com alternativas próximas";

  const prompt = `Você é um especialista em certificação CTFL da ISTQB. Gere questões para o exame em português do Brasil.

CAPÍTULO: ${cap.titulo}
NÍVEL: ${nivelTexto}
CONCEITOS A COBRIR: ${cap.conceitos.join(", ")}

REGRAS IMPORTANTES:
- Gere exatamente ${quantidade} questões
- Distribua pelos conceitos: pelo menos 1 questão por conceito principal
- Estilo ISTQB oficial: situação real de QA, 4 alternativas (A/B/C/D), apenas 1 correta
- Alternativas erradas devem ser plausíveis e tecnicamente relacionadas
- Explicação detalhada de por que cada alternativa está certa ou errada
- Varie a dificuldade: 40% fácil, 40% médio, 20% difícil
- NÃO repita questões similares

Responda APENAS com JSON válido sem markdown:
[{
  "pergunta": "enunciado completo com contexto real de QA",
  "opcoes": ["opção A completa", "opção B completa", "opção C completa", "opção D completa"],
  "correta": 0,
  "explicacao": "explicação detalhada da resposta correta",
  "conceito": "conceito específico testado",
  "dificuldade": "facil"
}]`;

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Especialista CTFL ISTQB. Responda APENAS com JSON válido sem markdown." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const texto = completion.choices[0]?.message?.content || "[]";
    const questoes = JSON.parse(texto.replace(/```json|```/g, "").trim());

    if (!Array.isArray(questoes)) throw new Error("Resposta inválida");

    // Salva no banco para uso futuro
    const registros = questoes.map((q: { pergunta: string; opcoes: string[]; correta: number; explicacao: string; conceito: string; dificuldade: string }) => ({
      topico_id: `simulado-cap-${capitulo}`,
      conceito: q.conceito,
      dificuldade: q.dificuldade,
      pergunta: q.pergunta,
      opcoes: q.opcoes,
      correta: q.correta,
      explicacao: q.explicacao,
    }));

    supabase.from("banco_questoes").insert(registros).then(() => {
      console.log(`✅ ${registros.length} questões do simulado cap.${capitulo} salvas no banco`);
    });

    return NextResponse.json({
      questoes: questoes.map((q: object) => ({ ...q, capitulo })),
      fonte: "groq",
    });

  } catch (error) {
    console.error("Erro ao gerar questões do simulado:", error);
    return NextResponse.json({ questoes: [], error: "Erro ao gerar questões" }, { status: 500 });
  }
}