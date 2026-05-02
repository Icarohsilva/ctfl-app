import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TIPOS_VALIDOS = ["opiniao", "certificacao", "bug"] as const;
type Tipo = typeof TIPOS_VALIDOS[number];

const rotuloTipo: Record<Tipo, string> = {
  opiniao: "Opinião",
  certificacao: "Sugestão de Certificação",
  bug: "Bug Reportado",
};

export async function POST(req: NextRequest) {
  let body: { tipo: string; dados: Record<string, string | number> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { tipo, dados } = body;

  if (!TIPOS_VALIDOS.includes(tipo as Tipo) || !dados || typeof dados !== "object") {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  // Identificar usuário logado (opcional)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const authHeader = req.headers.get("authorization");
  let userId: string | null = null;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id ?? null;
  }

  // Inserir no Supabase
  const { error: dbError } = await supabase.from("feedbacks").insert({
    tipo,
    dados,
    user_id: userId,
  });

  if (dbError) {
    console.error("Erro ao salvar feedback:", dbError);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }

  // Enviar e-mail via Resend
  const linhasDados = Object.entries(dados)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#9ca3af;font-size:13px">${k}</td><td style="padding:6px 12px;color:#e5e7eb;font-size:13px">${v}</td></tr>`)
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/></head>
<body style="background:#0b0f1a;color:#e5e7eb;font-family:sans-serif;padding:32px">
  <h2 style="color:#d4af37;margin-bottom:8px">📬 Novo Feedback — TestPath</h2>
  <p style="color:#9ca3af;font-size:14px;margin-bottom:24px">
    Tipo: <strong style="color:#3b82f6">${rotuloTipo[tipo as Tipo]}</strong>
    ${userId ? ` · user_id: <code style="color:#6b7280">${userId}</code>` : ""}
  </p>
  <table style="border-collapse:collapse;width:100%;background:#111827;border-radius:8px">
    <tbody>${linhasDados}</tbody>
  </table>
  <p style="color:#374151;font-size:12px;margin-top:24px">
    ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
  </p>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "TestPath <noreply@testpath.online>",
      to: "icaro.silva@eteg.com.br",
      subject: `[TestPath Feedback] ${rotuloTipo[tipo as Tipo]} — ${new Date().toLocaleDateString("pt-BR")}`,
      html,
    }),
  }).catch(err => console.error("Erro ao enviar e-mail:", err));

  return NextResponse.json({ ok: true });
}
