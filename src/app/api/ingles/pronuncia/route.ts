// src/app/api/ingles/pronuncia/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import type { NivelCEFR } from "@/data/ingles-curriculum";

function criarSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const { esperado, transcript, nivel, user_id, licao_id } = await req.json() as {
    esperado: string;
    transcript: string;
    nivel: NivelCEFR;
    user_id: string;
    licao_id: string;
  };

  const prompt = `Você é um avaliador de pronúncia de inglês especializado em falantes de português brasileiro.

FRASE ESPERADA: "${esperado}"
O QUE O USUÁRIO DISSE (transcript): "${transcript}"
NÍVEL DO ALUNO: ${nivel}

Analise a pronúncia comparando a frase esperada com o que foi transcrito.
Considere erros comuns de falantes de pt-BR:
- Substituição de "th" por "d" ou "f" (ex: "the" → "de")
- Confusão v/b (ex: "very" → "bery")
- Pronúncia de "-ed" final (ex: "walked" → "walkéd")
- Vogais longas/curtas (ex: "ship" vs "sheep")
- Sílabas tônicas erradas

RESPONDA APENAS COM JSON VÁLIDO, sem markdown:
{
  "score": 85,
  "erros": ["critical pronunciado como 'creetical'"],
  "dica": "Atenção ao 'i' em 'critical' — é um som curto /ɪ/, não longo. Tente: KRIT-ih-kul"
}

Regras do score:
- 100 = perfeito (transcript idêntico ou equivalente fonético)
- -15 por cada erro de pronúncia identificado
- Mínimo 10
- Se o transcript estiver muito diferente (usuário falou outra coisa), score = 10`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 400,
  });

  const raw = completion.choices[0]?.message?.content ?? '{"score":50,"erros":[],"dica":""}';
  let resultado: { score: number; erros: string[]; dica: string };
  try {
    resultado = JSON.parse(raw);
  } catch {
    resultado = { score: 50, erros: [], dica: "Não foi possível avaliar. Tente novamente." };
  }

  // Salvar score no Supabase
  if (user_id && licao_id) {
    const supabase = criarSupabase();
    await supabase.from("ingles_scores_pronuncia").insert({
      user_id,
      licao_id,
      frase: esperado,
      score: resultado.score,
      transcript,
    });

    // Atualizar média no ingles_progresso
    const { data: scores } = await supabase
      .from("ingles_scores_pronuncia")
      .select("score")
      .eq("user_id", user_id);

    if (scores && scores.length > 0) {
      const media = scores.reduce((acc, s) => acc + s.score, 0) / scores.length;
      await supabase
        .from("ingles_progresso")
        .update({ score_pronuncia_medio: Math.round(media) })
        .eq("user_id", user_id);
    }
  }

  return NextResponse.json(resultado);
}
