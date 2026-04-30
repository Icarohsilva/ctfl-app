import CertsSelector from "@/components/CertsSelector";

const features = [
  { icon: "🤖", titulo: "Simulados com IA", desc: "Questões únicas a cada sessão, geradas com base no syllabus oficial de cada certificação. Feedback detalhado em cada resposta." },
  { icon: "📊", titulo: "Progresso por certificação", desc: "Cada cert tem seu próprio progresso, XP, streak e meta. Avance no seu ritmo sem misturar os conteúdos." },
  { icon: "🔔", titulo: "Lembretes inteligentes", desc: "Notificações push e e-mails personalizados por IA. Cada mensagem é contextualizada para seu momento e certificação." },
  { icon: "📱", titulo: "App instalável (PWA)", desc: "Instale direto do navegador. Funciona offline. Notificações nativas. Sem passar pela loja de apps." },
  { icon: "🎯", titulo: "Nível adaptativo", desc: "O sistema ajusta a dificuldade ao seu nível — iniciante, praticante ou especialista — em cada certificação." },
  { icon: "🏆", titulo: "Simulado final cronometrado", desc: "Idêntico ao exame real em formato e distribuição. Aprovado? Link direto para agendar a prova oficial." },
];

const certs = [
  { id: "ctfl", nome: "CTFL v4.0", org: "ISTQB", nivel: "Foundation", cor: "#d4af37", status: "disponível", desc: "Base de toda carreira em QA. 24 tópicos, 6 capítulos.", emoji: "🎓" },
  { id: "ctfl-at", nome: "CTFL-AT", org: "ISTQB", nivel: "Foundation", cor: "#10b981", status: "em breve", desc: "Agile Tester — teste em ambientes ágeis.", emoji: "⚡" },
  { id: "ctal-ta", nome: "CTAL-TA", org: "ISTQB", nivel: "Advanced", cor: "#3b82f6", status: "em breve", desc: "Test Analyst — análise e modelagem avançada.", emoji: "🔬" },
  { id: "ctal-tm", nome: "CTAL-TM", org: "ISTQB", nivel: "Advanced", cor: "#8b5cf6", status: "em breve", desc: "Test Manager — gestão avançada de testes.", emoji: "📋" },
  { id: "playwright", nome: "Playwright", org: "Técnico", nivel: "Automação", cor: "#06b6d4", status: "em breve", desc: "Automação de testes web com Playwright.", emoji: "🤖" },
];

const passos = [
  { num: "01", titulo: "Crie sua conta e escolha a certificação", desc: "Cadastro em 30 segundos. Defina seu nível em QA e configure o ritmo de estudo para a certificação desejada.", cor: "#3b82f6" },
  { num: "02", titulo: "Siga a trilha por capítulos e tópicos", desc: "Narrativas, cards de conceito, vídeos e simulados por tópico. Cada certificação tem trilha independente.", cor: "#10b981" },
  { num: "03", titulo: "Treine com simulados adaptativos por IA", desc: "Questões únicas a cada sessão. O sistema prioriza o que você errou e gera questões substitutas para cobrir lacunas.", cor: "#06b6d4" },
  { num: "04", titulo: "Faça o simulado final e agende a prova", desc: "Simulado cronometrado idêntico ao exame real. Aprovado? Link direto para marcar a prova oficial.", cor: "#d4af37" },
];

const inclusos = [
  "Trilhas completas por certificação",
  "Simulados por IA ilimitados",
  "Banco compartilhado de questões",
  "Fila de revisão inteligente",
  "Simulado final cronometrado",
  "Notificações push no celular",
  "Lembretes por e-mail com IA",
  "App instalável (PWA)",
  "Progresso salvo na nuvem",
  "Múltiplas certificações simultâneas",
];

export default function Home() {
  return (
    <main style={{ fontFamily: "sans-serif", background: "#0b0f1a", color: "#e5e7eb", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky", top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
          <span style={{
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            fontSize: "1.15rem",
            background: "linear-gradient(135deg, #d4af37, #f5d76e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>TestPath</span>
        </div>

        {/* Links desktop */}
        <div className="nav-links">
          <a href="#certificacoes" className="nav-link">Certificações</a>
          <a href="#recursos" className="nav-link">Recursos</a>
          <a href="#como-funciona" className="nav-link">Como funciona</a>
          <a href="/login" className="nav-link">Entrar</a>
          <a href="/cadastro" style={{ background: "#3b82f6", color: "#ffffff", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
            Começar grátis
          </a>
        </div>

        {/* Botões mobile */}
        <div className="nav-mobile">
          <a href="/login" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>Entrar</a>
          <a href="/cadastro" style={{ background: "#3b82f6", color: "#ffffff", padding: "7px 14px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>
            Começar grátis
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{ maxWidth: "960px", margin: "0 auto", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", color: "#3b82f6", padding: "5px 14px", borderRadius: "99px", fontSize: "12px", marginBottom: "1.75rem" }}>
          ✦ Plataforma de certificações para QA
        </div>

        <h1 className="hero-title" style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)", lineHeight: 1.1, marginBottom: "1.25rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal" }}>
          Do iniciante ao especialista —{" "}
          <span style={{ color: "#3b82f6", fontStyle: "italic" }}>todas as certificações</span>{" "}
          em um só lugar
        </h1>

        <p style={{ fontSize: "1.05rem", color: "#9ca3af", maxWidth: "580px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
          Trilhas personalizadas por nível, simulados gerados por IA e progresso visual para cada certificação da sua carreira em QA.
        </p>

        {/* Componente interativo isolado */}
        <CertsSelector />

        <div className="hero-btns" style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "1.5rem" }}>
          <a href="/cadastro" style={{ background: "#3b82f6", color: "#ffffff", padding: "14px 32px", borderRadius: "10px", fontWeight: "600", fontSize: "1rem", textDecoration: "none", display: "block", textAlign: "center", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.18)" }}>
            Começar pelo CTFL →
          </a>
          <a href="#certificacoes" style={{ background: "transparent", color: "#e5e7eb", padding: "14px 32px", borderRadius: "10px", fontSize: "1rem", textDecoration: "none", border: "1px solid #374151", display: "block", textAlign: "center" }}>
            Ver trilha completa
          </a>
        </div>

        <p style={{ fontSize: "12px", color: "#6b7280" }}>Gratuito · Sem instalar · Funciona no celular e notebook</p>
      </section>

      {/* TRILHA DE CERTIFICAÇÕES */}
      <section id="certificacoes" className="section-pad" style={{ maxWidth: "960px", margin: "0 auto", padding: "4rem 2rem", borderTop: "1px solid #1f2937" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
            Trilha completa de certificações
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Do primeiro certificado até o nível expert — tudo em uma plataforma</p>
        </div>

        <div className="certs-grid" style={{ display: "grid", gap: "12px", marginBottom: "2rem" }}>
          {certs.map((c) => (
            <div key={c.id}
              style={{ background: "#111827", border: `1px solid ${c.status === "disponível" ? c.cor + "66" : "#1f2937"}`, borderRadius: "14px", padding: "1.25rem", textAlign: "center", opacity: c.status === "disponível" ? 1 : 0.6 }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{c.emoji}</div>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: "#e5e7eb", marginBottom: "4px" }}>{c.nome}</div>
              <div style={{ fontSize: "11px", color: c.cor, marginBottom: "6px" }}>{c.org}</div>
              <div style={{ fontSize: "10px", background: c.status === "disponível" ? "rgba(34,197,94,0.12)" : "#1f2937", color: c.status === "disponível" ? "#22c55e" : "#6b7280", padding: "2px 8px", borderRadius: "99px", display: "inline-block", marginBottom: "6px" }}>
                {c.status === "disponível" ? "✓ Disponível" : "Em breve"}
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.4 }}>{c.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "12px", padding: "1rem 1.5rem", display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
            Comece pelo <strong style={{ color: "#d4af37" }}>CTFL</strong> — é o pré-requisito para todas as certificações avançadas da ISTQB. As demais trilhas serão liberadas em breve.
          </p>
        </div>
      </section>

      {/* RECURSOS */}
      <section id="recursos" className="section-pad" style={{ maxWidth: "960px", margin: "0 auto", padding: "4rem 2rem", borderTop: "1px solid #1f2937" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
            Uma plataforma para toda sua carreira em QA
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Cada certificação tem trilha independente com progresso, simulados e metas próprias</p>
        </div>

        <div className="grid-3" style={{ display: "grid", gap: "12px" }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "1.5rem" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb", marginBottom: "0.5rem" }}>{f.titulo}</div>
              <div style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="section-pad" style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem", borderTop: "1px solid #1f2937" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>Como funciona</h2>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Do cadastro à certificação em 4 passos</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {passos.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", paddingBottom: "2rem", position: "relative" }}>
              {i < 3 && <div style={{ position: "absolute", left: "23px", top: "48px", width: "2px", height: "calc(100% - 24px)", background: "#1f2937" }} />}
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#111827", border: `2px solid ${s.cor}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                <span style={{ fontSize: "13px", fontWeight: "bold", color: s.cor, fontFamily: "Georgia, serif" }}>{s.num}</span>
              </div>
              <div style={{ paddingTop: "10px" }}>
                <div style={{ fontSize: "15px", fontWeight: "bold", color: "#e5e7eb", marginBottom: "4px" }}>{s.titulo}</div>
                <div style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GRATUITO */}
      <section className="section-pad" style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem", borderTop: "1px solid #1f2937" }}>
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "#3b82f6", letterSpacing: "0.08em", marginBottom: "1rem", fontWeight: "600" }}>PLANO GRATUITO — PARA SEMPRE</div>
          <h2 style={{ fontSize: "1.8rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>Tudo incluído, zero custo</h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "2rem" }}>Para todas as certificações disponíveis e futuras</p>

          <div className="grid-2" style={{ display: "grid", gap: "10px", marginBottom: "2rem", textAlign: "left" }}>
            {inclusos.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#9ca3af" }}>
                <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          <a href="/cadastro" style={{ display: "inline-block", background: "#3b82f6", color: "#ffffff", padding: "14px 40px", borderRadius: "10px", fontWeight: "600", fontSize: "1rem", textDecoration: "none", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.18)" }}>
            Criar conta grátis →
          </a>
          <p style={{ marginTop: "1rem", fontSize: "12px", color: "#6b7280" }}>
            Já tem conta?{" "}
            <a href="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>Entrar</a>
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-pad" style={{ maxWidth: "640px", margin: "0 auto", padding: "4rem 2rem 5rem", textAlign: "center", borderTop: "1px solid #1f2937" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal" }}>
          Comece hoje pelo CTFL
        </h2>
        <p style={{ color: "#9ca3af", marginBottom: "2rem", lineHeight: 1.6, fontSize: "14px" }}>
          A base de toda carreira em QA. Depois de certificado, continue com CTFL-AT, CTAL e muito mais.
        </p>
        <a href="/cadastro" style={{ background: "#3b82f6", color: "#ffffff", padding: "16px 40px", borderRadius: "10px", fontWeight: "600", fontSize: "1rem", textDecoration: "none", display: "inline-block", boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.18)" }}>
          Criar conta grátis →
        </a>
        <p style={{ marginTop: "1rem", fontSize: "12px", color: "#6b7280" }}>
          Gratuito · Sem instalar · Funciona no celular e notebook
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1f2937", padding: "2rem", textAlign: "center", fontSize: "12px", color: "#6b7280", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
        <span>TestPath © 2025</span>
        <span>Plataforma de certificações para QA</span>
        <a href="/login" style={{ color: "#9ca3af", textDecoration: "none" }}>Entrar</a>
        <a href="/cadastro" style={{ color: "#9ca3af", textDecoration: "none" }}>Cadastrar</a>
      </footer>
    </main>
  );
}
