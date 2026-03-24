"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Goal, Milestone, mockGoals, mockMilestones } from "@/lib/seedData";

interface GoalState {
  goals: Goal[];
  milestones: Milestone[];
  initialized: boolean;
  initialize: () => void;
  addGoal: (goal: Goal) => void;
  toggleMilestone: (milestoneId: string) => void;
  getGoalProgress: (goalId: string) => number;
  getMilestonesForGoal: (goalId: string) => Milestone[];
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      milestones: [],
      initialized: false,

      initialize: () => {
        if (!get().initialized) {
          set({
            goals: mockGoals,
            milestones: mockMilestones,
            initialized: true,
          });
        }
      },

      addGoal: (goal) => {
        set((state) => ({ goals: [...state.goals, goal] }));
      },

      toggleMilestone: (milestoneId) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        }));
      },

      getGoalProgress: (goalId) => {
        const milestones = get().milestones.filter(
          (m) => m.goalId === goalId
        );
        if (milestones.length === 0) return 0;
        const completed = milestones.filter((m) => m.completed).length;
        return Math.round((completed / milestones.length) * 100);
      },

      getMilestonesForGoal: (goalId) => {
        return get().milestones.filter((m) => m.goalId === goalId);
      },
    }),
    {
      name: "achivon-goals",
    }
  )
);
