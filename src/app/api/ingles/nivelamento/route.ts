// src/app/api/ingles/nivelamento/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getQuestaoParaNivel } from "@/data/ingles-nivelamento";
import type { NivelCEFR } from "@/data/ingles-curriculum";

const PESOS: Record<NivelCEFR, number> = { A1: 1, A2: 2, B1: 3, B2: 4 };
const ORDEM: NivelCEFR[] = ["A1", "A2", "B1", "B2"];

function subirNivel(nivel: NivelCEFR): NivelCEFR {
  const idx = ORDEM.indexOf(nivel);
  return idx < ORDEM.length - 1 ? ORDEM[idx + 1] : nivel;
}

function descerNivel(nivel: NivelCEFR): NivelCEFR {
  const idx = ORDEM.indexOf(nivel);
  return idx > 0 ? ORDEM[idx - 1] : nivel;
}

function calcularNivelFinal(score: number): NivelCEFR {
  if (score < 4) return "A1";
  if (score < 10) return "A2";
  if (score < 18) return "B1";
  return "B2";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    questao_idx,       // number — qual questão acabou de ser respondida (0-based)
    acertou,           // boolean
    estado,            // { score: number; nivel_corrente: NivelCEFR; usados: string[] }
  } = body as {
    questao_idx: number;
    acertou: boolean;
    estado: { score: number; nivel_corrente: NivelCEFR; usados: string[] };
  };

  const novoScore = acertou
    ? estado.score + PESOS[estado.nivel_corrente]
    : estado.score;

  const novoNivel: NivelCEFR = acertou
    ? subirNivel(estado.nivel_corrente)
    : descerNivel(estado.nivel_corrente);

  // Última questão (índice 9 = 10ª questão)
  if (questao_idx >= 9) {
    return NextResponse.json({
      fim: true,
      nivel: calcularNivelFinal(novoScore),
      score: novoScore,
    });
  }

  // Próxima questão
  const proxima = getQuestaoParaNivel(novoNivel, estado.usados);
  if (!proxima) {
    // Sem questões disponíveis para o nível — tenta o nível adjacente
    const alternativo = acertou ? estado.nivel_corrente : subirNivel(novoNivel);
    const proxAlt = getQuestaoParaNivel(alternativo, estado.usados);
    if (!proxAlt) {
      return NextResponse.json({
        fim: true,
        nivel: calcularNivelFinal(novoScore),
        score: novoScore,
      });
    }
    return NextResponse.json({
      fim: false,
      questao: proxAlt,
      estado: { score: novoScore, nivel_corrente: alternativo, usados: [...estado.usados, proxAlt.id] },
    });
  }

  return NextResponse.json({
    fim: false,
    questao: proxima,
    estado: { score: novoScore, nivel_corrente: novoNivel, usados: [...estado.usados, proxima.id] },
  });
}
