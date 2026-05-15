// src/data/ingles-licoes.ts
import type { NivelCEFR, MetaIngles } from "./ingles-curriculum";

export type LicaoBase = {
  id: string;
  nivel: NivelCEFR;
  titulo: string;
  contexto: string;             // instrução para o Groq
  frases_exemplo: string[];     // frases de referência para os exercícios
  vocabulario: { en: string; pt: string }[];
  foco_meta: Record<MetaIngles, string>; // personalização por objetivo do usuário
};

export const licoesBases: Record<string, LicaoBase> = {

  // ── A1 ─────────────────────────────────────────────────────────────────

  "a1-u1-n1": {
    id: "a1-u1-n1", nivel: "A1", titulo: "Hello, I'm a QA",
    contexto: "Lição introdutória para QA iniciantes. Foco em apresentações simples, verbo to be no presente, vocabulário de identidade profissional.",
    frases_exemplo: [
      "Hi, my name is Ana. I am a QA engineer.",
      "I work at a tech company.",
      "I test software to find bugs.",
      "Nice to meet you.",
      "I am from Brazil.",
    ],
    vocabulario: [
      { en: "QA engineer", pt: "engenheiro de QA" },
      { en: "software tester", pt: "testador de software" },
      { en: "I work at", pt: "eu trabalho em" },
      { en: "nice to meet you", pt: "prazer em conhecê-lo" },
      { en: "I am", pt: "eu sou / eu estou" },
    ],
    foco_meta: {
      docs: "Inclua frases sobre leitura de documentação técnica.",
      calls: "Inclua frases de apresentação em videochamadas.",
      entrevistas: "Inclua frases de abertura para entrevistas de emprego.",
    },
  },

  "a1-u1-n2": {
    id: "a1-u1-n2", nivel: "A1", titulo: "Job titles in tech",
    contexto: "Vocabulário de cargos em tecnologia. Foco em substantivos, artigo indefinido 'a/an', diferenças entre títulos.",
    frases_exemplo: [
      "She is a frontend developer.",
      "He is a product manager.",
      "We are QA engineers.",
      "The team has a designer and two testers.",
      "I report to the QA lead.",
    ],
    vocabulario: [
      { en: "developer", pt: "desenvolvedor" },
      { en: "tester", pt: "testador" },
      { en: "QA lead", pt: "líder de QA" },
      { en: "product manager", pt: "gerente de produto" },
      { en: "designer", pt: "designer" },
      { en: "team", pt: "time / equipe" },
    ],
    foco_meta: {
      docs: "Inclua frases sobre quem escreve e lê documentação.",
      calls: "Inclua frases de apresentação do time em reuniões.",
      entrevistas: "Inclua frases sobre hierarquia e cargos em entrevistas.",
    },
  },

  "a1-u3-n1": {
    id: "a1-u3-n1", nivel: "A1", titulo: "What is a bug?",
    contexto: "Conceito de bug e defeito para iniciantes. Foco em vocabulário básico de QA, frases simples no presente.",
    frases_exemplo: [
      "A bug is a problem in the software.",
      "I found a bug on the login page.",
      "The button is not working.",
      "The app crashes when I click save.",
      "This is a critical bug.",
    ],
    vocabulario: [
      { en: "bug", pt: "bug / defeito" },
      { en: "defect", pt: "defeito" },
      { en: "crash", pt: "travar / crashar" },
      { en: "login page", pt: "página de login" },
      { en: "not working", pt: "não está funcionando" },
      { en: "critical", pt: "crítico" },
    ],
    foco_meta: {
      docs: "Use exemplos de bugs documentados em ferramentas como Jira.",
      calls: "Use frases para reportar bugs verbalmente em reuniões.",
      entrevistas: "Use exemplos de bugs para responder 'Tell me about a bug you found'.",
    },
  },

  "a1-u4-n1": {
    id: "a1-u4-n1", nivel: "A1", titulo: "Yesterday I tested...",
    contexto: "Stand-up diário: o que fiz ontem. Foco no passado simples, verbos de teste e QA.",
    frases_exemplo: [
      "Yesterday I tested the checkout flow.",
      "I ran 15 test cases.",
      "I found two bugs.",
      "I reviewed the test plan.",
      "I finished testing the login module.",
    ],
    vocabulario: [
      { en: "tested", pt: "testei" },
      { en: "ran test cases", pt: "executei casos de teste" },
      { en: "found bugs", pt: "encontrei bugs" },
      { en: "reviewed", pt: "revisei" },
      { en: "finished", pt: "terminei" },
    ],
    foco_meta: {
      docs: "Inclua frases sobre atualização de documentação.",
      calls: "Inclua frases para o stand-up diário em videochamada.",
      entrevistas: "Inclua exemplos de resultados de trabalho passado.",
    },
  },

  // ── A2 ─────────────────────────────────────────────────────────────────

  "a2-u2-n1": {
    id: "a2-u2-n1", nivel: "A2", titulo: "Defect title patterns",
    contexto: "Padrões de título de bug report em inglês. Foco em estrutura [Componente] + [Verbo] + [Comportamento], tempo presente simples.",
    frases_exemplo: [
      "Login button unresponsive on iOS 17.",
      "Payment fails when discount code is applied.",
      "User profile image not loading in dark mode.",
      "Search returns no results for special characters.",
      "Checkout page crashes on slow network.",
    ],
    vocabulario: [
      { en: "unresponsive", pt: "sem resposta / travado" },
      { en: "fails", pt: "falha" },
      { en: "not loading", pt: "não carregando" },
      { en: "crashes", pt: "trava / cai" },
      { en: "returns", pt: "retorna" },
      { en: "discount code", pt: "código de desconto" },
    ],
    foco_meta: {
      docs: "Use frases para títulos de bugs em Jira/Linear.",
      calls: "Use frases para descrever bugs verbalmente de forma clara.",
      entrevistas: "Use exemplos de bons títulos de bugs para mostrar habilidade.",
    },
  },

  "a2-u3-n1": {
    id: "a2-u3-n1", nivel: "A2", titulo: "Asking for clarification",
    contexto: "Expressões para pedir esclarecimentos em reuniões e chats. Foco em linguagem educada, modal verbs (could, would).",
    frases_exemplo: [
      "Could you clarify what you mean by that?",
      "Sorry, I didn't quite catch that. Could you repeat?",
      "What do you mean by 'out of scope'?",
      "Can you give me an example?",
      "I want to make sure I understand — are you saying the feature is blocked?",
    ],
    vocabulario: [
      { en: "clarify", pt: "esclarecer" },
      { en: "out of scope", pt: "fora do escopo" },
      { en: "I didn't catch that", pt: "não entendi" },
      { en: "make sure", pt: "ter certeza" },
      { en: "are you saying", pt: "você está dizendo" },
    ],
    foco_meta: {
      docs: "Use expressões para esclarecer requisitos em documentos.",
      calls: "Use expressões para pedir repetição em calls internacionais.",
      entrevistas: "Use expressões para pedir esclarecimento em perguntas técnicas.",
    },
  },

  // ── B1 ─────────────────────────────────────────────────────────────────

  "b1-u1-n1": {
    id: "b1-u1-n1", nivel: "B1", titulo: "Tell me about yourself",
    contexto: "Resposta estruturada para a pergunta mais comum de entrevistas em inglês. Foco em estrutura Present Perfect + Simple Past + Present.",
    frases_exemplo: [
      "I have been working in software quality assurance for three years.",
      "In my current role at Acme Corp, I lead the regression testing effort for our mobile app.",
      "Before that, I worked as a manual tester and transitioned into automation using Playwright.",
      "I'm passionate about improving processes and reducing production defects.",
      "I'm now looking for a role where I can grow into a QA lead position.",
    ],
    vocabulario: [
      { en: "I have been working", pt: "tenho trabalhado" },
      { en: "in my current role", pt: "na minha função atual" },
      { en: "I lead", pt: "eu lidero" },
      { en: "transitioned into", pt: "fiz transição para" },
      { en: "I'm passionate about", pt: "sou apaixonado por" },
      { en: "looking for", pt: "procurando" },
    ],
    foco_meta: {
      docs: "Inclua referência a contribuições em documentação técnica.",
      calls: "Inclua frases para apresentação em calls com equipes internacionais.",
      entrevistas: "Estruture a resposta completa de 60 segundos para entrevistas.",
    },
  },

  // ── B2 ─────────────────────────────────────────────────────────────────

  "b2-u1-n1": {
    id: "b2-u1-n1", nivel: "B2", titulo: "Opening & closing meetings",
    contexto: "Fórmulas avançadas para abrir e fechar reuniões como líder de QA. Foco em linguagem formal, gerenciamento de agenda, expressões de facilitação.",
    frases_exemplo: [
      "Thank you all for joining. Let's get started — today's agenda has three items.",
      "Before we dive in, I'd like to set some ground rules.",
      "Let's park that discussion for now and add it to the backlog.",
      "To summarize what we've agreed: we'll prioritize the payment flow in this sprint.",
      "Thank you all for your input. I'll send the meeting notes and action items within the hour.",
    ],
    vocabulario: [
      { en: "let's get started", pt: "vamos começar" },
      { en: "agenda", pt: "pauta" },
      { en: "park that discussion", pt: "deixar essa discussão para depois" },
      { en: "to summarize", pt: "para resumir" },
      { en: "action items", pt: "itens de ação" },
      { en: "within the hour", pt: "dentro de uma hora" },
    ],
    foco_meta: {
      docs: "Inclua frases para registrar atas e decisões.",
      calls: "Inclua expressões para facilitar reuniões remotas internacionais.",
      entrevistas: "Inclua frases para demonstrar experiência em liderança de reuniões.",
    },
  },
};
