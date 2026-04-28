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
      redirectTo: `${window.location.origin}/redefinir-senha`,
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
    background: "#0f0f18",
    border: "1px solid #2e2e3e",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#f0ede8",
    fontSize: "15px",
    fontFamily: "sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <main style={{
      fontFamily: "sans-serif",
      background: "#0a0a0f",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      {/* Logo */}
      <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "2rem" }}>
        <span style={{ fontSize: "1.5rem" }}>🧪</span>
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.2rem", color: "#e8d5a3" }}>TestPath</span>
      </a>

      <div style={{
        background: "#0f0f18",
        border: "1px solid #1e1e2e",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "420px",
      }}>
        {enviado ? (
          /* Tela de sucesso */
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
            <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
              E-mail enviado!
            </h2>
            <p style={{ color: "#7a7a8a", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Verifique sua caixa de entrada em <strong style={{ color: "#c9a84c" }}>{email}</strong> e clique no link para redefinir sua senha.
            </p>
            <p style={{ color: "#5a5a6a", fontSize: "12px", marginBottom: "1.5rem" }}>
              Não recebeu? Verifique a pasta de spam ou tente novamente.
            </p>
            <button
              onClick={() => setEnviado(false)}
              style={{ background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "10px 20px", color: "#a0998e", fontSize: "14px", cursor: "pointer", marginRight: "10px" }}
            >
              Reenviar
            </button>
            <a href="/login" style={{ color: "#c9a84c", fontSize: "14px", textDecoration: "none" }}>
              Voltar ao login
            </a>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
              Esqueceu sua senha?
            </h2>
            <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.75rem", lineHeight: 1.6 }}>
              Digite seu e-mail e enviaremos um link para você criar uma nova senha.
            </p>

            <div>
              <label style={{ fontSize: "13px", color: "#7a7a8a", marginBottom: "6px", display: "block" }}>E-mail</label>
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
              <div style={{ background: "#2a0a0a", border: "1px solid #aa3333", borderRadius: "8px", padding: "10px 14px", color: "#ff7777", fontSize: "13px", marginTop: "1rem" }}>
                {erro}
              </div>
            )}

            <button
              onClick={enviar}
              disabled={loading}
              style={{
                width: "100%",
                background: "#c9a84c",
                border: "none",
                borderRadius: "8px",
                padding: "13px",
                color: "#0a0a0f",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: "1.25rem",
              }}
            >
              {loading ? "Enviando..." : "Enviar link de redefinição →"}
            </button>

            <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "13px", color: "#5a5a6a" }}>
              Lembrou a senha?{" "}
              <a href="/login" style={{ color: "#c9a84c", textDecoration: "none" }}>Entrar</a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}