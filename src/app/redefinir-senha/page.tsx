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
      setTimeout(() => { window.location.href = "/dashboard"; }, 3000);
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
        {sucesso ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ fontSize: "1.4rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
              Senha redefinida!
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "1rem" }}>
              Sua senha foi atualizada com sucesso.
            </p>
            <p style={{ color: "#6b7280", fontSize: "13px" }}>
              Redirecionando para o dashboard...
            </p>
          </div>
        ) : !pronto ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ fontSize: "1.4rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem" }}>
              Verificando link...
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Aguarde enquanto validamos seu link de redefinição.
            </p>
            <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "1.5rem" }}>
              Se demorar muito, o link pode ter expirado.{" "}
              <a href="/esqueci-senha" style={{ color: "#3b82f6", textDecoration: "none" }}>Solicitar novo link</a>
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: "1.4rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
              Criar nova senha
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.75rem" }}>
              Escolha uma senha forte com pelo menos 6 caracteres.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>Nova senha</label>
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro(""); }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>Confirmar nova senha</label>
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

            {senha.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px" }}>
                  <div style={{
                    background: senha.length < 6 ? "#ef4444" : senha.length < 10 ? "#f59e0b" : "#22c55e",
                    width: `${Math.min(100, (senha.length / 12) * 100)}%`,
                    height: "4px",
                    borderRadius: "99px",
                    transition: "all 0.3s",
                  }} />
                </div>
                <div style={{ fontSize: "11px", color: senha.length < 6 ? "#ef4444" : senha.length < 10 ? "#f59e0b" : "#22c55e", marginTop: "4px" }}>
                  {senha.length < 6 ? "Muito curta" : senha.length < 10 ? "Razoável" : "Forte ✓"}
                </div>
              </div>
            )}

            {erro && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", borderRadius: "8px", padding: "10px 14px", color: "#fca5a5", fontSize: "13px", marginTop: "1rem" }}>
                {erro}
              </div>
            )}

            <button
              onClick={redefinir}
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
              {loading ? "Salvando..." : "Salvar nova senha →"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
