"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

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

    window.location.href = "/dashboard";
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
    <main
      style={{
        fontFamily: "sans-serif",
        background: "#0a0a0f",
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
        <span style={{ fontSize: "1.5rem" }}>🧪</span>
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.2rem", color: "#e8d5a3" }}>
          TestPath
        </span>
      </a>

      {/* Card */}
      <div
        style={{
          background: "#0f0f18",
          border: "1px solid #1e1e2e",
          borderRadius: "16px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", marginBottom: "0.5rem", fontWeight: "normal" }}>
          Bem-vindo de volta
        </h2>
        <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.75rem" }}>
          Entre para continuar sua trilha CTFL.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "13px", color: "#7a7a8a", marginBottom: "6px", display: "block" }}>E-mail</label>
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
              <label style={{ fontSize: "13px", color: "#7a7a8a" }}>Senha</label>
              <a href="/esqueci-senha" style={{ fontSize: "12px", color: "#c9a84c", textDecoration: "none" }}>
                Esqueci a senha
              </a>
            </div>
            <input
              style={inputStyle}
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setErro(""); }}
              onKeyDown={(e) => e.key === "Enter" && entrar()}
            />
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div style={{ background: "#2a0a0a", border: "1px solid #aa3333", borderRadius: "8px", padding: "10px 14px", color: "#ff7777", fontSize: "13px", marginTop: "1rem" }}>
            {erro}
          </div>
        )}

        {/* Botão entrar */}
        <button
          onClick={entrar}
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
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Entrando..." : "Entrar →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "13px", color: "#5a5a6a" }}>
          Não tem conta?{" "}
          <a href="/cadastro" style={{ color: "#c9a84c", textDecoration: "none" }}>
            Criar conta grátis
          </a>
        </p>
      </div>
    </main>
  );
}