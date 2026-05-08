// src/app/api/playwright/avaliar/route.ts
import { NextRequest, NextResponse } from "next/server";

// Stub — implementação completa na Fase 2
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.codigo) {
    return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
  }
  return NextResponse.json({
    score: 0,
    aprovado: false,
    mensagem: "Avaliação por IA disponível em breve.",
  });
}
