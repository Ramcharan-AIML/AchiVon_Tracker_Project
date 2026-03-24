import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateStreak(logs: { date: string; status: string }[]): number {
  if (!logs.length) return 0;

  const sorted = [...logs]
    .filter((l) => l.status === "done")
    .map((l) => new Date(l.date).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const unique = [...new Set(sorted)];
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < unique.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    if (unique.includes(checkDate.toDateString())) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getHeatmapIntensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 3) return 3;
  if (count <= 4) return 4;
  return 5;
}

export function calculateSuccessRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDaysInRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function getWeekDates(weekOffset: number = 0): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export const CATEGORIES = [
  "Health",
  "Career",
  "Learning",
  "Mindfulness",
  "Finance",
  "Self-Care",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Health: "bg-red-700 text-white",
  Career: "bg-amber-800 text-white",
  Learning: "bg-emerald-700 text-white",
  Mindfulness: "bg-violet-700 text-white",
  Finance: "bg-blue-700 text-white",
  "Self-Care": "bg-pink-700 text-white",
  Growth: "bg-emerald-700 text-white",
};
