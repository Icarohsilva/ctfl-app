import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { subscription, userId } = await req.json();
    console.log("Recebido subscription para:", userId);

    if (!subscription || !userId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const endpoint = subscription.endpoint;

    // Salva subscription por dispositivo (user_id + endpoint únicos)
    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert({
        user_id: userId,
        subscription,
        endpoint,
        ativo: true,
      }, { onConflict: "user_id,endpoint" })
      .select();

    console.log("Subscription salva:", { data, error });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Cria preferências se não existir
    await supabase.from("preferencias_notificacao").upsert({
      user_id: userId,
      push_ativo: true,
      email_ativo: true,
      horario_preferido: "20:00",
    }, { onConflict: "user_id", ignoreDuplicates: true });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro subscription:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("push_subscriptions").update({ ativo: false }).eq("user_id", userId);
  await supabase.from("preferencias_notificacao").update({ push_ativo: false }).eq("user_id", userId);

  return NextResponse.json({ ok: true });
}