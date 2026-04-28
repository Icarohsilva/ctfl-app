import { NextRequest, NextResponse } from "next/server";
import conteudo from "@/data/conteudo-topicos";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topicoId, perfil } = body;

  const topico = conteudo[topicoId];

  if (!topico) {
    return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });
  }

  const dica = perfil?.nivel === "iniciante"
    ? `${topico.dicaEstudo} Como iniciante, leia cada card com calma e tente criar seus próprios exemplos.`
    : perfil?.nivel === "intermediario"
    ? `${topico.dicaEstudo} Você já tem base — foque nas nuances e nos detalhes que o exame explora.`
    : topico.dicaEstudo;

  return NextResponse.json({
    narrativa: topico.narrativa,
    cards: topico.cards,
    dicaPersonalizada: dica,
  });
}