import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type CertificacaoUsuario = {
  id: string;
  certificacao_id: string;
  status: string;
  data_inicio: string;
  data_meta: string | null;
  ritmo: string;
  semana_atual: number;
  pontos: number;
  streak: number;
  maior_streak: number;
  ultimo_estudo: string | null;
};

export function useCertificacao(certId: string) {
  const [cert, setCert] = useState<CertificacaoUsuario | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [precisaOnboarding, setPrecisaOnboarding] = useState(false);

  useEffect(() => { carregar(); }, [certId]);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("usuario_certificacoes")
      .select("*")
      .eq("user_id", user.id)
      .eq("certificacao_id", certId)
      .single();

    if (!data) {
      setPrecisaOnboarding(true);
    } else {
      setCert(data);

      // Verifica e atualiza streak
      const hoje = new Date().toISOString().split("T")[0];
      const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (data.ultimo_estudo !== hoje && data.ultimo_estudo !== ontem && data.streak > 0) {
        await supabase.from("usuario_certificacoes")
          .update({ streak: 0 })
          .eq("user_id", user.id)
          .eq("certificacao_id", certId);
        setCert(prev => prev ? { ...prev, streak: 0 } : prev);
      }
    }
    setLoading(false);
  };

  const atualizarProgresso = async (xpGanho: number) => {
    if (!userId || !cert) return;
    const hoje = new Date().toISOString().split("T")[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const novoStreak = cert.ultimo_estudo === ontem || cert.ultimo_estudo === hoje
      ? cert.streak + 1
      : 1;
    const maiorStreak = Math.max(novoStreak, cert.maior_streak);
    const novosPontos = cert.pontos + xpGanho;

    await supabase.from("usuario_certificacoes").update({
      pontos: novosPontos,
      streak: novoStreak,
      maior_streak: maiorStreak,
      ultimo_estudo: hoje,
    }).eq("user_id", userId).eq("certificacao_id", certId);

    setCert(prev => prev ? { ...prev, pontos: novosPontos, streak: novoStreak, maior_streak: maiorStreak, ultimo_estudo: hoje } : prev);
  };

  // Calcula dias restantes até a meta
  const diasRestantes = cert?.data_meta
    ? Math.max(0, Math.ceil((new Date(cert.data_meta).getTime() - Date.now()) / 86400000))
    : null;

  // Calcula % do prazo consumido
  const pctPrazo = cert?.data_meta && cert?.data_inicio
    ? Math.min(100, Math.round(
        (Date.now() - new Date(cert.data_inicio).getTime()) /
        (new Date(cert.data_meta).getTime() - new Date(cert.data_inicio).getTime()) * 100
      ))
    : null;

  return { cert, userId, loading, precisaOnboarding, diasRestantes, pctPrazo, atualizarProgresso, recarregar: carregar };
}