// src/app/api/ingles/exercicios/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { licoesBases } from "@/data/ingles-licoes";
import type { NivelCEFR, MetaIngles, TipoExercicio } from "@/data/ingles-curriculum";

export type ExercicioMultipla = {
  tipo: "multipla";
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
};
export type ExercicioTraducao = {
  tipo: "traducao";
  frase_pt: string;
  resposta_esperada: string;
  explicacao: string;
};
export type ExercicioOrdenar = {
  tipo: "ordenar";
  instrucao: string;
  palavras: string[];
  frase_correta: string;
  explicacao: string;
};
export type ExercicioSpeaking = {
  tipo: "speaking";
  frase: string;
  dica?: string;
};
export type ExercicioCompletar = {
  tipo: "completar";
  frase: string;
  lacuna: string;
  opcoes: string[];
  explicacao: string;
};
export type ExercicioListening = {
  tipo: "listening";
  frase: string;
  explicacao: string;
};

export type Exercicio =
  | ExercicioMultipla
  | ExercicioTraducao
  | ExercicioOrdenar
  | ExercicioSpeaking
  | ExercicioCompletar
  | ExercicioListening;

function tiposPermitidos(nivel: NivelCEFR): TipoExercicio[] {
  // Speaking desabilitado em A1
  const base: TipoExercicio[] = ["multipla", "traducao", "ordenar", "completar", "listening"];
  return nivel === "A1" ? base : [...base, "speaking"];
}

function distribuirTipos(nivel: NivelCEFR, quantidade: number): TipoExercicio[] {
  const permitidos = tiposPermitidos(nivel);
  const maxPorTipo = Math.ceil(quantidade / permitidos.length) + 1;
  const resultado: TipoExercicio[] = [];
  const contagem: Partial<Record<TipoExercicio, number>> = {};
  while (resultado.length < quantidade) {
    const disponiveis = permitidos.filter(t => (contagem[t] || 0) < maxPorTipo);
    const escolhido = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    resultado.push(escolhido);
    contagem[escolhido] = (contagem[escolhido] || 0) + 1;
  }
  return resultado;
}

export async function POST(req: NextRequest) {
  const { licao_id, nivel, meta, quantidade = 6 } = await req.json() as {
    licao_id: string;
    nivel: NivelCEFR;
    meta: MetaIngles;
    quantidade?: number;
  };

  const base = licoesBases[licao_id];
  const tipos = distribuirTipos(nivel, quantidade);
  const focoDaMeta = base?.foco_meta?.[meta] ?? "";

  const prompt = `Você é um professor de inglês especializado em profissionais de QA/software testing.
Gere exatamente ${quantidade} exercícios de inglês para a seguinte lição.

LIÇÃO: ${base?.titulo ?? licao_id}
NÍVEL CEFR: ${nivel}
CONTEXTO: ${base?.contexto ?? "Vocabulário técnico de QA em inglês"}
FRASES DE REFERÊNCIA: ${(base?.frases_exemplo ?? []).join(" | ")}
VOCABULÁRIO-ALVO: ${(base?.vocabulario ?? []).map(v => `${v.en} = ${v.pt}`).join(", ")}
PERSONALIZAÇÃO: ${focoDaMeta}
TIPOS NA ORDEM: ${tipos.join(", ")}

REGRAS:
- Gere exatamente ${quantidade} exercícios, na ordem dos tipos listados em TIPOS NA ORDEM
- Distribua os tipos conforme a lista — pode repetir tipos se necessário
- Todos os exercícios devem usar vocabulário de QA e software testing
- Para "speaking": apenas 1 frase curta (máx 10 palavras) para repetir
- Para "listening": frase que um QA usaria em reuniões ou documentos
- Para "ordenar": embaralhe as palavras no array "palavras" (não entregue na ordem correta)
- Para "traducao": frase em português no campo "frase_pt"
- Para "completar": use ___ no campo "frase" para indicar a lacuna

RESPONDA APENAS COM JSON VÁLIDO (array de ${quantidade} objetos), sem markdown:
[
  {"tipo":"multipla","pergunta":"...","opcoes":["A","B","C"],"correta":0,"explicacao":"..."},
  {"tipo":"traducao","frase_pt":"...","resposta_esperada":"...","explicacao":"..."},
  {"tipo":"ordenar","instrucao":"Monte a frase:","palavras":["word","word2"],"frase_correta":"...","explicacao":"..."},
  {"tipo":"speaking","frase":"...","dica":"..."},
  {"tipo":"completar","frase":"The ___ failed.","lacuna":"test","opcoes":["test","bug","deploy"],"explicacao":"..."},
  {"tipo":"listening","frase":"...","explicacao":"..."}
]`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const raw = completion.choices[0]?.message?.content ?? "[]";
  let exercicios: Exercicio[];
  try {
    exercicios = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Erro ao gerar exercícios" }, { status: 500 });
  }

  return NextResponse.json({ exercicios });
}
