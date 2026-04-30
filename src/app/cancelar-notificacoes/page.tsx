"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function CancelarConteudo() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [estado, setEstado] = useState<"carregando" | "confirmar" | "cancelado" | "erro">("carregando");
  const [motivo, setMotivo] = useState("");
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    if (token) setEstado("confirmar");
    else setEstado("erro");
  }, [token]);

  const cancelar = async () => {
    if (!token) return;
    setCancelando(true);

    const { error } = await supabase
      .from("preferencias_notificacao")
      .update({ email_ativo: false })
      .eq("token_cancelamento", token);

    if (error) { setEstado("erro"); setCancelando(false); return; }
    setEstado("cancelado");
    setCancelando(false);
  };

  const motivosSugestoes = [
    "Recebo e-mails demais",
    "Não estou estudando agora",
    "Prefiro só as notificações no app",
    "O conteúdo não é relevante",
    "Outro motivo",
  ];

  if (estado === "carregando") return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#9ca3af" }}>Verificando...</p>
    </div>
  );

  if (estado === "erro") return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
      <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
        Link inválido
      </h2>
      <p style={{ color: "#9ca3af", fontSize: "14px" }}>
        Este link pode ter expirado. Acesse seu perfil para gerenciar notificações.
      </p>
      <a href="/perfil" style={{ display: "inline-block", marginTop: "1.5rem", color: "#3b82f6", fontSize: "14px" }}>
        Ir para o perfil →
      </a>
    </div>
  );

  if (estado === "cancelado") return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👋</div>
      <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
        E-mails cancelados
      </h2>
      <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        Tudo bem! Você não vai mais receber lembretes por e-mail.
      </p>

      <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
        <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.6, margin: "0 0 8px" }}>
          🎯 <strong style={{ color: "#3b82f6" }}>Seu progresso continua salvo.</strong> Quando você quiser voltar, é só acessar o app.
        </p>
        <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
          "A certificação CTFL não vai a lugar nenhum — ela vai continuar te esperando quando você estiver pronto." 📖
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/dashboard"
          style={{ background: "#3b82f6", color: "#ffffff", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", textDecoration: "none", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)" }}>
          Continuar estudando
        </a>
        <a href="/perfil"
          style={{ background: "transparent", border: "1px solid #374151", color: "#9ca3af", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", textDecoration: "none" }}>
          Reativar e-mails
        </a>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📧</div>
        <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
          Cancelar lembretes por e-mail
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6 }}>
          Você não vai mais receber lembretes de estudo por e-mail. Suas notificações no app continuam funcionando.
        </p>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "8px", display: "block" }}>
          Pode nos dizer por quê? <span style={{ color: "#6b7280" }}>(opcional)</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {motivosSugestoes.map(m => (
            <button key={m} onClick={() => setMotivo(m === motivo ? "" : m)}
              style={{ background: motivo === m ? "rgba(59,130,246,0.08)" : "#0b0f1a", border: `1px solid ${motivo === m ? "#3b82f6" : "#374151"}`, borderRadius: "8px", padding: "8px 14px", color: motivo === m ? "#3b82f6" : "#9ca3af", fontSize: "13px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              {motivo === m ? "✓ " : ""}{m}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <a href="/dashboard"
          style={{ flex: 1, background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "11px", color: "#9ca3af", fontSize: "14px", textDecoration: "none", textAlign: "center" }}>
          Voltar
        </a>
        <button onClick={cancelar} disabled={cancelando}
          style={{ flex: 2, background: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", padding: "11px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: cancelando ? "not-allowed" : "pointer", opacity: cancelando ? 0.6 : 1 }}>
          {cancelando ? "Cancelando..." : "Confirmar cancelamento"}
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "12px", color: "#6b7280" }}>
        Você pode reativar a qualquer momento no seu perfil.
      </p>
    </div>
  );
}

export default function CancelarNotificacoes() {
  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "28px", height: "28px" }} />
        <span style={{
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          fontSize: "1.2rem",
          background: "linear-gradient(135deg, #d4af37, #f5d76e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>TestPath</span>
      </a>
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "440px" }}>
        <Suspense fallback={<p style={{ color: "#9ca3af", textAlign: "center" }}>Carregando...</p>}>
          <CancelarConteudo />
        </Suspense>
      </div>
    </main>
  );
}
