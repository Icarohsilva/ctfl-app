"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";

type Perfil = {
  nome: string;
  email: string;
  nivel: string;
  pontos: number;
  streak: number;
  maior_streak: number;
  semana_atual: number;
  foto_url: string | null;
  data_nascimento: string | null;
  cpf: string | null;
  telefone: string | null;
  bio: string | null;
  linkedin: string | null;
};

function validarCPF(cpf: string): boolean {
  const nums = cpf.replace(/\D/g, "");
  if (nums.length !== 11 || /^(\d)\1+$/.test(nums)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(nums[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(nums[10]);
}

function validarTelefone(tel: string): boolean {
  const nums = tel.replace(/\D/g, "");
  return nums.length === 10 || nums.length === 11;
}

function validarDataNascimento(data: string): { valida: boolean; erro: string } {
  if (!data) return { valida: true, erro: "" };
  const d = new Date(data);
  if (isNaN(d.getTime())) return { valida: false, erro: "Data inválida." };
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (d > hoje) return { valida: false, erro: "A data não pode ser no futuro." };
  const anoMinimo = new Date();
  anoMinimo.setFullYear(anoMinimo.getFullYear() - 120);
  if (d < anoMinimo) return { valida: false, erro: "Data muito antiga." };
  return { valida: true, erro: "" };
}

function formatarCPF(v: string): string {
  const nums = v.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

function formatarTelefone(v: string): string {
  const nums = v.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 2) return nums.length ? `(${nums}` : "";
  if (nums.length <= 6) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [aba, setAba] = useState<"perfil" | "conta" | "senha">("perfil");
  const [msg, setMsg] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Campos perfil
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [telefone, setTelefone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");

  // Erros de validação
  const [erroCPF, setErroCPF] = useState("");
  const [erroTel, setErroTel] = useState("");
  const [erroData, setErroData] = useState("");

  // Configurações — apenas nível
  const [nivel, setNivel] = useState("");
  const [nivelOriginal, setNivelOriginal] = useState("");
  const [confirmandoAlteracao, setConfirmandoAlteracao] = useState(false);

  // Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [verificandoSenha, setVerificandoSenha] = useState(false);

  // Email
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaParaEmail, setSenhaParaEmail] = useState("");
  const [alterandoEmail, setAlterandoEmail] = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    setUserId(user.id);

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data) {
      setPerfil({ ...data, email: user.email || "" });
      setNome(data.nome || "");
      setBio(data.bio || "");
      setTelefone(data.telefone || "");
      setLinkedin(data.linkedin || "");
      setDataNascimento(data.data_nascimento || "");
      setCpf(data.cpf || "");
      setNivel(data.nivel || "iniciante");
      setNivelOriginal(data.nivel || "iniciante");
      setNovoEmail(user.email || "");
    }
    setLoading(false);
  };

  const mostrarMsg = (tipo: "sucesso" | "erro", texto: string) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg(null), 5000);
  };

  const salvarPerfil = async () => {
    let temErro = false;
    if (cpf && !validarCPF(cpf)) { setErroCPF("CPF inválido."); temErro = true; } else setErroCPF("");
    if (telefone && !validarTelefone(telefone)) { setErroTel("Telefone inválido."); temErro = true; } else setErroTel("");
    const dataVal = validarDataNascimento(dataNascimento);
    if (!dataVal.valida) { setErroData(dataVal.erro); temErro = true; } else setErroData("");
    if (temErro || !userId) return;

    setSalvando(true);
    const { error } = await supabase.from("profiles").update({
      nome, bio,
      telefone: telefone || null,
      linkedin: linkedin || null,
      data_nascimento: dataNascimento || null,
      cpf: cpf || null,
    }).eq("id", userId);

    if (error) mostrarMsg("erro", "Erro ao salvar. Tente novamente.");
    else mostrarMsg("sucesso", "Perfil atualizado com sucesso!");
    setSalvando(false);
  };

  const tentarSalvarConfiguracoes = () => {
    if (nivel !== nivelOriginal) {
      setConfirmandoAlteracao(true);
    } else {
      salvarConfiguracoes(false);
    }
  };

  const salvarConfiguracoes = async (resetarProgresso: boolean) => {
    if (!userId) return;
    setSalvando(true);
    setConfirmandoAlteracao(false);

    const updates: Record<string, unknown> = { nivel };
    if (resetarProgresso) {
      await supabase.from("progresso_topicos").delete().eq("user_id", userId);
      await supabase.from("historico_conceitos").delete().eq("user_id", userId);
      await supabase.from("fila_revisao").delete().eq("user_id", userId);
      await supabase.from("usuario_certificacoes").update({ semana_atual: 1, pontos: 0, streak: 0 }).eq("user_id", userId);
    }

    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
    if (error) mostrarMsg("erro", "Erro ao salvar configurações.");
    else {
      setNivelOriginal(nivel);
      mostrarMsg("sucesso", resetarProgresso ? "Nível alterado e progresso reiniciado." : "Nível atualizado!");
    }
    setSalvando(false);
  };

  const alterarSenha = async () => {
    if (!senhaAtual) return mostrarMsg("erro", "Digite sua senha atual.");
    if (novaSenha.length < 6) return mostrarMsg("erro", "A nova senha precisa ter ao menos 6 caracteres.");
    if (novaSenha !== confirmarSenha) return mostrarMsg("erro", "As senhas não coincidem.");
    if (novaSenha === senhaAtual) return mostrarMsg("erro", "A nova senha deve ser diferente da atual.");

    setSalvando(true);
    setVerificandoSenha(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: perfil?.email || "",
      password: senhaAtual,
    });

    if (loginError) {
      mostrarMsg("erro", "Senha atual incorreta.");
      setSalvando(false);
      setVerificandoSenha(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) mostrarMsg("erro", "Erro ao alterar senha.");
    else {
      mostrarMsg("sucesso", "Senha alterada com sucesso!");
      setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha("");
    }
    setSalvando(false);
    setVerificandoSenha(false);
  };

  const alterarEmail = async () => {
    if (!novoEmail.includes("@")) return mostrarMsg("erro", "Digite um e-mail válido.");
    if (novoEmail === perfil?.email) return mostrarMsg("erro", "O novo e-mail deve ser diferente do atual.");
    if (!senhaParaEmail) return mostrarMsg("erro", "Digite sua senha para confirmar.");

    setAlterandoEmail(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: perfil?.email || "",
      password: senhaParaEmail,
    });

    if (loginError) { mostrarMsg("erro", "Senha incorreta."); setAlterandoEmail(false); return; }

    const { error } = await supabase.auth.updateUser(
      { email: novoEmail },
      { emailRedirectTo: "https://testpath.online/confirmar-email" }
    );
    if (error) mostrarMsg("erro", "Erro ao alterar e-mail.");
    else { mostrarMsg("sucesso", "Confirmação enviada para o novo e-mail!"); setSenhaParaEmail(""); }
    setAlterandoEmail(false);
  };

  const uploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 2 * 1024 * 1024) return mostrarMsg("erro", "A foto deve ter no máximo 2MB.");

    setUploadando(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) { mostrarMsg("erro", "Erro ao fazer upload."); setUploadando(false); return; }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ foto_url: publicUrl }).eq("id", userId);
    setPerfil(prev => prev ? { ...prev, foto_url: publicUrl } : prev);
    mostrarMsg("sucesso", "Foto atualizada!");
    setUploadando(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0b0f1a", border: "1px solid #374151",
    borderRadius: "8px", padding: "10px 14px", color: "#e5e7eb",
    fontSize: "14px", fontFamily: "sans-serif", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };
  const inputDateStyle: React.CSSProperties = {
    ...inputStyle,
    WebkitAppearance: "none",
    appearance: "none",
    minWidth: 0,
  };
  const inputErro: React.CSSProperties = { ...inputStyle, borderColor: "#ef4444" };
  const labelStyle: React.CSSProperties = { fontSize: "12px", color: "#9ca3af", marginBottom: "5px", display: "block" };
  const erroStyle: React.CSSProperties = { fontSize: "11px", color: "#ef4444", marginTop: "4px" };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#3b82f6", fontFamily: "Georgia, serif" }}>Carregando perfil...</div>
    </main>
  );

  const xpTotal = perfil?.pontos || 0;
  const nivel_label = xpTotal < 100 ? "🌱 Aprendiz" : xpTotal < 300 ? "📖 Praticante" : xpTotal < 600 ? "🎯 Analista" : "🏆 Especialista";

  const logoGold: React.CSSProperties = {
    background: "linear-gradient(135deg, #d4af37, #f5d76e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmandoAlteracao && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1.5rem" }}>
          <div style={{ background: "#111827", border: "1px solid #374151", borderRadius: "16px", padding: "2rem", maxWidth: "420px", width: "100%" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>⚠️</div>
            <h3 style={{ fontSize: "1.1rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.75rem", textAlign: "center" }}>
              Alterar nível de conhecimento
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.6, marginBottom: "1.5rem", textAlign: "center" }}>
              Deseja <strong style={{ color: "#ef4444" }}>reiniciar o progresso</strong> para adaptar a trilha ao novo nível, ou <strong style={{ color: "#3b82f6" }}>manter o progresso atual</strong>?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={() => salvarConfiguracoes(true)}
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "8px", padding: "12px", color: "#ef4444", fontSize: "14px", cursor: "pointer", fontWeight: "600" }}>
                Reiniciar progresso e aplicar
              </button>
              <button onClick={() => salvarConfiguracoes(false)}
                style={{ background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", cursor: "pointer", fontWeight: "600" }}>
                Manter progresso e aplicar
              </button>
              <button onClick={() => setConfirmandoAlteracao(false)}
                style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "10px", color: "#9ca3af", fontSize: "13px", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky", top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", ...logoGold }}>TestPath</span>
        </a>
        <a href="/dashboard" style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "none" }}>← Dashboard</a>
      </nav>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem" }}>

        {/* HEADER */}
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div onClick={() => fileRef.current?.click()}
              style={{ width: "80px", height: "80px", borderRadius: "50%", background: perfil?.foto_url ? "transparent" : "#1f2937", border: "2px solid rgba(59,130,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative" }}>
              {perfil?.foto_url
                ? <img src={perfil.foto_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: "2rem" }}>👤</span>}
              {uploadando && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#3b82f6" }}>...</div>}
            </div>
            <div onClick={() => fileRef.current?.click()}
              style={{ position: "absolute", bottom: 0, right: 0, width: "24px", height: "24px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "12px" }}>
              ✏️
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadFoto} />
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "4px" }}>{perfil?.nome || "Sem nome"}</h1>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "8px" }}>{perfil?.email}</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)", padding: "3px 10px", borderRadius: "99px" }}>{nivel_label}</span>
              <span style={{ fontSize: "12px", background: "rgba(212,175,55,0.08)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.25)", padding: "3px 10px", borderRadius: "99px" }}>⭐ {xpTotal} XP</span>
              <span style={{ fontSize: "12px", background: "rgba(212,175,55,0.08)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.25)", padding: "3px 10px", borderRadius: "99px" }}>🔥 {perfil?.streak || 0} dias</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", minWidth: "200px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#e5e7eb" }}>{perfil?.semana_atual || 1}/8</div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>semana</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#d4af37" }}>{perfil?.maior_streak || 0}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>recorde</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#10b981" }}>{xpTotal}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>XP total</div>
            </div>
          </div>
        </div>

        {/* MENSAGEM */}
        {msg && (
          <div style={{ background: msg.tipo === "sucesso" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${msg.tipo === "sucesso" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem", color: msg.tipo === "sucesso" ? "#22c55e" : "#fca5a5", fontSize: "14px" }}>
            {msg.tipo === "sucesso" ? "✅" : "❌"} {msg.texto}
          </div>
        )}

        {/* ABAS */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem", background: "#111827", border: "1px solid #1f2937", borderRadius: "10px", padding: "4px" }}>
          {([{ id: "perfil", label: "👤 Meu Perfil" }, { id: "conta", label: "⚙️ Configurações" }, { id: "senha", label: "🔒 Segurança" }] as const).map(a => (
            <button key={a.id} onClick={() => setAba(a.id)}
              style={{ flex: 1, padding: "8px", borderRadius: "7px", border: "none", background: aba === a.id ? "rgba(59,130,246,0.12)" : "transparent", color: aba === a.id ? "#3b82f6" : "#9ca3af", fontSize: "13px", cursor: "pointer", fontWeight: aba === a.id ? "bold" : "normal", transition: "all 0.15s" }}>
              {a.label}
            </button>
          ))}
        </div>

        {/* ---- ABA PERFIL ---- */}
        {aba === "perfil" && (
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", margin: 0 }}>Informações pessoais</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Nome completo</label>
                <input style={inputStyle} value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome completo" />
              </div>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input style={erroTel ? inputErro : inputStyle} value={telefone}
                  onChange={e => { setTelefone(formatarTelefone(e.target.value)); setErroTel(""); }}
                  onBlur={() => { if (telefone && !validarTelefone(telefone)) setErroTel("Telefone inválido."); }}
                  placeholder="(31) 99999-9999" />
                {erroTel && <div style={erroStyle}>{erroTel}</div>}
              </div>
              <div>
                <label style={labelStyle}>Data de nascimento</label>
                <input style={erroData ? { ...inputDateStyle, borderColor: "#ef4444" } : inputDateStyle} type="date" value={dataNascimento}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={e => { setDataNascimento(e.target.value); setErroData(""); }}
                  onBlur={() => { const v = validarDataNascimento(dataNascimento); if (!v.valida) setErroData(v.erro); }} />
                {erroData && <div style={erroStyle}>{erroData}</div>}
              </div>
              <div>
                <label style={labelStyle}>CPF</label>
                <input style={erroCPF ? inputErro : inputStyle} value={cpf}
                  onChange={e => { setCpf(formatarCPF(e.target.value)); setErroCPF(""); }}
                  onBlur={() => { if (cpf && !validarCPF(cpf)) setErroCPF("CPF inválido."); }}
                  placeholder="000.000.000-00" />
                {erroCPF && <div style={erroStyle}>{erroCPF}</div>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>LinkedIn (URL do perfil)</label>
              <input style={inputStyle} value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/seu-perfil" />
            </div>

            <div>
              <label style={labelStyle}>Bio</label>
              <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Conte um pouco sobre você e sua carreira em QA..." />
            </div>

            <button onClick={salvarPerfil} disabled={salvando}
              style={{ background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: salvando ? "not-allowed" : "pointer", opacity: salvando ? 0.6 : 1, boxShadow: salvando ? "none" : "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)" }}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        )}

        {/* ---- ABA CONFIGURAÇÕES ---- */}
        {aba === "conta" && (
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", margin: 0 }}>Configurações de estudo</h2>

            <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#93c5fd", lineHeight: 1.5 }}>
              🎓 O ritmo e data meta de cada certificação são configurados diretamente no <a href="/dashboard" style={{ color: "#3b82f6", textDecoration: "none" }}>dashboard da trilha</a>.
            </div>

            {nivel !== nivelOriginal && (
              <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#d4af37" }}>
                ⚠️ Você tem alterações não salvas.
              </div>
            )}

            <div>
              <label style={{ ...labelStyle, fontSize: "13px", color: "#e5e7eb", marginBottom: "8px" }}>Nível de conhecimento em QA</label>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px", lineHeight: 1.5 }}>
                Define o tom do conteúdo e dificuldade das questões em todas as suas certificações.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { valor: "iniciante", emoji: "🌱", titulo: "Iniciante", desc: "Estou começando em QA agora — quero aprender do zero com linguagem simples" },
                  { valor: "basico", emoji: "📖", titulo: "Praticante", desc: "Já trabalho com QA — conheço os conceitos básicos e quero me certificar" },
                  { valor: "intermediario", emoji: "🎯", titulo: "Especialista", desc: "Tenho experiência sólida — quero questões desafiadoras e foco nas nuances" },
                ].map(n => (
                  <button key={n.valor} onClick={() => setNivel(n.valor)}
                    style={{ background: nivel === n.valor ? "rgba(59,130,246,0.08)" : "#0b0f1a", border: `1px solid ${nivel === n.valor ? "#3b82f6" : "#374151"}`, borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}>
                    <span style={{ fontSize: "1.3rem" }}>{n.emoji}</span>
                    <div>
                      <div style={{ color: "#e5e7eb", fontSize: "13px", fontWeight: "bold" }}>{n.titulo}</div>
                      <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.4 }}>{n.desc}</div>
                    </div>
                    {nivel === n.valor && <span style={{ marginLeft: "auto", color: "#3b82f6" }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={tentarSalvarConfiguracoes} disabled={salvando}
              style={{ background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: salvando ? "not-allowed" : "pointer", opacity: salvando ? 0.6 : 1, boxShadow: salvando ? "none" : "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)" }}>
              {salvando ? "Salvando..." : "Salvar configurações"}
            </button>
          </div>
        )}

        {/* ---- ABA SEGURANÇA ---- */}
        {aba === "senha" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Alterar email */}
            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", margin: 0 }}>Alterar e-mail</h2>
              <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#93c5fd" }}>
                💡 E-mail atual: <strong style={{ color: "#3b82f6" }}>{perfil?.email}</strong>
              </div>
              <div>
                <label style={labelStyle}>Novo e-mail</label>
                <input style={inputStyle} type="email" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} placeholder="novo@email.com" />
              </div>
              <div>
                <label style={labelStyle}>Senha atual (para confirmar)</label>
                <input style={inputStyle} type="password" value={senhaParaEmail} onChange={e => setSenhaParaEmail(e.target.value)} placeholder="Digite sua senha atual" />
              </div>
              <button onClick={alterarEmail} disabled={alterandoEmail}
                style={{ background: "transparent", border: "1px solid #3b82f6", borderRadius: "8px", padding: "11px", color: "#3b82f6", fontSize: "14px", fontWeight: "600", cursor: alterandoEmail ? "not-allowed" : "pointer", opacity: alterandoEmail ? 0.6 : 1 }}>
                {alterandoEmail ? "Enviando confirmação..." : "Alterar e-mail"}
              </button>
            </div>

            {/* Alterar senha */}
            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", margin: 0 }}>Alterar senha</h2>
              <div>
                <label style={labelStyle}>Senha atual</label>
                <input style={inputStyle} type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="Digite sua senha atual" />
              </div>
              <div>
                <label style={labelStyle}>Nova senha</label>
                <input style={inputStyle} type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Mínimo 6 caracteres" />
                {novaSenha.length > 0 && (
                  <div style={{ marginTop: "6px" }}>
                    <div style={{ background: "#1f2937", borderRadius: "99px", height: "3px" }}>
                      <div style={{ background: novaSenha.length < 6 ? "#ef4444" : novaSenha.length < 10 ? "#f59e0b" : "#22c55e", width: `${Math.min(100, (novaSenha.length / 12) * 100)}%`, height: "3px", borderRadius: "99px", transition: "all 0.3s" }} />
                    </div>
                    <div style={{ fontSize: "11px", color: novaSenha.length < 6 ? "#ef4444" : novaSenha.length < 10 ? "#f59e0b" : "#22c55e", marginTop: "3px" }}>
                      {novaSenha.length < 6 ? "Muito curta" : novaSenha.length < 10 ? "Razoável" : "Forte ✓"}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Confirmar nova senha</label>
                <input style={confirmarSenha && novaSenha !== confirmarSenha ? inputErro : inputStyle} type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="Repita a nova senha" />
                {confirmarSenha && novaSenha !== confirmarSenha && <div style={erroStyle}>As senhas não coincidem</div>}
              </div>
              <button onClick={alterarSenha} disabled={salvando || !senhaAtual || novaSenha.length < 6 || novaSenha !== confirmarSenha}
                style={{ background: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: (salvando || !senhaAtual || novaSenha.length < 6 || novaSenha !== confirmarSenha) ? 0.4 : 1, boxShadow: (salvando || !senhaAtual || novaSenha.length < 6 || novaSenha !== confirmarSenha) ? "none" : "0 0 0 1px rgba(59,130,246,0.4), 0 8px 24px rgba(59,130,246,0.15)" }}>
                {salvando && verificandoSenha ? "Verificando..." : salvando ? "Alterando..." : "Alterar senha"}
              </button>
            </div>

            {/* Zona de perigo */}
            <div style={{ background: "#111827", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "1.75rem" }}>
              <h3 style={{ fontSize: "13px", color: "#ef4444", marginBottom: "12px" }}>⚠️ Zona de perigo</h3>
              <button onClick={async () => { if (confirm("Sair de todas as sessões?")) { await supabase.auth.signOut(); window.location.href = "/login"; } }}
                style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "8px", padding: "10px 16px", color: "#ef4444", fontSize: "13px", cursor: "pointer", width: "100%" }}>
                Sair de todas as sessões
              </button>
            </div>
          </div>
        )}
        <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || ""} format="rectangle" style={{ marginTop: "2rem" }} />
      </div>
    </main>
  );
}
