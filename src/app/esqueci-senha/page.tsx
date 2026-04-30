"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const enviar = async () => {
    if (!email.includes("@")) return setErro("Digite um e-mail válido.");
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://testpath.online/redefinir-senha",
    });

    if (error) {
      setErro("Erro ao enviar o e-mail. Verifique o endereço e tente novamente.");
    } else {
      setEnviado(true);
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0b0f1a",
    border: "1px solid #374151",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#e5e7eb",
    fontSize: "15px",
    fontFamily: "sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <main style={{
      fontFamily: "sans-serif",
      background: "#0b0f1a",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
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

      <div style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "420px",
      }}>
        {enviado ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
            <h2 style={{ fontSize: "1.4rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
              E-mail enviado!
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Verifique sua caixa de entrada em <strong style={{ color: "#3b82f6" }}>{email}</strong> e clique no link para redefinir sua senha.
            </p>
            <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "1.5rem" }}>
              Não recebeu? Verifique a pasta de spam ou tente novamente.
            </p>
            <button
              onClick={() => setEnviado(false)}
              style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "10px 20px", color: "#9ca3af", fontSize: "14px", cursor: "pointer", marginRight: "10px", transition: "border-color 0.15s, color 0.15s" }}
            >
              Reenviar
            </button>
            <a href="/login" style={{ color: "#3b82f6", fontSize: "14px", textDecoration: "none" }}>
              Voltar ao login
            </a>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: "1.4rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
              Esqueceu sua senha?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.75rem", lineHeight: 1.6 }}>
              Digite seu e-mail e enviaremos um link para você criar uma nova senha.
            </p>

            <div>
              <label style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>E-mail</label>
              <input
                style={inputStyle}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErro(""); }}
                onKeyDown={e => e.key === "Enter" && enviar()}
              />
            </div>

            {erro && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", borderRadius: "8px", padding: "10px 14px", color: "#fca5a5", fontSize: "13px", marginTop: "1rem" }}>
                {erro}
              </div>
            )}

            <button
              onClick={enviar}
              disabled={loading}
              style={{
                width: "100%",
                background: "#3b82f6",
                border: "1px solid #3b82f6",
                borderRadius: "8px",
                padding: "13px",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                marginTop: "1.25rem",
                boxShadow: loading ? "none" : "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)",
                transition: "background 0.15s, box-shadow 0.15s",
              }}
            >
              {loading ? "Enviando..." : "Enviar link de redefinição →"}
            </button>

            <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "13px", color: "#9ca3af" }}>
              Lembrou a senha?{" "}
              <a href="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>Entrar</a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
