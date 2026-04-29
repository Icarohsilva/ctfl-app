"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const features = [
    {
      icon: "🎯",
      title: "Trilha baseada no Syllabus oficial",
      desc: "Conteúdo 100% alinhado ao CTFL v4.0 da ISTQB, gerado com IA a partir do syllabus oficial.",
    },
    {
      icon: "🤖",
      title: "Simulados gerados por IA",
      desc: "Questões novas a cada sessão, com feedback detalhado e explicação de cada resposta.",
    },
    {
      icon: "⏱️",
      title: "Temporizador e notificações",
      desc: "Lembretes diários para manter o ritmo, com sessões cronometradas como na prova real.",
    },
    {
      icon: "📊",
      title: "Progresso visual por capítulo",
      desc: "Veja exatamente onde você está em cada um dos 6 capítulos do exame.",
    },
    {
      icon: "📱",
      title: "Funciona como app",
      desc: "Instale direto do navegador na tela inicial do celular. Sem loja, sem taxa.",
    },
    {
      icon: "🏆",
      title: "Do zero até a prova",
      desc: "O sistema indica quando você está pronto e mostra como e onde agendar o exame.",
    },
  ];

  const steps = [
    { num: "01", title: "Crie sua conta grátis", desc: "Cadastro em 30 segundos, sem cartão." },
    { num: "02", title: "Siga a trilha personalizada", desc: "8 semanas, ~1h por dia, no seu ritmo." },
    { num: "03", title: "Pratique com simulados", desc: "IA gera questões novas a cada sessão." },
    { num: "04", title: "Agende o exame", desc: "O app indica quando você está pronto e onde marcar." },
  ];

  return (
    <main
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: "#0a0a0f",
        color: "#f0ede8",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid #1e1e2e",
          position: "sticky",
          top: 0,
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(12px)",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "#e8d5a3",
              letterSpacing: "0.02em",
            }}
          >
            TestPath
          </span>
          <span
            style={{
              fontSize: "11px",
              background: "#2a2a1a",
              color: "#c9a84c",
              border: "1px solid #c9a84c44",
              padding: "2px 7px",
              borderRadius: "99px",
              marginLeft: "4px",
            }}
          >
            CTFL
          </span>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <a
            href="/login"
            style={{
              color: "#a0998e",
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "sans-serif",
            }}
          >
            Entrar
          </a>
          <a
            href="/cadastro"
            style={{
              background: "#c9a84c",
              color: "#0a0a0f",
              padding: "8px 18px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              textDecoration: "none",
              fontFamily: "sans-serif",
            }}
          >
            Começar grátis
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "6rem 2rem 5rem",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.8s ease",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#1a1a0e",
            border: "1px solid #c9a84c44",
            color: "#c9a84c",
            padding: "6px 14px",
            borderRadius: "99px",
            fontSize: "12px",
            fontFamily: "sans-serif",
            marginBottom: "2rem",
          }}
        >
          <span>✦</span> Baseado no Syllabus ISTQB CTFL v4.0
        </div>

        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            lineHeight: 1.1,
            margin: "0 0 1.5rem",
            color: "#f0ede8",
            fontWeight: "normal",
          }}
        >
          Conquiste a certificação{" "}
          <span
            style={{
              color: "#c9a84c",
              fontStyle: "italic",
            }}
          >
            CTFL
          </span>{" "}
          com método e consistência
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "#a0998e",
            maxWidth: "580px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
            fontFamily: "sans-serif",
            fontWeight: "normal",
          }}
        >
          Trilha de 8 semanas, simulados gerados por IA e acompanhamento de progresso — tudo gratuito, direto no navegador.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/cadastro"
            style={{
              background: "#c9a84c",
              color: "#0a0a0f",
              padding: "14px 32px",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1rem",
              textDecoration: "none",
              fontFamily: "sans-serif",
              display: "inline-block",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = "translateY(-2px)";
              (e.target as HTMLElement).style.boxShadow = "0 8px 24px #c9a84c44";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "translateY(0)";
              (e.target as HTMLElement).style.boxShadow = "none";
            }}
          >
            Criar conta grátis →
          </a>
          <a
            href="#como-funciona"
            style={{
              background: "transparent",
              color: "#f0ede8",
              padding: "14px 32px",
              borderRadius: "10px",
              fontWeight: "normal",
              fontSize: "1rem",
              textDecoration: "none",
              fontFamily: "sans-serif",
              border: "1px solid #2e2e3e",
              display: "inline-block",
            }}
          >
            Ver como funciona
          </a>
        </div>

        {/* Social proof */}
        <p
          style={{
            marginTop: "2rem",
            fontSize: "13px",
            color: "#5a5a6a",
            fontFamily: "sans-serif",
          }}
        >
          Gratuito · Sem instalar · Funciona no celular e notebook
        </p>
      </section>

      {/* FEATURES */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "4rem 2rem",
          borderTop: "1px solid #1e1e2e",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.8rem",
            marginBottom: "3rem",
            color: "#e8d5a3",
            fontWeight: "normal",
          }}
        >
          Tudo que você precisa para passar
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: "#0f0f18",
                border: "1px solid #1e1e2e",
                borderRadius: "12px",
                padding: "1.5rem",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#c9a84c44";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2e";
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "#e8d5a3",
                  marginBottom: "0.5rem",
                  fontFamily: "sans-serif",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#7a7a8a",
                  lineHeight: 1.6,
                  fontFamily: "sans-serif",
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "4rem 2rem",
          borderTop: "1px solid #1e1e2e",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.8rem",
            marginBottom: "3rem",
            color: "#e8d5a3",
            fontWeight: "normal",
          }}
        >
          Como funciona
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#2a2a1a",
                  minWidth: "56px",
                  lineHeight: 1,
                  fontFamily: "Georgia, serif",
                  WebkitTextStroke: "1px #c9a84c44",
                }}
              >
                {s.num}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: "bold",
                    color: "#e8d5a3",
                    marginBottom: "0.25rem",
                    fontFamily: "sans-serif",
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#7a7a8a",
                    fontFamily: "sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "5rem 2rem 6rem",
          textAlign: "center",
          borderTop: "1px solid #1e1e2e",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            color: "#e8d5a3",
            fontWeight: "normal",
          }}
        >
          Pronto para começar?
        </h2>
        <p
          style={{
            color: "#7a7a8a",
            marginBottom: "2rem",
            fontFamily: "sans-serif",
            lineHeight: 1.6,
          }}
        >
          Crie sua conta gratuita e comece a trilha hoje. Sem cartão, sem prazo.
        </p>
        <a
          href="/cadastro"
          style={{
            background: "#c9a84c",
            color: "#0a0a0f",
            padding: "16px 40px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1rem",
            textDecoration: "none",
            fontFamily: "sans-serif",
            display: "inline-block",
          }}
        >
          Criar conta grátis →
        </a>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #1e1e2e",
          padding: "2rem",
          textAlign: "center",
          fontSize: "13px",
          color: "#3a3a4a",
          fontFamily: "sans-serif",
        }}
      >
        TestPath © 2025 · Baseado no Syllabus ISTQB CTFL v4.0 · Gratuito para sempre
      </footer>
    </main>
  );
}