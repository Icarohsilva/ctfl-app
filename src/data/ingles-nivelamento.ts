// src/data/ingles-nivelamento.ts
import type { NivelCEFR } from "./ingles-curriculum";

export type QuestaoNivelamento = {
  id: string;
  nivel: NivelCEFR;
  pergunta: string;
  opcoes: string[];
  correta: number; // índice 0-based
};

export const bancoNivelamento: QuestaoNivelamento[] = [
  // ── A1 ──────────────────────────────────────────────────────────────────
  {
    id: "niv-a1-01", nivel: "A1",
    pergunta: "How do you say 'eu encontrei um bug' in English?",
    opcoes: ["I found a bug", "I find a bug", "I founded a bug", "I finding a bug"],
    correta: 0,
  },
  {
    id: "niv-a1-02", nivel: "A1",
    pergunta: "Which word means 'defeito' in software testing?",
    opcoes: ["feature", "defect", "deploy", "sprint"],
    correta: 1,
  },
  {
    id: "niv-a1-03", nivel: "A1",
    pergunta: "Complete: 'The test _______ failed.'",
    opcoes: ["case", "cases", "casing", "cased"],
    correta: 0,
  },
  {
    id: "niv-a1-04", nivel: "A1",
    pergunta: "What does 'QA' stand for?",
    opcoes: ["Quick Analysis", "Quality Assurance", "Query Agent", "Queue Action"],
    correta: 1,
  },
  {
    id: "niv-a1-05", nivel: "A1",
    pergunta: "How do you say 'resultado esperado' in English?",
    opcoes: ["actual result", "expected result", "test result", "final result"],
    correta: 1,
  },
  {
    id: "niv-a1-06", nivel: "A1",
    pergunta: "Which sentence is correct?",
    opcoes: [
      "I is a tester.",
      "I am a tester.",
      "I are a tester.",
      "I be a tester.",
    ],
    correta: 1,
  },
  {
    id: "niv-a1-07", nivel: "A1",
    pergunta: "What does 'bug severity' mean in testing?",
    opcoes: [
      "How many bugs exist",
      "How serious a bug is",
      "Who created the bug",
      "When the bug was found",
    ],
    correta: 1,
  },
  {
    id: "niv-a1-08", nivel: "A1",
    pergunta: "How do you say 'passos para reproduzir' in English?",
    opcoes: ["steps to test", "steps to reproduce", "steps to deploy", "steps to close"],
    correta: 1,
  },
  {
    id: "niv-a1-09", nivel: "A1",
    pergunta: "Which word means 'bloqueado' in a stand-up context?",
    opcoes: ["done", "blocked", "deployed", "merged"],
    correta: 1,
  },
  {
    id: "niv-a1-10", nivel: "A1",
    pergunta: "Complete: 'Yesterday I _______ the login feature.'",
    opcoes: ["test", "tests", "tested", "testing"],
    correta: 2,
  },

  // ── A2 ──────────────────────────────────────────────────────────────────
  {
    id: "niv-a2-01", nivel: "A2",
    pergunta: "Which sentence correctly describes a bug priority?",
    opcoes: [
      "This bug has high priority because it blocks the checkout flow.",
      "This bug have high priority because it blocks the checkout flow.",
      "This bug is high priority because it block the checkout flow.",
      "This bug had high priority because it is blocking the checkout flow.",
    ],
    correta: 0,
  },
  {
    id: "niv-a2-02", nivel: "A2",
    pergunta: "What does 'regression testing' mean?",
    opcoes: [
      "Testing new features only",
      "Testing to ensure existing features still work after changes",
      "Testing on mobile devices",
      "Testing the database schema",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-03", nivel: "A2",
    pergunta: "How do you politely ask for clarification in a meeting?",
    opcoes: [
      "What? I don't understand.",
      "Could you clarify what you mean by that?",
      "You explained it wrong.",
      "Say it again please.",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-04", nivel: "A2",
    pergunta: "Which phrase correctly gives a status update?",
    opcoes: [
      "I will test yesterday the payment module.",
      "I am currently testing the payment module and expect to finish by EOD.",
      "The payment module test is doing.",
      "Testing payment module, I am.",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-05", nivel: "A2",
    pergunta: "What does 'acceptance criteria' mean?",
    opcoes: [
      "The list of bugs found",
      "The conditions a feature must meet to be accepted",
      "The number of test cases",
      "The deadline for testing",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-06", nivel: "A2",
    pergunta: "Complete: 'The feature _______ not deployed yet because tests are failing.'",
    opcoes: ["is", "are", "has", "have"],
    correta: 0,
  },
  {
    id: "niv-a2-07", nivel: "A2",
    pergunta: "How do you write a professional Slack message about a critical bug?",
    opcoes: [
      "URGENT BUG FOUND!!!",
      "@team Critical bug found in checkout: users cannot complete payment. Investigating now.",
      "there is a bug in checkout",
      "Hey found bug checkout broken fix asap",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-08", nivel: "A2",
    pergunta: "What is a 'user story' in Agile?",
    opcoes: [
      "A document with all test cases",
      "A short description of a feature from the user's perspective",
      "A bug report written by the user",
      "A log of user actions in the system",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-09", nivel: "A2",
    pergunta: "Which phrase means 'reproduzir o problema'?",
    opcoes: ["fix the issue", "reproduce the issue", "close the issue", "assign the issue"],
    correta: 1,
  },
  {
    id: "niv-a2-10", nivel: "A2",
    pergunta: "Complete the defect title: 'Login button _______ unresponsive on iOS 17'",
    opcoes: ["is", "are", "be", "been"],
    correta: 0,
  },

  // ── B1 ──────────────────────────────────────────────────────────────────
  {
    id: "niv-b1-01", nivel: "B1",
    pergunta: "In a technical interview, how do you describe your test automation experience?",
    opcoes: [
      "I do automation sometimes with some tools.",
      "I have 2 years of experience building automated regression suites using Playwright and integrating them into CI/CD pipelines.",
      "Automation is good and I know it.",
      "I worked with automation in my previous job with tools.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-02", nivel: "B1",
    pergunta: "What does 'shift-left testing' mean?",
    opcoes: [
      "Moving QA engineers to sit on the left side of the office",
      "Starting testing activities earlier in the development lifecycle",
      "Testing only the left side of the UI",
      "Shifting the test environment to a different server",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-03", nivel: "B1",
    pergunta: "How do you write a code review comment that points out a missing test?",
    opcoes: [
      "You forgot the test!",
      "Could you add a unit test for this edge case? Specifically when the input is null.",
      "Test is missing here.",
      "No test = no merge.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-04", nivel: "B1",
    pergunta: "Which sentence correctly uses the passive voice in a postmortem?",
    opcoes: [
      "We deployed the fix at 3pm.",
      "The fix was deployed at 3pm after root cause was identified.",
      "The fix deployed at 3pm.",
      "At 3pm the fix is deploying.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-05", nivel: "B1",
    pergunta: "What does 'flaky test' mean?",
    opcoes: [
      "A test that runs slowly",
      "A test that produces inconsistent results without code changes",
      "A test written in a fragile programming language",
      "A test that only works on certain operating systems",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-06", nivel: "B1",
    pergunta: "How do you communicate a risk to a stakeholder professionally?",
    opcoes: [
      "If we don't fix this, everything will break.",
      "I'd like to flag a risk: if we skip smoke testing before this release, we increase the chance of a critical defect reaching production.",
      "We have a risk here and it's bad.",
      "The stakeholders need to know about risks so I'm telling you.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-07", nivel: "B1",
    pergunta: "What is 'exploratory testing'?",
    opcoes: [
      "Testing with a fixed script of steps",
      "Simultaneous learning, test design, and execution without a predefined script",
      "Testing by exploring the file system",
      "Automated testing that explores all code paths",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-08", nivel: "B1",
    pergunta: "Which phrase correctly summarizes an incident?",
    opcoes: [
      "Something broke and we fixed it.",
      "At 14:32 UTC, the payment service became unavailable due to a misconfigured environment variable, affecting 12% of users for 47 minutes.",
      "The payment broke for some users for some time.",
      "We had an incident with payments yesterday afternoon.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-09", nivel: "B1",
    pergunta: "How do you politely disagree with a developer's estimate in a meeting?",
    opcoes: [
      "That's wrong, it will take longer.",
      "I appreciate the estimate. Based on the complexity I've seen in similar features, I'd suggest we add a buffer of 2 days. Would that work?",
      "No, that's too fast.",
      "Your estimate is not realistic.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-10", nivel: "B1",
    pergunta: "Complete: 'The test suite _______ been refactored to improve maintainability.'",
    opcoes: ["has", "have", "had", "is"],
    correta: 0,
  },

  // ── B2 ──────────────────────────────────────────────────────────────────
  {
    id: "niv-b2-01", nivel: "B2",
    pergunta: "How do you open a retrospective meeting as a QA lead?",
    opcoes: [
      "Let's talk about what went wrong.",
      "Thank you all for joining. Today we'll reflect on our last sprint — what went well, what could be improved, and what actions we'll commit to. Let's keep it constructive.",
      "We need to discuss problems from last sprint.",
      "Hello team, retrospective time, let's go.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-02", nivel: "B2",
    pergunta: "Which sentence demonstrates advanced hedging language in a risk assessment?",
    opcoes: [
      "We might have problems.",
      "There is a possibility that, without additional test coverage on the payment module, we could see an increase in production defects following the release.",
      "Maybe we will have bugs.",
      "The risks are there and we should address them.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-03", nivel: "B2",
    pergunta: "What is the difference between 'verification' and 'validation' in testing?",
    opcoes: [
      "They mean the same thing.",
      "Verification checks if we are building the product right; validation checks if we are building the right product.",
      "Verification is automated; validation is manual.",
      "Verification is done by QA; validation is done by stakeholders.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-04", nivel: "B2",
    pergunta: "How do you mentor a junior QA engineer who keeps writing brittle tests?",
    opcoes: [
      "Tell them to rewrite all the tests.",
      "I'd sit with them and walk through why locators tied to dynamic attributes break easily, then pair on refactoring one test using more stable selectors as a reference.",
      "Send them a document about best practices.",
      "Their tests are brittle and they need to fix them.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-05", nivel: "B2",
    pergunta: "Which phrase correctly presents a test strategy proposal?",
    opcoes: [
      "We should test more things.",
      "I'd like to propose a risk-based testing approach for this release: we prioritise the payment and authentication flows given their business impact, while applying lighter coverage to lower-risk areas.",
      "My proposal is that we do risk-based testing.",
      "For this release I think risk-based testing would be good to do.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-06", nivel: "B2",
    pergunta: "Complete: 'Had the team _______ a more thorough regression suite, the production incident could have been prevented.'",
    opcoes: ["maintained", "maintain", "maintaining", "to maintain"],
    correta: 0,
  },
  {
    id: "niv-b2-07", nivel: "B2",
    pergunta: "How do you handle a stakeholder who insists on skipping testing to meet a deadline?",
    opcoes: [
      "OK, we'll skip testing.",
      "I understand the deadline pressure. Let me show you the risk matrix — skipping regression on checkout has historically led to P1 incidents. Can we agree on a focused smoke test as a minimum?",
      "We cannot skip testing, that's my final answer.",
      "Testing cannot be skipped because it's important for quality.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-08", nivel: "B2",
    pergunta: "What does 'test coverage' mean in a nuanced sense?",
    opcoes: [
      "The percentage of lines of code executed by tests",
      "A multi-dimensional measure including code coverage, requirement coverage, and risk coverage — no single metric tells the full story",
      "How many test cases you have written",
      "Whether all features have been tested at least once",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-09", nivel: "B2",
    pergunta: "Which sentence uses a conditional correctly in a QA context?",
    opcoes: [
      "If we would have caught this earlier, the cost would be lower.",
      "Had this defect been caught during code review, the cost of fixing it would have been significantly lower.",
      "If we caught this earlier, the cost would be lower.",
      "If we catch this earlier, the cost would have been lower.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-10", nivel: "B2",
    pergunta: "How do you write an executive summary of test results?",
    opcoes: [
      "We ran tests and found bugs.",
      "Testing of the 3.2 release is complete. 94% of test cases passed. 2 critical defects were found and resolved. 1 medium-severity defect is deferred to 3.3 with stakeholder approval. Release is recommended to proceed.",
      "All tests done, mostly good, some bugs found, release ok.",
      "The test results show that we tested 94% and found some defects.",
    ],
    correta: 1,
  },
];

// Retorna questões aleatórias para um nível, sem repetir IDs já usados
export function getQuestaoParaNivel(
  nivel: NivelCEFR,
  usados: string[]
): QuestaoNivelamento | undefined {
  const disponiveis = bancoNivelamento.filter(
    q => q.nivel === nivel && !usados.includes(q.id)
  );
  if (disponiveis.length === 0) return undefined;
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}
