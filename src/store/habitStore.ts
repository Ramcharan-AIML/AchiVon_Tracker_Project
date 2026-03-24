"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Habit,
  HabitLog,
  mockHabits,
  mockHabitLogs,
} from "@/lib/seedData";
import { formatDate } from "@/lib/utils";
import { useUserStore } from "./userStore";

interface HabitState {
  habits: Habit[];
  logs: HabitLog[];
  initialized: boolean;
  initialize: () => void;
  addHabit: (habit: Habit) => void;
  renameHabit: (habitId: string, newName: string) => void;
  deleteHabit: (habitId: string) => void;
  toggleLog: (habitId: string, date: string) => void;
  getLogsForHabit: (habitId: string) => HabitLog[];
  getLogsForDate: (date: string) => HabitLog[];
  getStreak: (habitId: string) => number;
  getTodayStats: () => { completed: number; total: number };
  getYesterdayStats: () => { completed: number; total: number };
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],
      initialized: false,

      initialize: () => {
        if (!get().initialized) {
          set({ habits: mockHabits, logs: mockHabitLogs, initialized: true });
        }
      },

      addHabit: (habit) => {
        set((state) => ({ habits: [...state.habits, habit] }));
      },

      renameHabit: (habitId, newName) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, name: newName } : h
          ),
        }));
      },

      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== habitId),
          logs: state.logs.filter((l) => l.habitId !== habitId),
        }));
      },

      toggleLog: (habitId: string, date: string) => {
        const { logs } = get();
        const existing = logs.find(
          (l) => l.habitId === habitId && l.date === date
        );

        if (existing) {
          if (existing.status === "done") {
            set({
              logs: logs.map((l) =>
                l.id === existing.id ? { ...l, status: "missed" as const } : l
              ),
            });
            useUserStore.getState().removeXp(20);
          } else {
            set({
              logs: logs.map((l) =>
                l.id === existing.id ? { ...l, status: "done" as const } : l
              ),
            });
            useUserStore.getState().addXp(20);
          }
        } else {
          set({
            logs: [
              ...logs,
              {
                id: `log-${Date.now()}`,
                habitId,
                date,
                status: "done" as const,
              },
            ],
          });
          useUserStore.getState().addXp(20);
        }
      },

      getLogsForHabit: (habitId) => {
        return get().logs.filter((l) => l.habitId === habitId);
      },

      getLogsForDate: (date) => {
        return get().logs.filter((l) => l.date === date);
      },

      getStreak: (habitId) => {
        const logs = get()
          .logs.filter((l) => l.habitId === habitId && l.status === "done")
          .map((l) => l.date)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        const unique = [...new Set(logs)];
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < unique.length; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          if (unique.includes(formatDate(checkDate))) {
            streak++;
          } else {
            break;
          }
        }
        return streak;
      },

      getTodayStats: () => {
        const { habits, logs } = get();
        const today = formatDate(new Date());
        const todayLogs = logs.filter((l) => l.date === today);
        const completed = todayLogs.filter((l) => l.status === "done").length;
        return { completed, total: habits.length };
      },

      getYesterdayStats: () => {
        const { habits, logs } = get();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = formatDate(yesterday);
        const yesterdayLogs = logs.filter((l) => l.date === yesterdayDate);
        const completed = yesterdayLogs.filter((l) => l.status === "done").length;
        return { completed, total: habits.length };
      },
    }),
    {
      name: "achivon-habits",
    }
  )
);
