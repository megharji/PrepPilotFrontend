import type { InterviewRecord } from "../types/interview.types";

export interface InterviewStats {
  total: number;
  avgScore: number | null;
  strongestSkill: string | null;
}

// Dashboard ke "Your Progress" cards ke numbers
export const getInterviewStats = (interviews: InterviewRecord[]): InterviewStats => {
  if (!interviews.length) return { total: 0, avgScore: null, strongestSkill: null };

  const avgScore =
    Math.round((interviews.reduce((sum, i) => sum + i.report.overall, 0) / interviews.length) * 10) / 10;

  // Har skill ka saare interviews me average, sabse zyada wala strongest
  const totals = new Map<string, { sum: number; count: number }>();
  interviews.forEach((i) =>
    i.report.skills.forEach((s) => {
      const t = totals.get(s.label) ?? { sum: 0, count: 0 };
      totals.set(s.label, { sum: t.sum + s.score, count: t.count + 1 });
    })
  );

  let strongestSkill: string | null = null;
  let best = -1;
  totals.forEach(({ sum, count }, label) => {
    const avg = sum / count;
    if (avg > best) {
      best = avg;
      strongestSkill = label;
    }
  });

  return { total: interviews.length, avgScore, strongestSkill };
};

export const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m} min ${s}s` : `${s}s`;
};

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const newInterviewId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
