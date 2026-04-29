import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import Groq from "groq-sdk";

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
  return req.headers.get("x-cron-token") === process.env.CRON_SECRET;
}

// -------------------------------------------------------
// CALCULA CONTEXTO DO USUÁRIO
// -------------------------------------------------------
function calcularContexto(u: {
  streak: number;
  diasSemEstudar: number;
  progresso: number;
  diasParaMeta: number | null;
  nome: string;
  nivel: string;
}) {
  const { diasSemEstudar, diasParaMeta, streak, progresso } = u;

  // Tipos de alerta por prioridade
  if (diasParaMeta === 0) return { tipo: "prova_hoje", prioridade: "urgente" };
  if (diasParaMeta === 1) return { tipo: "prova_amanha", prioridade: "urgente" };
  if (diasParaMeta !== null && diasParaMeta <= 3) return { tipo: "prova_proxima", prioridade: "alta" };
  if (diasParaMeta !== null && diasParaMeta <= 7) return { tipo: "prova_semana", prioridade: "media" };
  if (diasSemEstudar === 4) return { tipo: "ultimo_aviso", prioridade: "critica" };
  if (diasSemEstudar === 3) return { tipo: "ausencia_3dias", prioridade: "alta" };
  if (diasSemEstudar === 2) return { tipo: "ausencia_2dias", prioridade: "media" };
  if (diasSemEstudar === 1) {
    if (streak > 7) return { tipo: "streak_risco_alto", prioridade: "media" };
    if (streak > 0) return { tipo: "streak_risco", prioridade: "leve" };
    return { tipo: "lembrete_normal", prioridade: "leve" };
  }
  if (progresso > 80) return { tipo: "quase_la", prioridade: "motivacao" };
  return { tipo: "lembrete_normal", prioridade: "leve" };
}

// -------------------------------------------------------
// GERA MENSAGEM COM GROQ
// -------------------------------------------------------
async function gerarMensagemIA(contexto: {
  tipo: string;
  prioridade: string;
  nome: string;
  streak: number;
  diasSemEstudar: number;
  progresso: number;
  diasParaMeta: number | null;
  nivel: string;
}): Promise<{ titulo: string; corpo: string; assuntoEmail: string }> {

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const descricaoContexto: Record<string, string> = {
    prova_hoje: "A prova do usuário é HOJE. Mensagem de apoio e incentivo de última hora.",
    prova_amanha: "A prova é AMANHÃ. Mensagem encorajadora, diga para revisar pontos principais e dormir bem.",
    prova_proxima: `A prova é em ${contexto.diasParaMeta} dias. Urgência alta mas positiva.`,
    prova_semana: `A prova é em ${contexto.diasParaMeta} dias. Lembrete motivador para intensificar.`,
    ultimo_aviso: "4º dia sem estudar. Este é o ÚLTIMO lembrete — depois silêncio total por 7 dias. Tom: sério mas sem julgamento, faz o usuário sentir que está perdendo algo.",
    ausencia_3dias: "3 dias sem estudar. Tom mais urgente e engraçado. Pode usar humor auto-depreciativo sobre procrastinação.",
    ausencia_2dias: "2 dias sem estudar. Tom um pouco mais preocupado mas ainda leve. Pode fazer piada sobre a situação.",
    streak_risco_alto: `Streak de ${contexto.streak} dias em risco! Tom de suspense dramático e engraçado.`,
    streak_risco: `Streak de ${contexto.streak} dias pode quebrar. Tom motivador e leve.`,
    quase_la: `Usuário está com ${contexto.progresso}% do conteúdo. Está quase lá! Tom comemorativo e motivador.`,
    lembrete_normal: "Lembrete diário normal. Tom leve, motivador e engraçado.",
  };

  const prompt = `Você é o assistente do TestPath, app de preparação para certificação CTFL.
Crie uma notificação push E um assunto de e-mail para este contexto:

USUÁRIO: ${contexto.nome} (nível: ${contexto.nivel})
SITUAÇÃO: ${descricaoContexto[contexto.tipo] || "Lembrete de estudo"}
STREAK: ${contexto.streak} dias consecutivos
DIAS SEM ESTUDAR: ${contexto.diasSemEstudar}
PROGRESSO NO CTFL: ${contexto.progresso}%

REGRAS:
- Título da push: máximo 50 caracteres, impactante
- Corpo da push: máximo 100 caracteres, específico para a situação
- Assunto do email: criativo, use emojis, máximo 60 caracteres
- Tom: ${contexto.prioridade === "leve" ? "leve e divertido" : contexto.prioridade === "media" ? "motivador com humor" : contexto.prioridade === "alta" ? "urgente mas não agressivo" : contexto.prioridade === "urgente" ? "encorajador e positivo" : "sério mas empático"}
- Personalize com o nome ${contexto.nome}
- Seja criativo, use humor quando apropriado
- NÃO use frases genéricas como "não esqueça de estudar"
- Para "ultimo_aviso": deixe claro que é o último lembrete antes do silêncio

Responda APENAS com JSON:
{"titulo": "...", "corpo": "...", "assuntoEmail": "..."}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Você cria notificações criativas e personalizadas. Responda APENAS com JSON válido." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 200,
    });

    const texto = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(texto.replace(/```json|```/g, "").trim());
  } catch {
    // Fallback se Groq falhar
    const fallbacks: Record<string, { titulo: string; corpo: string; assuntoEmail: string }> = {
      ultimo_aviso: {
        titulo: `${contexto.nome}, último aviso! 🚨`,
        corpo: "4 dias sem estudar. Depois disso, silêncio total por 7 dias.",
        assuntoEmail: `🚨 ${contexto.nome}, este é seu último lembrete`,
      },
      ausencia_3dias: {
        titulo: `3 dias, ${contexto.nome}... 😬`,
        corpo: "Sua trilha CTFL está te esperando. Que tal 15 minutos hoje?",
        assuntoEmail: `😬 ${contexto.nome}, 3 dias sem aparecer no TestPath`,
      },
      prova_hoje: {
        titulo: `Hoje é o dia, ${contexto.nome}! 💪`,
        corpo: "Você se preparou para isso. Confia em você!",
        assuntoEmail: `💪 ${contexto.nome}, hoje é o dia da sua prova CTFL!`,
      },
      default: {
        titulo: `Oi, ${contexto.nome}! 👋`,
        corpo: "Que tal estudar hoje? Cada tópico te deixa mais perto do certificado.",
        assuntoEmail: `📖 ${contexto.nome}, hora de estudar CTFL!`,
      },
    };
    return fallbacks[contexto.tipo] || fallbacks.default;
  }
}

// -------------------------------------------------------
// ROTA PRINCIPAL
// -------------------------------------------------------
export async function POST(req: NextRequest) {
  if (!verificarToken(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = criarSupabase();
  const hoje = new Date().toISOString().split("T")[0];

  console.log("Notificar rodando:", hoje);

  // Busca usuários que NÃO estudaram hoje
  const { data: usuarios } = await supabase
    .from("usuario_certificacoes")
    .select("user_id, certificacao_id, streak, ultimo_estudo, data_meta, pontos, semana_atual")
    .neq("ultimo_estudo", hoje)
    .eq("status", "em_andamento");

  if (!usuarios || usuarios.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0, motivo: "todos estudaram hoje" });
  }

  let pushEnviados = 0;
  let emailsEnviados = 0;
  let silenciados = 0;

  for (const u of usuarios) {
    try {
      // Calcula dias sem estudar
      const ultimoEstudo = u.ultimo_estudo ? new Date(u.ultimo_estudo) : null;
      const diasSemEstudar = ultimoEstudo
        ? Math.floor((Date.now() - ultimoEstudo.getTime()) / 86400000)
        : 999;

      // Após 4 dias → silêncio por 7 dias
      if (diasSemEstudar > 4 && diasSemEstudar <= 11) {
        silenciados++;
        console.log(`Usuário ${u.user_id} em silêncio (${diasSemEstudar} dias)`);
        continue;
      }

      // Mais de 11 dias → volta a notificar semanalmente
      if (diasSemEstudar > 11 && diasSemEstudar % 7 !== 0) continue;

      // Calcula dias para a meta
      const diasParaMeta = u.data_meta
        ? Math.max(0, Math.ceil((new Date(u.data_meta).getTime() - Date.now()) / 86400000))
        : null;

      // Progresso estimado
      const progresso = Math.round(((u.semana_atual || 1) - 1) / 8 * 100);

      // Busca perfil
      const { data: perfil } = await supabase
        .from("profiles")
        .select("nome, nivel")
        .eq("id", u.user_id)
        .single();

      // Busca preferências
      const { data: pref } = await supabase
        .from("preferencias_notificacao")
        .select("push_ativo, email_ativo, token_cancelamento")
        .eq("user_id", u.user_id)
        .single();

      if (!pref) continue;

      const nome = perfil?.nome?.split(" ")[0] || "QA";
      const nivel = perfil?.nivel || "iniciante";

      // Calcula contexto
      const contexto = calcularContexto({
        nome, nivel, streak: u.streak || 0,
        diasSemEstudar, progresso, diasParaMeta,
      });

      console.log(`${nome}: ${contexto.tipo} (${diasSemEstudar} dias sem estudar)`);

      // Gera mensagem personalizada com IA
      const mensagem = await gerarMensagemIA({
        ...contexto, nome, nivel,
        streak: u.streak || 0,
        diasSemEstudar, progresso, diasParaMeta,
      });

      console.log(`Mensagem gerada: "${mensagem.titulo}" / "${mensagem.corpo}"`);

      // PUSH — todos os dispositivos
      if (pref.push_ativo) {
        const { data: subs } = await supabase
          .from("push_subscriptions")
          .select("subscription, endpoint")
          .eq("user_id", u.user_id)
          .eq("ativo", true);

        for (const sub of subs || []) {
          try {
            await webpush.sendNotification(
              sub.subscription,
              JSON.stringify({
                title: mensagem.titulo,
                body: mensagem.corpo,
                url: "/dashboard",
              })
            );
            pushEnviados++;
          } catch (pushError: unknown) {
            const err = pushError as { statusCode?: number };
            if (err.statusCode === 410 || err.statusCode === 404) {
              await supabase.from("push_subscriptions")
                .update({ ativo: false })
                .eq("user_id", u.user_id)
                .eq("endpoint", sub.endpoint);
            }
          }
        }
      }

      // EMAIL
      if (pref.email_ativo) {
        const { data: authUser } = await supabase.auth.admin.getUserById(u.user_id);
        const email = authUser?.user?.email;

        if (email) {
          await enviarEmail(
            email, nome, mensagem,
            contexto.tipo, u.streak || 0,
            diasParaMeta, pref.token_cancelamento
          );
          emailsEnviados++;
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
    silenciados,
    totalUsuarios: usuarios.length,
  });
}

// -------------------------------------------------------
// ENVIO DE EMAIL
// -------------------------------------------------------
async function enviarEmail(
  email: string,
  nome: string,
  mensagem: { titulo: string; corpo: string; assuntoEmail: string },
  tipo: string,
  streak: number,
  diasParaMeta: number | null,
  tokenCancelamento: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://testpath.online";
  const cancelUrl = `${siteUrl}/cancelar-notificacoes?token=${tokenCancelamento}`;

  const isUrgente = ["prova_hoje", "prova_amanha", "ultimo_aviso"].includes(tipo);
  const corDestaque = isUrgente ? "#c06060" : "#c9a84c";
  const icone = tipo === "prova_hoje" ? "🏆" :
    tipo === "prova_amanha" ? "📋" :
    tipo === "ultimo_aviso" ? "🚨" :
    tipo.includes("ausencia") ? "😴" :
    streak > 7 ? "🔥" : "📖";

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:28px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="background:#1a1a0e;border:1px solid #c9a84c44;border-radius:12px;padding:10px 18px;">
              <span style="font-size:18px;font-weight:700;color:#e8d5a3;font-family:Georgia,serif;">TestPath</span>
              <span style="font-size:10px;color:#c9a84c;background:#0a0a0f;border:1px solid #c9a84c33;border-radius:99px;padding:2px 7px;margin-left:6px;">CTFL</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Card principal -->
        <tr><td style="background:#0f0f18;border:1px solid ${isUrgente ? "#5e2e2e" : "#1e1e2e"};border-radius:16px;padding:36px 36px 28px;text-align:center;">
          <div style="font-size:44px;margin-bottom:16px;">${icone}</div>
          <h1 style="margin:0 0 10px;font-size:22px;font-weight:400;color:#e8d5a3;font-family:Georgia,serif;line-height:1.3;">
            ${mensagem.titulo}
          </h1>
          <p style="margin:0 0 24px;font-size:15px;color:#a0998e;line-height:1.7;max-width:380px;margin-left:auto;margin-right:auto;">
            ${mensagem.corpo}
          </p>

          ${streak > 0 && !isUrgente ? `
          <div style="display:inline-block;background:#1a1000;border:1px solid #c9a84c44;border-radius:10px;padding:8px 16px;margin-bottom:24px;">
            <span style="font-size:16px;">🔥</span>
            <span style="font-size:13px;color:#c9a84c;font-weight:600;margin-left:4px;">${streak} dias de streak</span>
          </div>` : ""}

          ${diasParaMeta !== null && diasParaMeta <= 7 ? `
          <div style="display:inline-block;background:#1a0e0e;border:1px solid #5e2e2e;border-radius:10px;padding:8px 16px;margin-bottom:24px;">
            <span style="font-size:16px;">⏰</span>
            <span style="font-size:13px;color:#c06060;font-weight:600;margin-left:4px;">
              ${diasParaMeta === 0 ? "Prova HOJE!" : diasParaMeta === 1 ? "Prova AMANHÃ!" : `${diasParaMeta} dias para a prova`}
            </span>
          </div>` : ""}

          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td style="background:${corDestaque};border-radius:10px;padding:13px 28px;">
              <a href="${siteUrl}/dashboard" style="color:#0a0a0f;font-size:14px;font-weight:700;text-decoration:none;display:block;">
                ${tipo === "prova_hoje" ? "Ir para revisão final →" : "Estudar agora →"}
              </a>
            </td></tr>
          </table>
        </td></tr>

        ${tipo === "ultimo_aviso" ? `
        <tr><td style="padding:16px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0e0e;border:1px solid #3e1e1e;border-radius:12px;padding:16px;">
            <tr><td align="center">
              <p style="margin:0;font-size:13px;color:#7a4a4a;line-height:1.6;">
                Este é seu último lembrete por agora. Ficaremos em silêncio pelos próximos 7 dias —
                mas seu progresso continua salvo e você pode voltar quando quiser. 💛
              </p>
            </td></tr>
          </table>
        </td></tr>` : `
        <tr><td style="padding:16px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f18;border:1px solid #1e1e2e;border-radius:12px;padding:16px;">
            <tr><td align="center">
              <p style="margin:0;font-size:12px;color:#3a3a4a;font-style:italic;">
                "Consistência bate intensidade. Um passo por dia é o suficiente." 🎯
              </p>
            </td></tr>
          </table>
        </td></tr>`}

        <!-- Footer -->
        <tr><td style="padding-top:8px;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;color:#3a3a4a;">
            Você recebe este e-mail porque se cadastrou no TestPath.
          </p>
          <p style="margin:0;font-size:11px;color:#2a2a3a;">
            <a href="${cancelUrl}" style="color:#3a3a4a;text-decoration:underline;">Cancelar lembretes por e-mail</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
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
      subject: mensagem.assuntoEmail,
      html,
    }),
  });
}