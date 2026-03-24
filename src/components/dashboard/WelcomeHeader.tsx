"use client";

import { Flame, Lightbulb, Trophy } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useHabitStore } from "@/store/habitStore";
import { useEffect, useState } from "react";

export default function WelcomeHeader() {
  const { user, level, xp } = useUserStore();
  const getTodayStats = useHabitStore((s) => s.getTodayStats);
  const [stats, setStats] = useState({ completed: 0, total: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getTodayStats());
  }, [getTodayStats]);

  const remaining = stats.total - stats.completed;

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-achivon-text">
        Welcome, {mounted ? user.name.split(" ")[0] : "Julian"}!
      </h1>
      <div className="flex items-center gap-2 mt-2">
        <p className="text-achivon-text-light flex items-center gap-1.5">
          Level
          <span className="font-semibold text-achivon-primary">{mounted ? level : 1}</span>
          <Trophy className="w-4 h-4 text-achivon-primary inline -ml-0.5" />
          <span className="text-sm">({mounted ? xp : 0} XP)</span>
        </p>
        <span className="text-achivon-text-muted">•</span>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 animate-pulse">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-amber-700">
            {mounted && remaining === 0
              ? "All tasks complete for today! Exceptional work."
              : `You are ${mounted ? remaining : 0} tasks away from hitting your daily goal!`}
          </span>
        </div>
      </div>
    </div>
  );
}
