"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function RedefinirSenha() {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    // O Supabase redireciona com o token na URL — aguarda sessão ser estabelecida
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPronto(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const redefinir = async () => {
    if (senha.length < 6) return setErro("A senha precisa ter ao menos 6 caracteres.");
    if (senha !== confirmar) return setErro("As senhas não coincidem.");

    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      setErro("Erro ao redefinir a senha. O link pode ter expirado. Solicite um novo.");
    } else {
      setSucesso(true);
      // Redireciona para o dashboard após 3 segundos
      setTimeout(() => { window.location.href = "/dashboard"; }, 3000);
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
        {sucesso ? (
          /* Tela de sucesso */
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
              Senha redefinida!
            </h2>
            <p style={{ color: "#7a7a8a", fontSize: "14px", lineHeight: 1.6, marginBottom: "1rem" }}>
              Sua senha foi atualizada com sucesso.
            </p>
            <p style={{ color: "#5a5a6a", fontSize: "13px" }}>
              Redirecionando para o dashboard...
            </p>
          </div>
        ) : !pronto ? (
          /* Aguardando token */
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
              Verificando link...
            </h2>
            <p style={{ color: "#7a7a8a", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Aguarde enquanto validamos seu link de redefinição.
            </p>
            <p style={{ color: "#5a5a6a", fontSize: "12px", marginBottom: "1.5rem" }}>
              Se demorar muito, o link pode ter expirado.{" "}
              <a href="/esqueci-senha" style={{ color: "#c9a84c", textDecoration: "none" }}>Solicitar novo link</a>
            </p>
          </div>
        ) : (
          /* Formulário de nova senha */
          <>
            <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
              Criar nova senha
            </h2>
            <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.75rem" }}>
              Escolha uma senha forte com pelo menos 6 caracteres.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#7a7a8a", marginBottom: "6px", display: "block" }}>Nova senha</label>
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro(""); }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#7a7a8a", marginBottom: "6px", display: "block" }}>Confirmar nova senha</label>
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmar}
                  onChange={e => { setConfirmar(e.target.value); setErro(""); }}
                  onKeyDown={e => e.key === "Enter" && redefinir()}
                />
              </div>
            </div>

            {/* Indicador de força da senha */}
            {senha.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "4px" }}>
                  <div style={{
                    background: senha.length < 6 ? "#c06060" : senha.length < 10 ? "#c9a84c" : "#4e9e4e",
                    width: `${Math.min(100, (senha.length / 12) * 100)}%`,
                    height: "4px",
                    borderRadius: "99px",
                    transition: "all 0.3s",
                  }} />
                </div>
                <div style={{ fontSize: "11px", color: senha.length < 6 ? "#c06060" : senha.length < 10 ? "#c9a84c" : "#4e9e4e", marginTop: "4px" }}>
                  {senha.length < 6 ? "Muito curta" : senha.length < 10 ? "Razoável" : "Forte ✓"}
                </div>
              </div>
            )}

            {erro && (
              <div style={{ background: "#2a0a0a", border: "1px solid #aa3333", borderRadius: "8px", padding: "10px 14px", color: "#ff7777", fontSize: "13px", marginTop: "1rem" }}>
                {erro}
              </div>
            )}

            <button
              onClick={redefinir}
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
              {loading ? "Salvando..." : "Salvar nova senha →"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}