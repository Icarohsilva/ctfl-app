"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import CardMetaCTFL from "@/components/CardMetaCTFL";
import NotificacaoPermissao from "../../components/NotificacaoPermissao";

type Perfil = {
  nome: string;
  nivel: string;
  pontos: number;
  foto_url: string | null;
};

type CertUsuario = {
  certificacao_id: string;
  status: string;
  data_meta: string | null;
  data_inicio: string;
  ritmo: string;
  semana_atual: number;
  pontos: number;
  streak: number;
  maior_streak: number;
  ultimo_estudo: string | null;
};

type ProgressoCapitulo = {
  capitulo: number;
  total_topicos: number;
  concluidos: number;
};

const semanas = [
  { num: 1, cap: 1, titulo: "Fundamentos de Teste", rota: "/capitulo/1" },
  { num: 2, cap: 2, titulo: "Ciclo de Vida", rota: "/capitulo/2" },
  { num: 3, cap: 3, titulo: "Teste Estático", rota: "/capitulo/3" },
  { num: 4, cap: 4, titulo: "Técnicas Caixa-Preta", rota: "/capitulo/4" },
  { num: 5, cap: 4, titulo: "Técnicas Caixa-Branca", rota: "/capitulo/4b" },
  { num: 6, cap: 5, titulo: "Gerenciamento", rota: "/capitulo/5" },
  { num: 7, cap: 6, titulo: "Ferramentas", rota: "/capitulo/6" },
  { num: 8, cap: 0, titulo: "Simulado Final", rota: "/simulado-final" },
];

const totalTopicosPorCap: Record<number, number> = { 1: 4, 2: 4, 3: 3, 4: 4, 5: 4, 6: 3 };

const frasesMotivadoras = [
  "Um passo por dia, e a certificação é sua. 🎯",
  "QAs que estudam consistentemente passam na primeira tentativa. 💪",
  "Você já sabe mais do que sabia ontem. Continue! 🚀",
  "O exame testa o que você pratica, não o que você leu. 📖",
  "Consistência bate intensidade. Estuda hoje! ⚡",
  "Cada tópico concluído é um defeito a menos no seu conhecimento. 🐛",
];

const ritmoLabel: Record<string, string> = {
  leve: "Leve ~30min/dia",
  moderado: "Moderado ~1h/dia",
  intensivo: "Intensivo ~2h/dia",
};

export default function Dashboard() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cert, setCert] = useState<CertUsuario | null>(null);
  const [progresso, setProgresso] = useState<ProgressoCapitulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState<"trilha" | "capitulos">("trilha");
  const [fraseHoje] = useState(() => frasesMotivadoras[Math.floor(Math.random() * frasesMotivadoras.length)]);
  const [userId, setUserId] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    setUserId(user.id);

    const { data: perfilData } = await supabase
      .from("profiles").select("nome, nivel, pontos, foto_url").eq("id", user.id).single();
    if (perfilData) setPerfil(perfilData);

    const { data: certData } = await supabase
      .from("usuario_certificacoes").select("*")
      .eq("user_id", user.id).eq("certificacao_id", "ctfl").single();

    if (!certData) { window.location.href = "/inicio/ctfl"; return; }

    const hoje = new Date().toISOString().split("T")[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    let novoStreak = certData.streak || 0;
    if (certData.ultimo_estudo !== hoje && certData.ultimo_estudo !== ontem && novoStreak > 0) {
      novoStreak = 0;
      await supabase.from("usuario_certificacoes").update({ streak: 0 })
        .eq("user_id", user.id).eq("certificacao_id", "ctfl");
    }
    setCert({ ...certData, streak: novoStreak });

    const { data: progressoData } = await supabase
      .from("progresso_topicos").select("capitulo, topico_id")
      .eq("user_id", user.id).eq("certificacao_id", "ctfl").eq("concluido", true);

    if (progressoData) {
      const agrupado: Record<number, Set<string>> = {};
      progressoData.forEach(({ capitulo, topico_id }: { capitulo: number; topico_id: string }) => {
        if (!agrupado[capitulo]) agrupado[capitulo] = new Set();
        agrupado[capitulo].add(topico_id);
      });
      setProgresso(Object.entries(totalTopicosPorCap).map(([cap, total]) => ({
        capitulo: Number(cap), total_topicos: total, concluidos: agrupado[Number(cap)]?.size || 0,
      })));
    }
    setLoading(false);
  };

  const sair = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  if (loading) return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#c9a84c", fontFamily: "Georgia, serif" }}>Carregando sua trilha...</div>
    </main>
  );

  const totalTopicos = Object.values(totalTopicosPorCap).reduce((a, b) => a + b, 0);
  const totalConcluidos = progresso.reduce((acc, p) => acc + p.concluidos, 0);
  const progressoGeral = Math.round((totalConcluidos / totalTopicos) * 100);
  const semanaAtual = cert?.semana_atual || 1;
  const xpTotal = cert?.pontos || 0;
  const streak = cert?.streak || 0;
  const maiorStreak = cert?.maior_streak || 0;
  const nivel = xpTotal < 100 ? "Aprendiz" : xpTotal < 300 ? "Praticante" : xpTotal < 600 ? "Analista" : "Especialista";
  const nivelIcon = xpTotal < 100 ? "🌱" : xpTotal < 300 ? "📖" : xpTotal < 600 ? "🎯" : "🏆";
  const xpProximoNivel = xpTotal < 100 ? 100 : xpTotal < 300 ? 300 : xpTotal < 600 ? 600 : 1000;
  const xpPct = Math.min(100, Math.round((xpTotal / xpProximoNivel) * 100));
  const diasRestantes = cert?.data_meta
    ? Math.max(0, Math.ceil((new Date(cert.data_meta).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", color: "#f0ede8", fontFamily: "sans-serif" }}>

      {/* CSS responsivo global */}
      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .padding-main { padding: 1rem !important; }
          .banner-meta { flex-wrap: wrap !important; }
        }
      `}</style>

      {/* NAV DESKTOP */}
      <nav className="nav-desktop" style={{ justifyContent: "space-between", alignItems: "center", padding: "0.875rem 2rem", borderBottom: "1px solid #1e1e2e", position: "sticky", top: 0, background: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", color: "#e8d5a3" }}>TestPath</span>
          <span style={{ fontSize: "11px", background: "#1a1a0e", color: "#c9a84c", border: "1px solid #c9a84c33", padding: "2px 8px", borderRadius: "99px" }}>CTFL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", background: streak > 0 ? "#1a1000" : "#141414", border: `1px solid ${streak > 0 ? "#c9a84c44" : "#2a2a2a"}`, borderRadius: "99px", padding: "5px 12px" }}>
            <span>🔥</span>
            <span style={{ color: streak > 0 ? "#c9a84c" : "#3a3a3a", fontWeight: "bold", fontSize: "13px" }}>{streak}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#1a1a0e", border: "1px solid #c9a84c44", borderRadius: "99px", padding: "5px 12px" }}>
            <span>⭐</span>
            <span style={{ color: "#c9a84c", fontWeight: "bold", fontSize: "13px" }}>{xpTotal} XP</span>
          </div>
          <a href="/perfil" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "5px 10px" }}>
            {perfil?.foto_url
              ? <img src={perfil.foto_url} alt="avatar" style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }} />
              : <span style={{ fontSize: "14px" }}>👤</span>}
            <span style={{ color: "#a0998e", fontSize: "12px" }}>{perfil?.nome?.split(" ")[0]}</span>
          </a>
          <button onClick={sair} style={{ background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "5px 12px", color: "#5a5a6a", fontSize: "12px", cursor: "pointer" }}>Sair</button>
        </div>
      </nav>

      {/* NAV MOBILE */}
      <nav className="nav-mobile" style={{ justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderBottom: "1px solid #1e1e2e", position: "sticky", top: 0, background: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "22px", height: "22px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1rem", color: "#e8d5a3" }}>TestPath</span>
          <span style={{ fontSize: "10px", background: "#1a1a0e", color: "#c9a84c", border: "1px solid #c9a84c33", padding: "1px 6px", borderRadius: "99px" }}>CTFL</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Streak e XP compactos */}
          <div style={{ display: "flex", alignItems: "center", gap: "3px", background: streak > 0 ? "#1a1000" : "#141414", border: `1px solid ${streak > 0 ? "#c9a84c44" : "#2a2a2a"}`, borderRadius: "99px", padding: "4px 8px" }}>
            <span style={{ fontSize: "12px" }}>🔥</span>
            <span style={{ color: streak > 0 ? "#c9a84c" : "#3a3a3a", fontWeight: "bold", fontSize: "12px" }}>{streak}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "3px", background: "#1a1a0e", border: "1px solid #c9a84c44", borderRadius: "99px", padding: "4px 8px" }}>
            <span style={{ fontSize: "12px" }}>⭐</span>
            <span style={{ color: "#c9a84c", fontWeight: "bold", fontSize: "12px" }}>{xpTotal}</span>
          </div>

          {/* Menu hamburguer */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            style={{ background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "6px 10px", color: "#a0998e", fontSize: "16px", cursor: "pointer", lineHeight: 1 }}>
            {menuAberto ? "✕" : "☰"}
          </button>
        </div>

        {/* Dropdown mobile */}
        {menuAberto && (
          <div style={{ position: "absolute", top: "100%", right: "1rem", background: "#0f0f18", border: "1px solid #2e2e3e", borderRadius: "12px", padding: "0.75rem", zIndex: 200, minWidth: "160px", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            <a href="/perfil" onClick={() => setMenuAberto(false)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", textDecoration: "none", color: "#a0998e", fontSize: "14px" }}>
              {perfil?.foto_url
                ? <img src={perfil.foto_url} alt="avatar" style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }} />
                : <span>👤</span>}
              {perfil?.nome?.split(" ")[0]}
            </a>
            <div style={{ borderTop: "1px solid #1e1e2e", margin: "4px 0" }} />
            <button onClick={() => { setMenuAberto(false); sair(); }} style={{ display: "block", width: "100%", background: "transparent", border: "none", padding: "8px 10px", borderRadius: "8px", color: "#c06060", fontSize: "14px", cursor: "pointer", textAlign: "left" }}>
              Sair
            </button>
          </div>
        )}
      </nav>

      {/* Overlay para fechar menu mobile */}
      {menuAberto && (
        <div onClick={() => setMenuAberto(false)} style={{ position: "fixed", inset: 0, zIndex: 150 }} />
      )}

      <div className="padding-main" style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem 2rem" }}>

        {/* SAUDAÇÃO */}
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e8d5a3", marginBottom: "4px" }}>
            Olá, {perfil?.nome?.split(" ")[0]}! {streak > 2 ? "🔥" : "👋"}
          </h1>
          <p style={{ color: "#5a5a6a", fontSize: "13px", margin: 0, fontStyle: "italic" }}>{fraseHoje}</p>
        </div>

        {/* BANNER META */}
        {cert?.data_meta && diasRestantes !== null && (
          <div className="banner-meta" style={{ background: diasRestantes < 14 ? "#1a0e0e" : "#0f0f18", border: `1px solid ${diasRestantes < 14 ? "#5e2e2e" : "#1e1e2e"}`, borderRadius: "14px", padding: "1rem 1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{diasRestantes < 14 ? "⚠️" : "🎯"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: diasRestantes < 14 ? "#c06060" : "#e8d5a3", marginBottom: "2px" }}>
                {diasRestantes === 0 ? "Sua prova é hoje!" : `${diasRestantes} dias até o exame`}
              </div>
              <div style={{ fontSize: "12px", color: "#5a5a6a" }}>
                Meta: {new Date(cert.data_meta).toLocaleDateString("pt-BR")} · {ritmoLabel[cert.ritmo] || cert.ritmo}
              </div>
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: diasRestantes < 14 ? "#c06060" : "#c9a84c", flexShrink: 0 }}>
              {progressoGeral}%
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="stats-grid" style={{ display: "grid", gap: "10px", marginBottom: "1.25rem" }}>
          <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#5a5a6a", marginBottom: "4px", letterSpacing: "0.04em" }}>PROGRESSO</div>
            <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#e8d5a3", marginBottom: "6px" }}>{progressoGeral}%</div>
            <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "4px" }}>
              <div style={{ background: "linear-gradient(90deg,#c9a84c,#e8d5a3)", width: `${progressoGeral}%`, height: "4px", borderRadius: "99px", minWidth: progressoGeral > 0 ? "4px" : "0" }} />
            </div>
            <div style={{ fontSize: "10px", color: "#3a3a4a", marginTop: "4px" }}>{totalConcluidos}/{totalTopicos} tópicos</div>
          </div>

          <div style={{ background: streak > 0 ? "#1a1000" : "#0f0f18", border: `1px solid ${streak > 0 ? "#c9a84c33" : "#1e1e2e"}`, borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#5a5a6a", marginBottom: "4px", letterSpacing: "0.04em" }}>SEQUÊNCIA</div>
            <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: streak > 0 ? "#c9a84c" : "#3a3a3a", marginBottom: "4px" }}>🔥 {streak}</div>
            <div style={{ fontSize: "10px", color: "#5a5a6a" }}>
              {streak === 0 ? "Estuda hoje!" : `${streak} dia${streak > 1 ? "s" : ""} seguido${streak > 1 ? "s" : ""}`}
            </div>
            {maiorStreak > 0 && <div style={{ fontSize: "10px", color: "#3a3a3a", marginTop: "2px" }}>Recorde: {maiorStreak}</div>}
          </div>

          <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#5a5a6a", marginBottom: "4px", letterSpacing: "0.04em" }}>NÍVEL</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#e8d5a3", marginBottom: "4px" }}>{nivelIcon} {nivel}</div>
            <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "4px", marginBottom: "4px" }}>
              <div style={{ background: "#7c9e6e", width: `${xpPct}%`, height: "4px", borderRadius: "99px" }} />
            </div>
            <div style={{ fontSize: "10px", color: "#3a3a4a" }}>{xpTotal}/{xpProximoNivel} XP</div>
          </div>

          <div style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#5a5a6a", marginBottom: "4px", letterSpacing: "0.04em" }}>CAPÍTULOS</div>
            <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#e8d5a3", marginBottom: "4px" }}>
              {progresso.filter(p => p.concluidos === p.total_topicos).length}/6
            </div>
            <div style={{ fontSize: "10px", color: "#5a5a6a" }}>{ritmoLabel[cert?.ritmo || "moderado"]}</div>
          </div>
        </div>

        {/* CONTINUAR */}
        <div onClick={() => window.location.href = "/capitulo/1"}
          style={{ background: "#0f0f18", border: "1px solid #c9a84c44", borderRadius: "14px", padding: "1rem 1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.875rem", cursor: "pointer", transition: "border-color 0.2s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#c9a84c"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#c9a84c44"}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#1a1a0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>▶️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "10px", color: "#5a5a6a", marginBottom: "2px", letterSpacing: "0.04em" }}>CONTINUAR</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e8d5a3", marginBottom: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Cap. 1 — Fundamentos de Teste</div>
            <div style={{ fontSize: "12px", color: "#5a5a6a" }}>
              {totalConcluidos === 0 ? "Começar do início" : `${progresso.find(p => p.capitulo === 1)?.concluidos || 0}/4 tópicos concluídos`}
            </div>
          </div>
          <span style={{ color: "#c9a84c", fontSize: "1.4rem", flexShrink: 0 }}>›</span>
        </div>

        {cert && userId && (
          <CardMetaCTFL cert={cert} userId={userId} progressoGeral={progressoGeral} onAtualizar={carregarDados} />
        )}

        {/* ABAS */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "1rem", background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "10px", padding: "4px" }}>
          {(["trilha", "capitulos"] as const).map(aba => (
            <button key={aba} onClick={() => setAbaSelecionada(aba)}
              style={{ flex: 1, padding: "8px", borderRadius: "7px", border: "none", background: abaSelecionada === aba ? "#1e1e2e" : "transparent", color: abaSelecionada === aba ? "#e8d5a3" : "#5a5a6a", fontSize: "13px", cursor: "pointer", fontWeight: abaSelecionada === aba ? "bold" : "normal", transition: "all 0.15s" }}>
              {aba === "trilha" ? "📅 Trilha" : "📚 Capítulos"}
            </button>
          ))}
        </div>

        {/* TRILHA */}
        {abaSelecionada === "trilha" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {semanas.map(s => {
              const capProgresso = progresso.find(p => p.capitulo === s.cap);
              const concluida = s.cap > 0 && capProgresso ? capProgresso.concluidos === capProgresso.total_topicos : false;
              const isAtiva = s.num === semanaAtual;
              const isBloqueada = s.num > semanaAtual && !concluida;
              const pctSemana = capProgresso ? Math.round((capProgresso.concluidos / capProgresso.total_topicos) * 100) : 0;

              return (
                <div key={s.num} onClick={() => !isBloqueada && (window.location.href = s.rota)}
                  style={{ background: isAtiva ? "#1a1a0e" : "#0f0f18", border: `1px solid ${isAtiva ? "#c9a84c" : concluida ? "#2e3e2e" : "#1e1e2e"}`, borderRadius: "12px", padding: "1rem 1.1rem", display: "flex", alignItems: "center", gap: "0.875rem", opacity: isBloqueada ? 0.4 : 1, cursor: isBloqueada ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: concluida ? "#1e3e1e" : isAtiva ? "#c9a84c22" : "#1a1a2a", border: `2px solid ${concluida ? "#4e7e4e" : isAtiva ? "#c9a84c" : "#2e2e4e"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.9rem" }}>
                    {concluida ? "✓" : isAtiva ? "▶" : s.num === 8 ? "🏆" : s.num}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: isAtiva ? "#e8d5a3" : concluida ? "#6a8a6a" : "#5a5a6a" }}>{s.titulo}</span>
                      {isAtiva && <span style={{ fontSize: "10px", background: "#c9a84c22", color: "#c9a84c", border: "1px solid #c9a84c44", padding: "1px 6px", borderRadius: "99px", whiteSpace: "nowrap" }}>▶ Em andamento</span>}
                      {concluida && <span style={{ fontSize: "10px", background: "#1e3e1e", color: "#4e9e4e", border: "1px solid #2e5e2e", padding: "1px 6px", borderRadius: "99px" }}>✓</span>}
                    </div>
                    {s.cap > 0 && !isBloqueada && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "3px", flex: 1 }}>
                          <div style={{ background: concluida ? "#4e9e4e" : "#c9a84c", width: `${pctSemana}%`, height: "3px", borderRadius: "99px" }} />
                        </div>
                        <span style={{ fontSize: "11px", color: "#3a3a4a" }}>{pctSemana}%</span>
                      </div>
                    )}
                    {isBloqueada && <div style={{ fontSize: "11px", color: "#3a3a4a" }}>🔒 Complete o capítulo anterior primeiro</div>}
                  </div>
                  {!isBloqueada && <span style={{ color: "#3a3a5a", fontSize: "1.1rem", flexShrink: 0 }}>›</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* CAPÍTULOS */}
        {abaSelecionada === "capitulos" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
            {[
              { num: 1, titulo: "Fundamentos de Teste", peso: "27%", rota: "/capitulo/1" },
              { num: 2, titulo: "Ciclo de Vida", peso: "17%", rota: "/capitulo/2" },
              { num: 3, titulo: "Teste Estático", peso: "10%", rota: "/capitulo/3" },
              { num: 4, titulo: "Técnicas de Teste", peso: "25%", rota: "/capitulo/4" },
              { num: 5, titulo: "Gerenciamento", peso: "17%", rota: "/capitulo/5" },
              { num: 6, titulo: "Ferramentas", peso: "5%", rota: "/capitulo/6" },
            ].map(c => {
              const p = progresso.find(x => x.capitulo === c.num);
              const concluidos = p?.concluidos || 0;
              const total = totalTopicosPorCap[c.num] || 0;
              const pct = total > 0 ? Math.round((concluidos / total) * 100) : 0;
              const desbloqueado = c.num === 1 || (progresso.find(x => x.capitulo === c.num - 1)?.concluidos === totalTopicosPorCap[c.num - 1]);

              return (
                <div key={c.num} onClick={() => desbloqueado && (window.location.href = c.rota)}
                  style={{ background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "1.1rem", opacity: desbloqueado ? 1 : 0.4, cursor: desbloqueado ? "pointer" : "not-allowed", transition: "border-color 0.2s" }}
                  onMouseEnter={e => { if (desbloqueado) (e.currentTarget as HTMLElement).style.borderColor = "#c9a84c44"; }}
                  onMouseLeave={e => { if (desbloqueado) (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2e"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#5a5a6a" }}>Cap. {c.num}</span>
                    <span style={{ fontSize: "11px", background: "#1a1a0e", color: "#c9a84c", border: "1px solid #c9a84c33", padding: "2px 7px", borderRadius: "99px" }}>{c.peso}</span>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "#e8d5a3", marginBottom: "8px" }}>{c.titulo}</div>
                  <div style={{ background: "#1e1e2e", borderRadius: "99px", height: "4px", marginBottom: "5px" }}>
                    <div style={{ background: pct === 100 ? "#4e9e4e" : "#c9a84c", width: `${pct}%`, height: "4px", borderRadius: "99px" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "#3a3a4a" }}>{concluidos}/{total} tópicos</span>
                    <span style={{ fontSize: "11px", color: pct === 100 ? "#4e9e4e" : "#3a3a4a" }}>{pct === 100 ? "✓ Completo" : `${pct}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BANNER PROVA */}
        <div style={{ marginTop: "1.5rem", background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: "14px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1.5rem" }}>📋</span>
          <div style={{ flex: 1, minWidth: "180px" }}>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#e8d5a3", marginBottom: "2px" }}>Agendar o exame CTFL</div>
            <div style={{ fontSize: "11px", color: "#5a5a6a", lineHeight: 1.5 }}>Aplicado pela BSTQB. ~R$ 800. Recomendamos após concluir todos os capítulos.</div>
          </div>
          <a href="https://bstqb.qa/credito-exame" target="_blank" rel="noopener noreferrer"
            style={{ background: "transparent", border: "1px solid #2e2e3e", borderRadius: "8px", padding: "8px 14px", color: "#a0998e", fontSize: "12px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
            Ver site →
          </a>
        </div>
      </div>

      <NotificacaoPermissao />
    </main>
  );
}