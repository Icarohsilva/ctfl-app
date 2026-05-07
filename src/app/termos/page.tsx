import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — TestPath",
  description: "Termos e condições de uso da plataforma TestPath.",
};

export default function TermosDeUso() {
  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "13px", textDecoration: "none", marginBottom: "2rem" }}>
          ← Voltar
        </a>

        <h1 style={{ fontSize: "2rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.5rem" }}>
          Termos de Uso
        </h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "2.5rem" }}>
          Última atualização: maio de 2025
        </p>

        {[
          {
            titulo: "1. Aceitação dos Termos",
            texto: `Ao acessar ou usar o TestPath (testpath.online), você concorda com estes Termos de Uso. Se não concordar com algum ponto, não utilize a plataforma.`,
          },
          {
            titulo: "2. Descrição do Serviço",
            texto: `O TestPath é uma plataforma educacional gratuita que oferece trilhas de estudo, simulados gerados por IA e ferramentas de acompanhamento de progresso para profissionais que desejam se preparar para certificações de qualidade de software, como o CTFL (Certified Tester Foundation Level) do ISTQB.

O TestPath não é afiliado ao ISTQB, BSTQB ou qualquer outra entidade certificadora. O conteúdo é de natureza educacional e preparatória.`,
          },
          {
            titulo: "3. Cadastro e Conta",
            texto: `Para acessar os recursos da plataforma, é necessário criar uma conta com e-mail e senha válidos. Você é responsável por manter a confidencialidade das suas credenciais e por todas as atividades realizadas com sua conta.

Você deve ter ao menos 18 anos para criar uma conta.`,
          },
          {
            titulo: "4. Uso Permitido",
            texto: `Você pode usar o TestPath para fins pessoais de aprendizado e preparação para certificações. É permitido:
• Acessar trilhas de estudo e tópicos;
• Realizar simulados e revisar resultados;
• Compartilhar sua conquista em redes sociais usando os recursos da plataforma.`,
          },
          {
            titulo: "5. Uso Proibido",
            texto: `É expressamente proibido:
• Reproduzir, distribuir ou comercializar o conteúdo da plataforma sem autorização;
• Usar mecanismos automatizados (bots, scrapers) para acessar ou coletar dados;
• Tentar burlar mecanismos de segurança ou autenticação;
• Usar a plataforma para fins ilegais ou que prejudiquem terceiros;
• Compartilhar credenciais de acesso com outras pessoas.`,
          },
          {
            titulo: "6. Conteúdo Gerado por IA",
            texto: `Os simulados do TestPath são gerados com auxílio de modelos de linguagem (IA). Embora o conteúdo seja revisado e alinhado ao syllabus oficial do CTFL v4.0, podem ocorrer imprecisões. O TestPath não garante que as questões geradas refletem exatamente o conteúdo do exame oficial. Use como ferramenta de preparação, não como substituto do material oficial ISTQB.`,
          },
          {
            titulo: "7. Propriedade Intelectual",
            texto: `Todo o conteúdo original do TestPath — incluindo textos, design, código e estrutura das trilhas — é de propriedade do TestPath e protegido por direitos autorais. Os termos e definições do CTFL seguem o syllabus público do ISTQB, que é de propriedade do ISTQB.`,
          },
          {
            titulo: "8. Anúncios",
            texto: `O TestPath pode exibir anúncios do Google AdSense para manter a plataforma gratuita. Os anúncios são gerenciados pelo Google e sujeitos à política de privacidade do Google.`,
          },
          {
            titulo: "9. Disponibilidade do Serviço",
            texto: `O TestPath é oferecido "como está" e "conforme disponível". Não garantimos disponibilidade ininterrupta. Podemos, a qualquer momento, modificar, suspender ou encerrar partes do serviço sem aviso prévio.`,
          },
          {
            titulo: "10. Limitação de Responsabilidade",
            texto: `O TestPath não se responsabiliza por:
• Resultado em exames de certificação;
• Decisões tomadas com base no conteúdo da plataforma;
• Interrupções de serviço ou perda de dados;
• Conteúdo de sites externos vinculados pela plataforma.

Em nenhuma hipótese nossa responsabilidade total excederá o valor pago pelos serviços nos últimos 12 meses (que atualmente é zero, pois o serviço é gratuito).`,
          },
          {
            titulo: "11. Encerramento de Conta",
            texto: `Você pode encerrar sua conta a qualquer momento pelo painel de perfil ou via solicitação pelo formulário de feedback. Podemos encerrar ou suspender sua conta em caso de violação destes termos.`,
          },
          {
            titulo: "12. Alterações nos Termos",
            texto: `Podemos atualizar estes termos periodicamente. Notificaremos usuários cadastrados por e-mail sobre mudanças significativas. O uso continuado da plataforma após a notificação implica aceitação dos novos termos.`,
          },
          {
            titulo: "13. Lei Aplicável",
            texto: `Estes termos são regidos pelas leis brasileiras. Quaisquer disputas serão resolvidas no foro da comarca de Curitiba-PR, Brasil.`,
          },
          {
            titulo: "14. Contato",
            texto: `Para dúvidas sobre estes termos, utilize o formulário de feedback disponível na plataforma ou envie e-mail para: contato@testpath.online`,
          },
        ].map(({ titulo, texto }) => (
          <section key={titulo} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", color: "#d4af37", marginBottom: "0.75rem", fontWeight: "600" }}>{titulo}</h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.75, whiteSpace: "pre-line" }}>{texto}</p>
          </section>
        ))}

        <div style={{ borderTop: "1px solid #1f2937", paddingTop: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <a href="/privacidade" style={{ color: "#6b7280", fontSize: "13px", textDecoration: "none" }}>Política de Privacidade</a>
          <a href="/" style={{ color: "#6b7280", fontSize: "13px", textDecoration: "none" }}>Início</a>
        </div>
      </div>
    </main>
  );
}
