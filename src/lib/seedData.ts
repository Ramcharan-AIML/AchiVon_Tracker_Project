import { formatDate } from "./utils";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: "daily" | "weekly" | "custom";
  targetCount: number;
  userId: string;
  icon: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  status: "done" | "missed" | "partial";
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: string;
  userId: string;
  icon: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
}

export const mockUser: User = {
  id: "user-1",
  name: "Julian Vane",
  email: "julian@achivon.com",
  avatar: "/avatar.png",
  tier: "Heritage Curator",
};

export const mockHabits: Habit[] = [
  { id: "h1", name: "Morning HIIT", category: "Health & Fitness", frequency: "daily", targetCount: 1, userId: "user-1", icon: "Dumbbell" },
  { id: "h2", name: "Read 30 Pages", category: "Learning", frequency: "daily", targetCount: 1, userId: "user-1", icon: "BookOpen" },
  { id: "h3", name: "Side Project Dev", category: "Career Growth", frequency: "daily", targetCount: 1, userId: "user-1", icon: "Code" },
  { id: "h4", name: "Deep Meditation", category: "Mindfulness", frequency: "daily", targetCount: 1, userId: "user-1", icon: "Heart" },
  { id: "h5", name: "Hydration (3L)", category: "Health & Fitness", frequency: "daily", targetCount: 3, userId: "user-1", icon: "Droplets" },
  { id: "h6", name: "Code Practice", category: "Career Growth", frequency: "daily", targetCount: 1, userId: "user-1", icon: "Terminal" },
  { id: "h7", name: "Language Practice: Spanish", category: "Learning", frequency: "custom", targetCount: 1, userId: "user-1", icon: "Globe" },
  { id: "h8", name: "Morning Skin Routine", category: "Self-Care", frequency: "daily", targetCount: 1, userId: "user-1", icon: "Sparkles" },
];

function generateHabitLogs(): HabitLog[] {
  const logs: HabitLog[] = [];
  const today = new Date();
  let logId = 1;

  for (const habit of mockHabits) {
    for (let daysAgo = 0; daysAgo < 90; daysAgo++) {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      const dateStr = formatDate(date);

      const rand = Math.random();
      let status: "done" | "missed" | "partial";

      if (daysAgo < 32) {
        status = rand < 0.75 ? "done" : rand < 0.88 ? "partial" : "missed";
      } else {
        status = rand < 0.6 ? "done" : rand < 0.8 ? "partial" : "missed";
      }

      if (habit.frequency === "custom" && date.getDay() % 2 === 0) {
        continue;
      }

      logs.push({
        id: `log-${logId++}`,
        habitId: habit.id,
        date: dateStr,
        status,
      });
    }
  }
  return logs;
}

export const mockHabitLogs: HabitLog[] = generateHabitLogs();

export const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "Become a Senior Developer",
    description: "Mastering system design and leading technical architecture for enterprise applications.",
    deadline: "2026-09-01",
    category: "Career Growth",
    userId: "user-1",
    icon: "💼",
  },
  {
    id: "g2",
    title: "Run a Marathon",
    description: "Completing the Berlin Marathon under 4 hours.",
    deadline: "2026-11-15",
    category: "Health & Vitality",
    userId: "user-1",
    icon: "🏃",
  },
  {
    id: "g3",
    title: "Financial Independence",
    description: "Targeting $500k in diversified assets within 3 years.",
    deadline: "2028-12-31",
    category: "Wealth",
    userId: "user-1",
    icon: "💰",
  },
  {
    id: "g4",
    title: "Define a New Chapter",
    description: "What is the next mountain you want to climb?",
    deadline: "2027-01-01",
    category: "Personal",
    userId: "user-1",
    icon: "🌟",
  },
];

export const mockMilestones: Milestone[] = [
  // Become a Senior Developer
  { id: "m1", goalId: "g1", title: "Complete React Advanced Course", completed: true },
  { id: "m2", goalId: "g1", title: "Master System Design Patterns", completed: true },
  { id: "m3", goalId: "g1", title: "Build 5 portfolio projects", completed: false },
  { id: "m4", goalId: "g1", title: "Lead a Cross-functional Project", completed: false },
  // Run a Marathon
  { id: "m5", goalId: "g2", title: "5K Baseline Run", completed: true },
  { id: "m6", goalId: "g2", title: "10K Official Race", completed: true },
  { id: "m7", goalId: "g2", title: "Half Marathon Prep", completed: false },
  { id: "m8", goalId: "g2", title: "30K Long Run", completed: false },
  { id: "m9", goalId: "g2", title: "Buy New Training Shoes", completed: false, dueDate: "2026-10-24", priority: "low" },
  // Financial Independence
  { id: "m10", goalId: "g3", title: "Rebalance ETF Portfolio", completed: false },
  { id: "m11", goalId: "g3", title: "Max out retirement contributions", completed: true },
  { id: "m12", goalId: "g3", title: "Investment Strategy Execution", completed: false },
  // System Design prep
  { id: "m13", goalId: "g1", title: "System Design Interview Prep", completed: false, dueDate: "2026-10-24", priority: "high" },
];

export function generateHeatmapData(): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const today = new Date();

  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();

    let count: number;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      count = Math.floor(Math.random() * 3);
    } else {
      count = Math.floor(Math.random() * 6);
    }
    data.push({ date: formatDate(date), count });
  }
  return data;
}

export const heatmapData = generateHeatmapData();
