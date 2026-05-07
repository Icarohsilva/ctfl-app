import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — TestPath",
  description: "Política de privacidade da plataforma TestPath. Saiba como coletamos, usamos e protegemos seus dados.",
};

export default function PoliticaPrivacidade() {
  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "13px", textDecoration: "none", marginBottom: "2rem" }}>
          ← Voltar
        </a>

        <h1 style={{ fontSize: "2rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.5rem" }}>
          Política de Privacidade
        </h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "2.5rem" }}>
          Última atualização: maio de 2025
        </p>

        {[
          {
            titulo: "1. Quem somos",
            texto: `O TestPath (testpath.online) é uma plataforma educacional voltada à preparação para certificações na área de QA (Quality Assurance), com foco inicial no exame CTFL v4.0 do ISTQB. O responsável pelo tratamento dos dados é Ícaro Silva, com contato disponível pelo formulário de feedback da plataforma.`,
          },
          {
            titulo: "2. Dados que coletamos",
            texto: `Ao criar uma conta, coletamos:
• Nome e endereço de e-mail (cadastro e autenticação);
• Foto de perfil (opcional, fornecida pelo usuário);
• Progresso nos estudos: tópicos concluídos, resultados de simulados, XP, streak de dias estudados;
• Preferências de estudo: ritmo, data-meta, certificação escolhida;
• Dados técnicos de notificações push: endpoint e chaves de assinatura do navegador (somente se você autorizar notificações).

Não coletamos dados de pagamento (a plataforma é gratuita).`,
          },
          {
            titulo: "3. Como usamos seus dados",
            texto: `Seus dados são usados exclusivamente para:
• Criar e manter sua conta de acesso;
• Registrar seu progresso e personalizar sua trilha de estudos;
• Enviar notificações de estudo (apenas se você autorizar);
• Enviar lembretes por e-mail (somente se configurado);
• Melhorar o conteúdo e a experiência da plataforma com base em dados agregados e anônimos.

Não vendemos, alugamos nem compartilhamos seus dados pessoais com terceiros para fins comerciais.`,
          },
          {
            titulo: "4. Cookies e tecnologias similares",
            texto: `O TestPath utiliza cookies de sessão para manter você autenticado (via Supabase Auth). Não usamos cookies de rastreamento de terceiros para fins de marketing.

O Google AdSense, quando ativo, pode utilizar cookies para exibir anúncios relevantes. Você pode gerenciar as preferências de anúncios do Google em: adssettings.google.com.`,
          },
          {
            titulo: "5. Armazenamento e segurança",
            texto: `Seus dados são armazenados na plataforma Supabase (infraestrutura na AWS, região us-east-1). A comunicação é protegida por HTTPS/TLS. Senhas são armazenadas com hash seguro — nunca em texto simples. Tomamos medidas técnicas e organizacionais razoáveis para proteger suas informações contra acesso não autorizado.`,
          },
          {
            titulo: "6. Seus direitos (LGPD)",
            texto: `De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
• Confirmar a existência de tratamento dos seus dados;
• Acessar seus dados;
• Corrigir dados incompletos ou desatualizados;
• Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;
• Revogar o consentimento a qualquer momento;
• Solicitar a exclusão completa da sua conta e dados associados.

Para exercer qualquer desses direitos, entre em contato pelo formulário de feedback da plataforma.`,
          },
          {
            titulo: "7. Retenção de dados",
            texto: `Mantemos seus dados enquanto sua conta estiver ativa. Ao solicitar a exclusão da conta, apagamos seus dados pessoais em até 30 dias, salvo obrigação legal de retenção.`,
          },
          {
            titulo: "8. Menores de idade",
            texto: `O TestPath é destinado a pessoas com 18 anos ou mais. Não coletamos intencionalmente dados de menores. Se identificarmos cadastro de menor de idade, excluiremos a conta imediatamente.`,
          },
          {
            titulo: "9. Alterações nesta política",
            texto: `Podemos atualizar esta política periodicamente. Notificaremos usuários cadastrados sobre mudanças relevantes por e-mail. A data da última atualização consta sempre no topo desta página.`,
          },
          {
            titulo: "10. Contato",
            texto: `Para dúvidas, solicitações ou exercício dos seus direitos, utilize o formulário de feedback disponível em todas as páginas da plataforma ou envie e-mail para: contato@testpath.online`,
          },
        ].map(({ titulo, texto }) => (
          <section key={titulo} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", color: "#d4af37", marginBottom: "0.75rem", fontWeight: "600" }}>{titulo}</h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.75, whiteSpace: "pre-line" }}>{texto}</p>
          </section>
        ))}

        <div style={{ borderTop: "1px solid #1f2937", paddingTop: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <a href="/termos" style={{ color: "#6b7280", fontSize: "13px", textDecoration: "none" }}>Termos de Uso</a>
          <a href="/" style={{ color: "#6b7280", fontSize: "13px", textDecoration: "none" }}>Início</a>
        </div>
      </div>
    </main>
  );
}
