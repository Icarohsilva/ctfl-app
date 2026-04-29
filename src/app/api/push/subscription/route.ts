import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { subscription, userId, horario } = await req.json();
  if (!subscription || !userId) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  // Salva subscription
  await supabase.from("push_subscriptions").upsert({
    user_id: userId,
    subscription,
    ativo: true,
  });

  // Cria preferências se não existir
  const { data: existing } = await supabase
    .from("preferencias_notificacao")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    await supabase.from("preferencias_notificacao").insert({
      user_id: userId,
      push_ativo: true,
      email_ativo: true,
      horario_preferido: horario || "20:00",
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  await supabase.from("push_subscriptions").update({ ativo: false }).eq("user_id", userId);
  await supabase.from("preferencias_notificacao").update({ push_ativo: false }).eq("user_id", userId);

  return NextResponse.json({ ok: true });
}