"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type FormData = {
  nome: string;
  email: string;
  senha: string;
  nivel: string;
};

export default function Cadastro() {
  const [passo, setPasso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    nivel: "",
  });

  const atualizar = (campo: keyof FormData, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErro("");
  };

  const avancar = () => {
    if (passo === 1) {
      if (!form.nome.trim()) return setErro("Digite seu nome.");
      if (!form.email.includes("@")) return setErro("Digite um e-mail válido.");
      if (form.senha.length < 6) return setErro("A senha precisa ter ao menos 6 caracteres.");
    }
    setErro("");
    setPasso((p) => p + 1);
  };

  const finalizar = async () => {
    if (!form.nivel) return setErro("Selecione seu nível.");
    setLoading(true);
    setErro("");
  
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          data: {
            nome: form.nome,
            nivel: form.nivel,
          }
        }
      });
    
      if (authError) {
        if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
          setErro("Este e-mail já está cadastrado. Tente fazer login.");
        } else {
          setErro(authError.message);
        }
        return;
      }
    
      if (!data.user) {
        setErro("Erro ao criar usuário. Tente novamente.");
        return;
      }
    
      setPasso(3);
    } catch (e: unknown) {
      if (e instanceof Error) setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  const niveis = [
    { valor: "iniciante", emoji: "🌱", titulo: "Iniciante", desc: "Estou começando em QA agora — quero aprender do zero" },
    { valor: "basico", emoji: "📖", titulo: "Praticante", desc: "Já trabalho com QA — conheço os conceitos básicos" },
    { valor: "intermediario", emoji: "🎯", titulo: "Especialista", desc: "Tenho experiência sólida em QA — quero me certificar" },
  ];

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

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#7a7a8a",
    marginBottom: "6px",
    display: "block",
    fontFamily: "sans-serif",
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
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.2rem", color: "#e8d5a3" }}>
          TestPath
        </span>
      </a>

      <div style={{
        background: "#0f0f18",
        border: "1px solid #1e1e2e",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "460px",
      }}>

        {/* TELA DE SUCESSO */}
        {passo === 3 ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h2 style={{ fontSize: "1.5rem", color: "#e8d5a3", fontFamily: "Georgia, serif", marginBottom: "0.75rem", fontWeight: "normal" }}>
              Conta criada, {form.nome.split(" ")[0]}!
            </h2>
            <p style={{ color: "#7a7a8a", marginBottom: "0.75rem", lineHeight: 1.6, fontSize: "14px" }}>
              Agora vamos configurar sua primeira certificação.
            </p>
            <p style={{ background: "#1a1a0e", border: "1px solid #c9a84c44", borderRadius: "8px", padding: "12px", color: "#c9a84c", fontSize: "13px", marginBottom: "2rem", lineHeight: 1.5 }}>
              📧 Verifique seu e-mail para confirmar a conta.
            </p>
            <a href="/inicio/ctfl" style={{
              background: "#c9a84c",
              color: "#0a0a0f",
              padding: "14px 32px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "15px",
              textDecoration: "none",
              display: "inline-block",
            }}>
              Configurar minha trilha CTFL →
            </a>
          </div>
        ) : (
          <>
            {/* Barra de progresso */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#7a7a8a" }}>Passo {passo} de 2</span>
                <span style={{ fontSize: "13px", color: "#c9a84c" }}>{Math.round((passo / 2) * 100)}%</span>
              </div>
              <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "4px" }}>
                <div style={{
                  background: "#c9a84c",
                  width: `${(passo / 2) * 100}%`,
                  height: "4px",
                  borderRadius: "99px",
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            {/* PASSO 1 — Dados da conta */}
            {passo === 1 && (
              <div>
                <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", marginBottom: "0.5rem", fontWeight: "normal" }}>
                  Crie sua conta
                </h2>
                <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.5rem" }}>
                  Grátis para sempre. Sem cartão de crédito.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Seu nome</label>
                    <input style={inputStyle} type="text" placeholder="Ex: João Silva" value={form.nome}
                      onChange={(e) => atualizar("nome", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && avancar()} />
                  </div>
                  <div>
                    <label style={labelStyle}>E-mail</label>
                    <input style={inputStyle} type="email" placeholder="seu@email.com" value={form.email}
                      onChange={(e) => atualizar("email", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && avancar()} />
                  </div>
                  <div>
                    <label style={labelStyle}>Senha</label>
                    <input style={inputStyle} type="password" placeholder="Mínimo 6 caracteres" value={form.senha}
                      onChange={(e) => atualizar("senha", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && avancar()} />
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 2 — Nível */}
            {passo === 2 && (
              <div>
                <h2 style={{ fontSize: "1.4rem", color: "#e8d5a3", fontFamily: "Georgia, serif", marginBottom: "0.5rem", fontWeight: "normal" }}>
                  Qual é o seu nível em QA?
                </h2>
                <p style={{ color: "#7a7a8a", fontSize: "14px", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                  Define o tom do conteúdo e dificuldade das questões em todas as suas certificações.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {niveis.map((n) => (
                    <button key={n.valor} onClick={() => atualizar("nivel", n.valor)}
                      style={{
                        background: form.nivel === n.valor ? "#1a1a0e" : "#0a0a0f",
                        border: `1px solid ${form.nivel === n.valor ? "#c9a84c" : "#2e2e3e"}`,
                        borderRadius: "10px", padding: "14px 16px",
                        display: "flex", alignItems: "center", gap: "12px",
                        cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s",
                      }}>
                      <span style={{ fontSize: "1.5rem" }}>{n.emoji}</span>
                      <div>
                        <div style={{ color: "#e8d5a3", fontSize: "14px", fontWeight: "bold" }}>{n.titulo}</div>
                        <div style={{ color: "#7a7a8a", fontSize: "12px", lineHeight: 1.4 }}>{n.desc}</div>
                      </div>
                      {form.nivel === n.valor && (
                        <span style={{ marginLeft: "auto", color: "#c9a84c" }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Erro */}
            {erro && (
              <div style={{ background: "#2a0a0a", border: "1px solid #aa3333", borderRadius: "8px", padding: "10px 14px", color: "#ff7777", fontSize: "13px", marginTop: "1rem" }}>
                {erro}
              </div>
            )}

            {/* Botões */}
            <div style={{ display: "flex", gap: "10px", marginTop: "1.75rem" }}>
              {passo > 1 && (
                <button onClick={() => setPasso((p) => p - 1)}
                  style={{ flex: 1, background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "12px", color: "#a0998e", fontSize: "15px", cursor: "pointer" }}>
                  ← Voltar
                </button>
              )}
              <button
                onClick={passo === 2 ? finalizar : avancar}
                disabled={loading || (passo === 2 && !form.nivel)}
                style={{
                  flex: 2, background: "#c9a84c", border: "none", borderRadius: "8px",
                  padding: "12px", color: "#0a0a0f", fontSize: "15px", fontWeight: "bold",
                  cursor: (loading || (passo === 2 && !form.nivel)) ? "not-allowed" : "pointer",
                  opacity: (loading || (passo === 2 && !form.nivel)) ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}>
                {loading ? "Criando conta..." : passo === 2 ? "Criar minha conta →" : "Continuar →"}
              </button>
            </div>

            {passo === 1 && (
              <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "13px", color: "#5a5a6a" }}>
                Já tem conta?{" "}
                <a href="/login" style={{ color: "#c9a84c", textDecoration: "none" }}>Entrar</a>
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}