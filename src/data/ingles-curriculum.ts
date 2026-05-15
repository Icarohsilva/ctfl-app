// src/data/ingles-curriculum.ts

export type NivelCEFR = "A1" | "A2" | "B1" | "B2";
export type TipoNode = "licao" | "checkpoint";
export type MetaIngles = "docs" | "calls" | "entrevistas";
export type TipoExercicio =
  | "multipla"
  | "traducao"
  | "ordenar"
  | "speaking"
  | "completar"
  | "listening";

export type NodeMeta = {
  id: string;
  numero: number;
  titulo: string;
  tipo: TipoNode;
  xp: number;
};

export type UnidadeMeta = {
  numero: number;
  titulo: string;
  emoji: string;
  nodes: NodeMeta[];
};

export type NivelMeta = {
  nivel: NivelCEFR;
  titulo: string;
  descricao: string;
  cor: string;
  unidades: UnidadeMeta[];
};

export const curriculumIngles: NivelMeta[] = [
  {
    nivel: "A1",
    titulo: "Sobrevivência Técnica",
    descricao: "Primeiras palavras e frases para o dia a dia de QA",
    cor: "#22c55e",
    unidades: [
      {
        numero: 1, titulo: "Greetings & Job Titles", emoji: "👋",
        nodes: [
          { id: "a1-u1-n1", numero: 1, titulo: "Hello, I'm a QA", tipo: "licao", xp: 30 },
          { id: "a1-u1-n2", numero: 2, titulo: "Job titles in tech", tipo: "licao", xp: 30 },
          { id: "a1-u1-n3", numero: 3, titulo: "Your team & role", tipo: "licao", xp: 30 },
          { id: "a1-u1-n4", numero: 4, titulo: "Introducing yourself", tipo: "licao", xp: 30 },
          { id: "a1-u1-n5", numero: 5, titulo: "Checkpoint 1", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 2, titulo: "Numbers, Dates & Times", emoji: "📅",
        nodes: [
          { id: "a1-u2-n1", numero: 1, titulo: "Counting bugs", tipo: "licao", xp: 30 },
          { id: "a1-u2-n2", numero: 2, titulo: "Dates and deadlines", tipo: "licao", xp: 30 },
          { id: "a1-u2-n3", numero: 3, titulo: "Time expressions", tipo: "licao", xp: 30 },
          { id: "a1-u2-n4", numero: 4, titulo: "Sprint durations", tipo: "licao", xp: 30 },
          { id: "a1-u2-n5", numero: 5, titulo: "Checkpoint 2", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 3, titulo: "Basic Bug Reports", emoji: "🐛",
        nodes: [
          { id: "a1-u3-n1", numero: 1, titulo: "What is a bug?", tipo: "licao", xp: 30 },
          { id: "a1-u3-n2", numero: 2, titulo: "Bug severity words", tipo: "licao", xp: 30 },
          { id: "a1-u3-n3", numero: 3, titulo: "Steps to reproduce", tipo: "licao", xp: 30 },
          { id: "a1-u3-n4", numero: 4, titulo: "Expected vs actual", tipo: "licao", xp: 30 },
          { id: "a1-u3-n5", numero: 5, titulo: "Checkpoint 3", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 4, titulo: "Daily Stand-up", emoji: "🗣️",
        nodes: [
          { id: "a1-u4-n1", numero: 1, titulo: "Yesterday I tested...", tipo: "licao", xp: 30 },
          { id: "a1-u4-n2", numero: 2, titulo: "Today I will...", tipo: "licao", xp: 30 },
          { id: "a1-u4-n3", numero: 3, titulo: "I'm blocked by...", tipo: "licao", xp: 30 },
          { id: "a1-u4-n4", numero: 4, titulo: "Checkpoint 4", tipo: "checkpoint", xp: 100 },
        ],
      },
    ],
  },
  {
    nivel: "A2",
    titulo: "Comunicação no Dia a Dia",
    descricao: "Escrever reports, participar de reuniões e interagir com o time",
    cor: "#3b82f6",
    unidades: [
      {
        numero: 1, titulo: "Sprint Vocabulary", emoji: "🏃",
        nodes: [
          { id: "a2-u1-n1", numero: 1, titulo: "Backlog & user stories", tipo: "licao", xp: 30 },
          { id: "a2-u1-n2", numero: 2, titulo: "Sprint planning words", tipo: "licao", xp: 30 },
          { id: "a2-u1-n3", numero: 3, titulo: "Definition of Done", tipo: "licao", xp: 30 },
          { id: "a2-u1-n4", numero: 4, titulo: "Velocity & capacity", tipo: "licao", xp: 30 },
          { id: "a2-u1-n5", numero: 5, titulo: "Checkpoint 1", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 2, titulo: "Writing Defect Reports", emoji: "📝",
        nodes: [
          { id: "a2-u2-n1", numero: 1, titulo: "Defect title patterns", tipo: "licao", xp: 30 },
          { id: "a2-u2-n2", numero: 2, titulo: "Reproduction steps", tipo: "licao", xp: 30 },
          { id: "a2-u2-n3", numero: 3, titulo: "Environment info", tipo: "licao", xp: 30 },
          { id: "a2-u2-n4", numero: 4, titulo: "Priority & severity", tipo: "licao", xp: 30 },
          { id: "a2-u2-n5", numero: 5, titulo: "Checkpoint 2", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 3, titulo: "Meeting Expressions", emoji: "💬",
        nodes: [
          { id: "a2-u3-n1", numero: 1, titulo: "Asking for clarification", tipo: "licao", xp: 30 },
          { id: "a2-u3-n2", numero: 2, titulo: "Giving status updates", tipo: "licao", xp: 30 },
          { id: "a2-u3-n3", numero: 3, titulo: "Agreeing & disagreeing", tipo: "licao", xp: 30 },
          { id: "a2-u3-n4", numero: 4, titulo: "Checkpoint 3", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 4, titulo: "Email & Slack", emoji: "📧",
        nodes: [
          { id: "a2-u4-n1", numero: 1, titulo: "Bug report via email", tipo: "licao", xp: 30 },
          { id: "a2-u4-n2", numero: 2, titulo: "Slack etiquette in QA", tipo: "licao", xp: 30 },
          { id: "a2-u4-n3", numero: 3, titulo: "Following up politely", tipo: "licao", xp: 30 },
          { id: "a2-u4-n4", numero: 4, titulo: "Checkpoint 4", tipo: "checkpoint", xp: 100 },
        ],
      },
    ],
  },
  {
    nivel: "B1",
    titulo: "Autonomia Técnica",
    descricao: "Comunicação avançada com stakeholders e em entrevistas",
    cor: "#8b5cf6",
    unidades: [
      {
        numero: 1, titulo: "Technical Interviews", emoji: "🎯",
        nodes: [
          { id: "b1-u1-n1", numero: 1, titulo: "Tell me about yourself", tipo: "licao", xp: 30 },
          { id: "b1-u1-n2", numero: 2, titulo: "Describing your QA process", tipo: "licao", xp: 30 },
          { id: "b1-u1-n3", numero: 3, titulo: "Talking about tools", tipo: "licao", xp: 30 },
          { id: "b1-u1-n4", numero: 4, titulo: "Behavioral questions", tipo: "licao", xp: 30 },
          { id: "b1-u1-n5", numero: 5, titulo: "Checkpoint 1", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 2, titulo: "Code Review & Docs", emoji: "🔍",
        nodes: [
          { id: "b1-u2-n1", numero: 1, titulo: "Reading pull requests", tipo: "licao", xp: 30 },
          { id: "b1-u2-n2", numero: 2, titulo: "Writing review comments", tipo: "licao", xp: 30 },
          { id: "b1-u2-n3", numero: 3, titulo: "API documentation", tipo: "licao", xp: 30 },
          { id: "b1-u2-n4", numero: 4, titulo: "Test strategy docs", tipo: "licao", xp: 30 },
          { id: "b1-u2-n5", numero: 5, titulo: "Checkpoint 2", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 3, titulo: "Incident Reports", emoji: "🚨",
        nodes: [
          { id: "b1-u3-n1", numero: 1, titulo: "Describing production bugs", tipo: "licao", xp: 30 },
          { id: "b1-u3-n2", numero: 2, titulo: "Root cause analysis", tipo: "licao", xp: 30 },
          { id: "b1-u3-n3", numero: 3, titulo: "Postmortem writing", tipo: "licao", xp: 30 },
          { id: "b1-u3-n4", numero: 4, titulo: "Checkpoint 3", tipo: "checkpoint", xp: 100 },
        ],
      },
    ],
  },
  {
    nivel: "B2",
    titulo: "Liderança e Influência",
    descricao: "Liderar, apresentar e negociar em inglês",
    cor: "#f97316",
    unidades: [
      {
        numero: 1, titulo: "Leading QA Meetings", emoji: "🏆",
        nodes: [
          { id: "b2-u1-n1", numero: 1, titulo: "Opening & closing meetings", tipo: "licao", xp: 30 },
          { id: "b2-u1-n2", numero: 2, titulo: "Facilitating discussion", tipo: "licao", xp: 30 },
          { id: "b2-u1-n3", numero: 3, titulo: "Action items & follow-ups", tipo: "licao", xp: 30 },
          { id: "b2-u1-n4", numero: 4, titulo: "Checkpoint 1", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 2, titulo: "Advanced Interviews", emoji: "💼",
        nodes: [
          { id: "b2-u2-n1", numero: 1, titulo: "System design in QA", tipo: "licao", xp: 30 },
          { id: "b2-u2-n2", numero: 2, titulo: "Negotiating salary/role", tipo: "licao", xp: 30 },
          { id: "b2-u2-n3", numero: 3, titulo: "Leadership questions", tipo: "licao", xp: 30 },
          { id: "b2-u2-n4", numero: 4, titulo: "Checkpoint Final", tipo: "checkpoint", xp: 200 },
        ],
      },
    ],
  },
];

export function getNivel(nivel: NivelCEFR): NivelMeta | undefined {
  return curriculumIngles.find(n => n.nivel === nivel);
}

export function getNode(nodeId: string): { node: NodeMeta; unidade: UnidadeMeta; nivel: NivelMeta } | undefined {
  for (const nivel of curriculumIngles) {
    for (const unidade of nivel.unidades) {
      const node = unidade.nodes.find(n => n.id === nodeId);
      if (node) return { node, unidade, nivel };
    }
  }
  return undefined;
}

export function getProximoNode(nodeId: string): NodeMeta | undefined {
  for (const nivel of curriculumIngles) {
    for (const unidade of nivel.unidades) {
      const idx = unidade.nodes.findIndex(n => n.id === nodeId);
      if (idx !== -1) {
        if (idx < unidade.nodes.length - 1) return unidade.nodes[idx + 1];
        const idxUnidade = nivel.unidades.findIndex(u => u.nodes.some(n => n.id === nodeId));
        if (idxUnidade < nivel.unidades.length - 1) return nivel.unidades[idxUnidade + 1].nodes[0];
      }
    }
  }
  return undefined;
}
