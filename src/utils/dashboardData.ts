import { INTERVIEW_TYPES } from "../data/interviewSetup";
import type { ServerInterview } from "../types/interview.types";

export interface DayCount {
  key: string;
  label: string; // "Mon"
  fullLabel: string; // "Mon, 12 Oct"
  count: number;
  isToday: boolean;
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// Aaj samet pichhle 7 din, har din kitne interview shuru hue (local time)
export const lastSevenDays = (interviews: ServerInterview[], now = new Date()): DayCount[] => {
  const counts = new Map<string, number>();
  interviews.forEach((i) => {
    const key = dayKey(new Date(i.createdAt));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - idx));
    const key = dayKey(d);
    return {
      key,
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      fullLabel: d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }),
      count: counts.get(key) ?? 0,
      isToday: idx === 6,
    };
  });
};

export interface TypeCount {
  id: string;
  label: string;
  count: number;
}

// Har interview type kitni baar (fixed order, zero wale bhi, taaki layout na hile)
export const countByType = (interviews: ServerInterview[]): TypeCount[] =>
  INTERVIEW_TYPES.map((t) => ({
    id: t.id,
    label: t.title,
    count: interviews.filter((i) => i.interviewType === t.id).length,
  }));

export const greetingFor = (date = new Date()) => {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};
