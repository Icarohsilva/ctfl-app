"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type FormData = {
  nome: string;
  email: string;
  senha: string;
  nivel: string;
};

function validarSenha(senha: string): string {
  if (senha.length < 8) return "A senha precisa ter ao menos 8 caracteres.";
  if (!/[A-Z]/.test(senha)) return "Adicione ao menos uma letra maiúscula.";
  if (!/[0-9]/.test(senha)) return "Adicione ao menos um número.";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return "Adicione ao menos um caractere especial (!@#$%...).";
  return "";
}

function forca(senha: string): { nivel: number; texto: string; cor: string } {
  if (senha.length === 0) return { nivel: 0, texto: "", cor: "#1f2937" };
  if (senha.length < 6) return { nivel: 1, texto: "Muito fraca", cor: "#ef4444" };
  if (!/[A-Z]/.test(senha) || !/[0-9]/.test(senha)) return { nivel: 2, texto: "Fraca — adicione maiúsculas e números", cor: "#ef4444" };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return { nivel: 3, texto: "Média — adicione um caractere especial", cor: "#f59e0b" };
  if (senha.length < 10) return { nivel: 4, texto: "Boa", cor: "#84cc16" };
  return { nivel: 5, texto: "Forte ✓", cor: "#22c55e" };
}

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
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErro("");
  };

  const senhaForca = forca(form.senha);

  const avancar = () => {
    if (passo === 1) {
      if (!form.nome.trim()) return setErro("Digite seu nome.");
      if (!form.email.includes("@")) return setErro("Digite um e-mail válido.");
      const erroSenha = validarSenha(form.senha);
      if (erroSenha) return setErro(erroSenha);
    }
    setErro("");
    setPasso(p => p + 1);
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
          emailRedirectTo: "https://www.testpath.online/confirmar-email",
          data: {
            nome: form.nome,
            nivel: form.nivel,
          },
        },
      });

      if (authError) {
        if (
          authError.message.includes("already registered") ||
          authError.message.includes("User already registered") ||
          authError.message.includes("email already") ||
          authError.status === 422
        ) {
          setErro("Este e-mail já está cadastrado. Tente fazer login.");
        } else {
          setErro("Erro ao criar conta. Verifique os dados e tente novamente.");
        }
        return;
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setErro("Este e-mail já está cadastrado. Tente fazer login.");
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

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#9ca3af",
    marginBottom: "6px",
    display: "block",
    fontFamily: "sans-serif",
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
      {/* Logo */}
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
        }}>
          TestPath
        </span>
      </a>

      <div style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "460px",
      }}>

        {/* TELA DE SUCESSO */}
        {passo === 3 ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h2 style={{ fontSize: "1.5rem", color: "#e5e7eb", fontFamily: "Georgia, serif", marginBottom: "0.75rem", fontWeight: "normal" }}>
              Conta criada, {form.nome.split(" ")[0]}!
            </h2>
            <p style={{ color: "#9ca3af", marginBottom: "0.75rem", lineHeight: 1.6, fontSize: "14px" }}>
              Agora vamos configurar sua primeira certificação.
            </p>
            <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "8px", padding: "12px", color: "#93c5fd", fontSize: "13px", marginBottom: "2rem", lineHeight: 1.5 }}>
              📧 Verifique seu e-mail para confirmar a conta antes de continuar.
            </div>
            <a href="/inicio/ctfl" style={{
              background: "#3b82f6",
              color: "#ffffff",
              padding: "14px 32px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.18)",
            }}>
              Configurar minha trilha CTFL →
            </a>
          </div>
        ) : (
          <>
            {/* Barra de progresso */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#9ca3af" }}>Passo {passo} de 2</span>
                <span style={{ fontSize: "13px", color: "#3b82f6" }}>{Math.round((passo / 2) * 100)}%</span>
              </div>
              <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px" }}>
                <div style={{
                  background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
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
                <h2 style={{ fontSize: "1.4rem", color: "#e5e7eb", fontFamily: "Georgia, serif", marginBottom: "0.5rem", fontWeight: "normal" }}>
                  Crie sua conta
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.5rem" }}>
                  Grátis para sempre. Sem cartão de crédito.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Seu nome</label>
                    <input style={inputStyle} type="text" placeholder="Ex: João Silva"
                      value={form.nome} onChange={e => atualizar("nome", e.target.value)}
                      onKeyDown={e => e.key === "Enter" && avancar()} />
                  </div>

                  <div>
                    <label style={labelStyle}>E-mail</label>
                    <input style={inputStyle} type="email" placeholder="seu@email.com"
                      value={form.email} onChange={e => atualizar("email", e.target.value)}
                      onKeyDown={e => e.key === "Enter" && avancar()} />
                  </div>

                  <div>
                    <label style={labelStyle}>Senha</label>
                    <input style={inputStyle} type="password" placeholder="Mínimo 8 caracteres"
                      value={form.senha} onChange={e => atualizar("senha", e.target.value)}
                      onKeyDown={e => e.key === "Enter" && avancar()} />

                    {/* Indicador de força */}
                    {form.senha.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} style={{
                              flex: 1, height: "3px", borderRadius: "99px",
                              background: senhaForca.nivel >= n ? senhaForca.cor : "#1f2937",
                              transition: "background 0.3s",
                            }} />
                          ))}
                        </div>
                        <div style={{ fontSize: "11px", color: senhaForca.cor }}>
                          {senhaForca.texto}
                        </div>
                        {/* Dicas */}
                        <div style={{ marginTop: "6px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {[
                            { ok: form.senha.length >= 8, txt: "8+ caracteres" },
                            { ok: /[A-Z]/.test(form.senha), txt: "Maiúscula" },
                            { ok: /[0-9]/.test(form.senha), txt: "Número" },
                            { ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.senha), txt: "Especial" },
                          ].map((d, i) => (
                            <span key={i} style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "99px", background: d.ok ? "rgba(34,197,94,0.12)" : "#1f2937", color: d.ok ? "#22c55e" : "#6b7280", border: `1px solid ${d.ok ? "rgba(34,197,94,0.4)" : "#374151"}` }}>
                              {d.ok ? "✓" : "·"} {d.txt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 2 — Nível */}
            {passo === 2 && (
              <div>
                <h2 style={{ fontSize: "1.4rem", color: "#e5e7eb", fontFamily: "Georgia, serif", marginBottom: "0.5rem", fontWeight: "normal" }}>
                  Qual é o seu nível em QA?
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                  Define o tom do conteúdo e dificuldade das questões em todas as suas certificações.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {niveis.map(n => (
                    <button key={n.valor} onClick={() => atualizar("nivel", n.valor)}
                      style={{
                        background: form.nivel === n.valor ? "rgba(59,130,246,0.08)" : "#0b0f1a",
                        border: `1px solid ${form.nivel === n.valor ? "#3b82f6" : "#374151"}`,
                        borderRadius: "10px", padding: "14px 16px",
                        display: "flex", alignItems: "center", gap: "12px",
                        cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s",
                      }}>
                      <span style={{ fontSize: "1.5rem" }}>{n.emoji}</span>
                      <div>
                        <div style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "bold" }}>{n.titulo}</div>
                        <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.4 }}>{n.desc}</div>
                      </div>
                      {form.nivel === n.valor && (
                        <span style={{ marginLeft: "auto", color: "#3b82f6" }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Erro */}
            {erro && (
              <div style={{
                background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444",
                borderRadius: "8px", padding: "10px 14px",
                color: "#fca5a5", fontSize: "13px", marginTop: "1rem",
                lineHeight: 1.5,
              }}>
                {erro}
                {erro.includes("já está cadastrado") && (
                  <div style={{ marginTop: "6px" }}>
                    <a href="/login" style={{ color: "#3b82f6", fontSize: "13px" }}>Fazer login →</a>
                  </div>
                )}
              </div>
            )}

            {/* Botões */}
            <div style={{ display: "flex", gap: "10px", marginTop: "1.75rem" }}>
              {passo > 1 && (
                <button onClick={() => setPasso(p => p - 1)}
                  style={{ flex: 1, background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "12px", color: "#9ca3af", fontSize: "15px", cursor: "pointer", transition: "border-color 0.15s, color 0.15s" }}>
                  ← Voltar
                </button>
              )}
              <button
                onClick={passo === 2 ? finalizar : avancar}
                disabled={loading || (passo === 2 && !form.nivel)}
                style={{
                  flex: 2, background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px",
                  padding: "12px", color: "#ffffff", fontSize: "15px", fontWeight: "600",
                  cursor: (loading || (passo === 2 && !form.nivel)) ? "not-allowed" : "pointer",
                  opacity: (loading || (passo === 2 && !form.nivel)) ? 0.5 : 1,
                  transition: "background 0.15s, box-shadow 0.15s",
                  boxShadow: (loading || (passo === 2 && !form.nivel)) ? "none" : "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)",
                }}>
                {loading ? "Criando conta..." : passo === 2 ? "Criar minha conta →" : "Continuar →"}
              </button>
            </div>

            {passo === 1 && (
              <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "13px", color: "#9ca3af" }}>
                Já tem conta?{" "}
                <a href="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>Entrar</a>
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
