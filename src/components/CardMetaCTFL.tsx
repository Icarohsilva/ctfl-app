"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type CertUsuario = {
  ritmo: string;
  data_meta: string | null;
  data_inicio: string;
};

type Props = {
  cert: CertUsuario;
  userId: string;
  progressoGeral: number;
  onAtualizar: () => void;
};

const ritmoOpcoes = [
  { valor: "leve", emoji: "🌊", titulo: "Leve", desc: "~30min/dia · ~10 semanas", dias: 70 },
  { valor: "moderado", emoji: "📅", titulo: "Moderado", desc: "~1h/dia · ~8 semanas", dias: 56 },
  { valor: "intensivo", emoji: "⚡", titulo: "Intensivo", desc: "~2h/dia · ~4 semanas", dias: 28 },
];

export default function CardMetaCTFL({ cert, userId, progressoGeral, onAtualizar }: Props) {
  const [editando, setEditando] = useState(false);
  const [ritmo, setRitmo] = useState(cert.ritmo);
  const [dataMeta, setDataMeta] = useState(cert.data_meta || "");
  const [semMeta, setSemMeta] = useState(!cert.data_meta);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const calcularDataMeta = (r: string) => {
    const hoje = new Date();
    const opcao = ritmoOpcoes.find(o => o.valor === r);
    hoje.setDate(hoje.getDate() + (opcao?.dias || 56));
    return hoje.toISOString().split("T")[0];
  };

  const selecionarRitmo = (r: string) => {
    setRitmo(r);
    if (!semMeta) setDataMeta(calcularDataMeta(r));
  };

  const calcularProgressoEsperado = () => {
    if (!cert.data_meta) return null;
    const inicio = new Date(cert.data_inicio).getTime();
    const meta = new Date(cert.data_meta).getTime();
    const agora = Date.now();
    const pctTempo = Math.min(100, Math.round(((agora - inicio) / (meta - inicio)) * 100));
    return pctTempo;
  };

  const salvar = async () => {
    setSalvando(true);
    const novaDataMeta = semMeta ? null : dataMeta || null;

    await supabase.from("usuario_certificacoes").update({
      ritmo,
      data_meta: novaDataMeta,
    }).eq("user_id", userId).eq("certificacao_id", "ctfl");

    setMsg("✅ Trilha atualizada!");
    setTimeout(() => setMsg(""), 3000);
    setSalvando(false);
    setEditando(false);
    onAtualizar();
  };

  const diasRestantes = cert.data_meta
    ? Math.max(0, Math.ceil((new Date(cert.data_meta).getTime() - Date.now()) / 86400000))
    : null;

  const progressoEsperado = calcularProgressoEsperado();
  const adiantado = progressoEsperado !== null && progressoGeral >= progressoEsperado;
  const ritmoLabel = ritmoOpcoes.find(r => r.valor === cert.ritmo);

  return (
    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editando ? "1.25rem" : "0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.3rem" }}>🎓</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb" }}>Minha trilha CTFL</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {ritmoLabel?.titulo} · {ritmoLabel?.desc}
              {cert.data_meta && ` · Meta: ${new Date(cert.data_meta).toLocaleDateString("pt-BR")}`}
            </div>
          </div>
        </div>
        <button onClick={() => setEditando(!editando)}
          style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "5px 12px", color: "#9ca3af", fontSize: "12px", cursor: "pointer" }}>
          {editando ? "Cancelar" : "✏️ Editar"}
        </button>
      </div>

      {!editando && (
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Progresso atual</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {progressoEsperado !== null && (
                <span style={{ fontSize: "11px", color: adiantado ? "#22c55e" : "#ef4444" }}>
                  {adiantado ? "✓ Adiantado" : `Esperado: ${progressoEsperado}%`}
                </span>
              )}
              <span style={{ fontSize: "12px", color: "#3b82f6", fontWeight: "bold" }}>{progressoGeral}%</span>
            </div>
          </div>

          <div style={{ background: "#1f2937", borderRadius: "99px", height: "6px", position: "relative", overflow: "hidden" }}>
            {progressoEsperado !== null && (
              <div style={{ position: "absolute", top: 0, left: 0, width: `${progressoEsperado}%`, height: "6px", background: "#374151", borderRadius: "99px" }} />
            )}
            <div style={{ position: "absolute", top: 0, left: 0, width: `${progressoGeral}%`, height: "6px", background: `linear-gradient(90deg, ${adiantado ? "#22c55e" : "#3b82f6"}, ${adiantado ? "#86efac" : "#60a5fa"})`, borderRadius: "99px", transition: "width 0.5s ease" }} />
          </div>

          {diasRestantes !== null && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: diasRestantes < 14 ? "#ef4444" : "#6b7280" }}>
              {diasRestantes === 0 ? "⚠️ Sua prova é hoje!" : diasRestantes < 14 ? `⚠️ ${diasRestantes} dias restantes` : `📅 ${diasRestantes} dias até o exame`}
            </div>
          )}

          {!cert.data_meta && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
              Sem data alvo definida · <button onClick={() => setEditando(true)} style={{ background: "none", border: "none", color: "#3b82f6", fontSize: "12px", cursor: "pointer", padding: 0 }}>Definir meta</button>
            </div>
          )}
        </div>
      )}

      {editando && (
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px", display: "block" }}>Ritmo de estudo</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {ritmoOpcoes.map(r => (
                <button key={r.valor} onClick={() => selecionarRitmo(r.valor)}
                  style={{ background: ritmo === r.valor ? "rgba(59,130,246,0.08)" : "#0b0f1a", border: `1px solid ${ritmo === r.valor ? "#3b82f6" : "#374151"}`, borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}>
                  <span style={{ fontSize: "1.2rem" }}>{r.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e5e7eb", fontSize: "13px", fontWeight: "bold" }}>{r.titulo}</div>
                    <div style={{ color: "#9ca3af", fontSize: "12px" }}>{r.desc}</div>
                  </div>
                  {ritmo === r.valor && <span style={{ color: "#3b82f6" }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "#0b0f1a", border: "1px solid #374151", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", boxSizing: "border-box", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: semMeta ? 0 : "10px" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#e5e7eb", fontWeight: "bold" }}>📅 Data alvo para o exame</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Opcional</div>
              </div>
              <button onClick={() => { setSemMeta(!semMeta); if (!semMeta) setDataMeta(""); else if (ritmo) setDataMeta(calcularDataMeta(ritmo)); }}
                style={{ background: semMeta ? "#1f2937" : "rgba(59,130,246,0.08)", border: `1px solid ${semMeta ? "#374151" : "rgba(59,130,246,0.3)"}`, borderRadius: "99px", padding: "4px 12px", color: semMeta ? "#6b7280" : "#3b82f6", fontSize: "12px", cursor: "pointer" }}>
                {semMeta ? "Sem prazo" : "Com prazo"}
              </button>
            </div>
            {!semMeta && (
              <input type="date" value={dataMeta} min={new Date().toISOString().split("T")[0]}
                onChange={e => setDataMeta(e.target.value)}
                style={{ width: "100%", maxWidth: "100%", background: "#111827", border: "1px solid #374151", borderRadius: "8px", padding: "8px 12px", color: "#e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box", marginTop: "10px", display: "block" }} />
            )}
          </div>

          <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#9ca3af", marginBottom: "1rem", lineHeight: 1.5 }}>
            💡 Alterar o ritmo ou data <strong style={{ color: "#3b82f6" }}>não afeta seu progresso</strong> — apenas recalcula o cronograma esperado.
          </div>

          <button onClick={salvar} disabled={salvando}
            style={{ background: "#3b82f6", border: "none", borderRadius: "8px", padding: "11px", color: "#ffffff", fontSize: "14px", fontWeight: "bold", cursor: salvando ? "not-allowed" : "pointer", opacity: salvando ? 0.7 : 1, width: "100%" }}>
            {salvando ? "Salvando..." : "Salvar configurações da trilha"}
          </button>
        </div>
      )}

      {msg && (
        <div style={{ marginTop: "10px", fontSize: "13px", color: "#22c55e" }}>{msg}</div>
      )}
    </div>
  );
}
