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
      <p style={{ color: "#7a7a8a" }}>Verificando...</p>
    </div>
  );

  if (estado === "erro") return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
      <h2 style={{ fontSize: "1.3rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
        Link inválido
      </h2>
      <p style={{ color: "#7a7a8a", fontSize: "14px" }}>
        Este link pode ter expirado. Acesse seu perfil para gerenciar notificações.
      </p>
      <a href="/perfil" style={{ display: "inline-block", marginTop: "1.5rem", color: "#c9a84c", fontSize: "14px" }}>
        Ir para o perfil →
      </a>
    </div>
  );

  if (estado === "cancelado") return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💛</div>
      <h2 style={{ fontSize: "1.3rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
        E-mails cancelados
      </h2>
      <p style={{ color: "#7a7a8a", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        Tudo bem! Você não vai mais receber lembretes por e-mail.
      </p>

      {/* Mensagem motivacional */}
      <div style={{ background: "#1a1a0e", border: "1px solid #c9a84c33", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
        <p style={{ fontSize: "13px", color: "#a09060", lineHeight: 1.6, margin: "0 0 8px" }}>
          🎯 <strong style={{ color: "#c9a84c" }}>Seu progresso continua salvo.</strong> Quando você quiser voltar, é só acessar o app.
        </p>
        <p style={{ fontSize: "13px", color: "#7a7a6a", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
          "A certificação CTFL não vai a lugar nenhum — ela vai continuar te esperando quando você estiver pronto." 📖
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/dashboard"
          style={{ background: "#c9a84c", color: "#0a0a0f", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", textDecoration: "none" }}>
          Continuar estudando
        </a>
        <a href="/perfil"
          style={{ background: "transparent", border: "1px solid #2e2e3e", color: "#a0998e", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", textDecoration: "none" }}>
          Reativar e-mails
        </a>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📧</div>
        <h2 style={{ fontSize: "1.3rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
          Cancelar lembretes por e-mail
        </h2>
        <p style={{ color: "#7a7a8a", fontSize: "14px", lineHeight: 1.6 }}>
          Você não vai mais receber lembretes de estudo por e-mail. Suas notificações no app continuam funcionando.
        </p>
      </div>

      {/* Motivo opcional */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ fontSize: "13px", color: "#7a7a8a", marginBottom: "8px", display: "block" }}>
          Pode nos dizer por quê? <span style={{ color: "#5a5a6a" }}>(opcional)</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {motivosSugestoes.map(m => (
            <button key={m} onClick={() => setMotivo(m === motivo ? "" : m)}
              style={{ background: motivo === m ? "#1a1a0e" : "#0a0a0f", border: `1px solid ${motivo === m ? "#c9a84c44" : "#2e2e3e"}`, borderRadius: "8px", padding: "8px 14px", color: motivo === m ? "#c9a84c" : "#7a7a8a", fontSize: "13px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              {motivo === m ? "✓ " : ""}{m}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <a href="/dashboard"
          style={{ flex: 1, background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "11px", color: "#a0998e", fontSize: "14px", textDecoration: "none", textAlign: "center" }}>
          Voltar
        </a>
        <button onClick={cancelar} disabled={cancelando}
          style={{ flex: 2, background: "#c06060", border: "none", borderRadius: "8px", padding: "11px", color: "#fff", fontSize: "14px", fontWeight: "bold", cursor: cancelando ? "not-allowed" : "pointer", opacity: cancelando ? 0.7 : 1 }}>
          {cancelando ? "Cancelando..." : "Confirmar cancelamento"}
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "12px", color: "#3a3a4a" }}>
        Você pode reativar a qualquer momento no seu perfil.
      </p>
    </div>
  );
}

export default function CancelarNotificacoes() {
  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", color: "#f0ede8", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "28px", height: "28px" }} />
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.2rem", color: "#e8d5a3" }}>TestPath</span>
      </a>
      <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "440px" }}>
        <Suspense fallback={<p style={{ color: "#7a7a8a", textAlign: "center" }}>Carregando...</p>}>
          <CancelarConteudo />
        </Suspense>
      </div>
    </main>
  );
}