"use client";

import { useEffect } from "react";
import { useHabitStore } from "@/store/habitStore";
import { useGoalStore } from "@/store/goalStore";
import { useUserStore } from "@/store/userStore";

export default function StoreInitializer() {
  const initHabits = useHabitStore((s) => s.initialize);
  const initGoals = useGoalStore((s) => s.initialize);
  const initUser = useUserStore((s) => s.initialize);

  useEffect(() => {
    initHabits();
    initGoals();
    initUser();
  }, [initHabits, initGoals, initUser]);

  return null;
}
