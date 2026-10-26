import type { DemoFollowUp, DemoQuestion, DemoTurn, KeyPoint } from "../data/demoInterview";

export interface AnsweredTurn {
  topic: string;
  isFollowUp: boolean;
  turn: DemoTurn;
  answer: string;
  skipped: boolean;
}

export interface TurnResult extends AnsweredTurn {
  covered: KeyPoint[];
  missed: KeyPoint[];
  score: number;
  // Ye sab sirf AI scoring me aate hain (keyword scoring me nahi):
  // 1-2 line ki salah, kya achha tha, kya sudhaarna hai, aur user ke jawab ka behtar version
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  betterAnswer?: string;
}

export interface DemoReport {
  overall: number;
  skills: { label: string; score: number }[];
  turns: TurnResult[];
  // AI scoring: poore interview ka nichod, strengths aur aage kis pe kaam karna hai
  summary?: string;
  strengths?: string[];
  focusAreas?: string[];
}

const normalize = (text: string) => ` ${text.toLowerCase().replace(/\s+/g, " ")} `;

const matches = (answer: string, keywords: string[]) => {
  const text = normalize(answer);
  return keywords.some((k) => text.includes(k.toLowerCase()));
};

// Jawab me jo keyword aaya uske hisaab se follow-up. Kuch match na ho to default (bina `when` wala).
export const pickFollowUp = (question: DemoQuestion, answer: string): DemoFollowUp | undefined =>
  question.followUps.find((f) => f.when && matches(answer, f.when)) ??
  question.followUps.find((f) => !f.when);

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const communicationScore = (answer: string) => {
  const words = wordCount(answer);
  if (words < 12) return 3;
  if (words < 35) return 6;
  if (words <= 220) return 9;
  return 7; // bahut lamba jawab bhi achha nahi
};

const EXAMPLE_PATTERN =
  /(for example|for instance|e\.g\.|such as|like when|in my project|i used|i built|i worked|once|\d)/i;

const round1 = (n: number) => Math.round(n * 10) / 10;
const avg = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);

export const buildReport = (answers: AnsweredTurn[]): DemoReport => {
  const turns: TurnResult[] = answers.map((a) => {
    const covered = a.skipped ? [] : a.turn.keyPoints.filter((kp) => matches(a.answer, kp.keywords));
    const missed = a.turn.keyPoints.filter((kp) => !covered.includes(kp));
    const score = a.skipped ? 0 : round1((covered.length / a.turn.keyPoints.length) * 10);
    return { ...a, covered, missed, score };
  });

  const answered = turns.filter((t) => !t.skipped);

  const technical = avg(turns.map((t) => t.score));
  const communication = avg(turns.map((t) => (t.skipped ? 0 : communicationScore(t.answer))));
  const examples = avg(turns.map((t) => (t.skipped ? 0 : EXAMPLE_PATTERN.test(t.answer) ? 9 : 4)));
  const completeness = turns.length ? (answered.length / turns.length) * 10 : 0;

  const skills = [
    { label: "Technical depth", score: round1(technical) },
    { label: "Communication", score: round1(communication) },
    { label: "Use of examples", score: round1(examples) },
    { label: "Completeness", score: round1(completeness) },
  ];

  const overall = round1(technical * 0.5 + communication * 0.2 + examples * 0.15 + completeness * 0.15);

  return { overall, skills, turns };
};
