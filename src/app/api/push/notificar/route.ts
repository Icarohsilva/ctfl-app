import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

function criarSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verificarToken(req: NextRequest) {
  const token = req.headers.get("x-cron-token");
  return token === process.env.CRON_SECRET;
}

export async function POST(req: NextRequest) {
  if (!verificarToken(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = criarSupabase();
  const hoje = new Date().toISOString().split("T")[0];

  console.log("Notificar rodando para data:", hoje);

  // 1. Busca usuários que NÃO estudaram hoje
  const { data: usuarios, error: errUsuarios } = await supabase
    .from("usuario_certificacoes")
    .select("user_id, certificacao_id, streak")
    .neq("ultimo_estudo", hoje)
    .eq("status", "em_andamento");

  console.log("Usuários para notificar:", usuarios?.length, errUsuarios);

  if (!usuarios || usuarios.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0, motivo: "todos estudaram hoje" });
  }

  let pushEnviados = 0;
  let emailsEnviados = 0;

  for (const u of usuarios) {
    try {
      // 2. Busca perfil
      const { data: perfil } = await supabase
        .from("profiles")
        .select("nome")
        .eq("id", u.user_id)
        .single();

      // 3. Busca preferências
      const { data: pref } = await supabase
        .from("preferencias_notificacao")
        .select("push_ativo, email_ativo, token_cancelamento")
        .eq("user_id", u.user_id)
        .single();

      if (!pref) {
        console.log("Sem preferências para:", u.user_id);
        continue;
      }

      const nome = perfil?.nome?.split(" ")[0] || "QA";
      const streak = u.streak || 0;

      const mensagem = streak > 0
        ? `Não quebra o streak de ${streak} dias! 🔥 Só 15 min hoje já conta.`
        : `Que tal estudar hoje? Cada tópico te deixa mais perto da certificação. 🎯`;

      // 4. PUSH NOTIFICATION
      if (pref.push_ativo) {
        const { data: sub } = await supabase
          .from("push_subscriptions")
          .select("subscription")
          .eq("user_id", u.user_id)
          .eq("ativo", true)
          .single();

        if (sub?.subscription) {
          try {
            await webpush.sendNotification(
              sub.subscription,
              JSON.stringify({
                title: `Oi, ${nome}! 👋`,
                body: mensagem,
                url: "/dashboard",
              })
            );
            pushEnviados++;
            console.log("Push enviado para:", nome);
          } catch (pushError) {
            console.error("Erro push para", u.user_id, pushError);
            // Subscription expirada — desativa
            await supabase
              .from("push_subscriptions")
              .update({ ativo: false })
              .eq("user_id", u.user_id);
          }
        } else {
          console.log("Sem subscription push para:", u.user_id);
        }
      }

      // 5. EMAIL
      if (pref.email_ativo) {
        const { data: authUser } = await supabase.auth.admin.getUserById(u.user_id);
        const email = authUser?.user?.email;

        if (email) {
          await enviarEmailLembrete(
            email, nome, mensagem, streak, pref.token_cancelamento
          );
          emailsEnviados++;
          console.log("Email enviado para:", email);
        }
      }

    } catch (e) {
      console.error("Erro ao processar usuário", u.user_id, e);
    }
  }

  return NextResponse.json({
    ok: true,
    pushEnviados,
    emailsEnviados,
    totalUsuarios: usuarios.length,
  });
}

async function enviarEmailLembrete(
  email: string,
  nome: string,
  mensagem: string,
  streak: number,
  tokenCancelamento: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://testpath.online";
  const cancelUrl = `${siteUrl}/cancelar-notificacoes?token=${tokenCancelamento}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TestPath — Lembrete de estudo</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1a1a0e;border:1px solid #c9a84c44;border-radius:12px;padding:12px 20px;">
                    <span style="font-size:20px;font-weight:700;color:#e8d5a3;font-family:Georgia,serif;">TestPath</span>
                    <span style="font-size:11px;color:#c9a84c;background:#0a0a0f;border:1px solid #c9a84c33;border-radius:99px;padding:2px 8px;margin-left:8px;">CTFL</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card principal -->
          <tr>
            <td style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:16px;padding:40px 40px 32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:20px;">${streak > 0 ? "🔥" : "📖"}</div>
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:400;color:#e8d5a3;font-family:Georgia,serif;line-height:1.3;">
                Oi, ${nome}!
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#a0998e;line-height:1.7;max-width:400px;margin-left:auto;margin-right:auto;">
                ${mensagem}
              </p>

              ${streak > 0 ? `
              <div style="display:inline-block;background:#1a1000;border:1px solid #c9a84c44;border-radius:10px;padding:10px 20px;margin-bottom:28px;">
                <span style="font-size:20px;">🔥</span>
                <span style="font-size:14px;color:#c9a84c;font-weight:600;margin-left:6px;">${streak} dias consecutivos</span>
                <p style="margin:4px 0 0;font-size:12px;color:#7a6a3a;">Não deixa essa sequência quebrar!</p>
              </div>
              ` : ""}

              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:#c9a84c;border-radius:10px;padding:14px 32px;">
                    <a href="${siteUrl}/dashboard"
                       style="color:#0a0a0f;font-size:15px;font-weight:700;text-decoration:none;display:block;">
                      Estudar agora →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Motivacional -->
          <tr>
            <td style="padding:20px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:12px;padding:20px;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 8px;font-size:13px;color:#5a5a6a;">
                      A certificação CTFL está ao seu alcance.
                    </p>
                    <p style="margin:0;font-size:12px;color:#3a3a4a;font-style:italic;">
                      "Consistência bate intensidade. Um passo por dia é o suficiente." 🎯
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:8px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#3a3a4a;">
                Você recebe este e-mail porque se cadastrou no TestPath.
              </p>
              <p style="margin:0;font-size:11px;color:#2a2a3a;">
                <a href="${cancelUrl}" style="color:#3a3a4a;text-decoration:underline;">
                  Cancelar lembretes por e-mail
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
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
      to: email,
      subject: streak > 0
        ? `🔥 ${nome}, não quebra o streak de ${streak} dias!`
        : `📖 ${nome}, que tal estudar hoje?`,
      html,
    }),
  });
}