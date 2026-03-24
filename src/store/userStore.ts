"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, mockUser } from "@/lib/seedData";

interface UserState {
  user: User;
  xp: number;
  level: number;
  dailyScore: number;
  initialized: boolean;
  initialize: () => void;
  updateUser: (data: Partial<User>) => void;
  addXp: (amount: number) => void;
  removeXp: (amount: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: mockUser,
      xp: 240,
      level: 3,
      dailyScore: 0,
      initialized: false,

      initialize: () => {
        if (!get().initialized) {
          set({ user: mockUser, xp: 240, level: 3, dailyScore: 0, initialized: true });
        }
      },

      updateUser: (data) => {
        set((state) => ({ user: { ...state.user, ...data } }));
      },

      addXp: (amount) => {
        set((state) => {
          const newXp = state.xp + amount;
          const newLevel = Math.floor(newXp / 100) + 1;
          return { xp: newXp, level: newLevel, dailyScore: state.dailyScore + amount };
        });
      },

      removeXp: (amount) => {
        set((state) => {
          const newXp = Math.max(0, state.xp - amount);
          const newLevel = Math.max(1, Math.floor(newXp / 100) + 1);
          return { xp: newXp, level: newLevel, dailyScore: Math.max(0, state.dailyScore - amount) };
        });
      },
    }),
    {
      name: "achivon-user",
    }
  )
);
