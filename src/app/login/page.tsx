"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const entrar = async () => {
    if (!email.includes("@")) return setErro("Digite um e-mail válido.");
    if (senha.length < 6) return setErro("A senha precisa ter ao menos 6 caracteres.");

    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      if (error.message.includes("Invalid login")) {
        setErro("E-mail ou senha incorretos.");
      } else if (error.message.includes("Email not confirmed")) {
        setErro("Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.");
      } else {
        setErro(error.message);
      }
      setLoading(false);
      return;
    }

    window.location.href = "/cursos";
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
    <main
      style={{
        fontFamily: "sans-serif",
        background: "#0b0f1a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* Logo */}
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
        }}>
          TestPath
        </span>
      </a>

      {/* Card */}
      <div
        style={{
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: "16px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h2 style={{ fontSize: "1.4rem", color: "#e5e7eb", fontFamily: "Georgia, serif", marginBottom: "0.5rem", fontWeight: "normal" }}>
          Bem-vindo de volta
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.75rem" }}>
          Entre para continuar seus estudos.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>E-mail</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro(""); }}
              onKeyDown={(e) => e.key === "Enter" && entrar()}
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", color: "#9ca3af" }}>Senha</label>
              <a href="/esqueci-senha" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>
                Esqueci a senha
              </a>
            </div>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: "44px" }}
                type={mostrarSenha ? "text" : "password"}
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => { setSenha(e.target.value); setErro(""); }}
                onKeyDown={(e) => e.key === "Enter" && entrar()}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(v => !v)}
                style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: "0",
                  color: "#6b7280", display: "flex", alignItems: "center",
                }}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", borderRadius: "8px", padding: "10px 14px", color: "#fca5a5", fontSize: "13px", marginTop: "1rem" }}>
            {erro}
          </div>
        )}

        {/* Botão entrar */}
        <button
          onClick={entrar}
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
            transition: "background 0.15s, box-shadow 0.15s",
            boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)",
          }}
        >
          {loading ? "Entrando..." : "Entrar →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "13px", color: "#9ca3af" }}>
          Não tem conta?{" "}
          <a href="/cadastro" style={{ color: "#3b82f6", textDecoration: "none" }}>
            Criar conta grátis
          </a>
        </p>
      </div>
    </main>
  );
}
