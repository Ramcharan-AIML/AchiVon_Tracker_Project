"use client";

import { Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useHabitStore } from "@/store/habitStore";
import { useEffect, useState, useMemo } from "react";
import { formatDate } from "@/lib/utils";

export default function DailyCompletion() {
  const habits = useHabitStore((s) => s.habits);
  const logs = useHabitStore((s) => s.logs);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = formatDate(new Date());

  const stats = useMemo(() => {
    const todayLogs = logs.filter((l) => l.date === today);
    const completed = todayLogs.filter((l) => l.status === "done").length;
    return { completed, total: habits.length };
  }, [habits, logs, today]);

  const yesterdayStats = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = formatDate(yesterday);
    const yesterdayLogs = logs.filter((l) => l.date === yesterdayDate);
    const completed = yesterdayLogs.filter((l) => l.status === "done").length;
    return { completed, total: habits.length };
  }, [habits, logs]);

  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const yesterdayPercent = yesterdayStats.total > 0 ? Math.round((yesterdayStats.completed / yesterdayStats.total) * 100) : 0;
  
  const delta = percent - yesterdayPercent;
  const isPositive = delta >= 0;
  const remaining = stats.total - stats.completed;

  return (
    <div className="bg-achivon-card-white rounded-3xl p-6 shadow-md border border-achivon-border fade-in fade-in-delay-1 relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-achivon-primary/5 rounded-full blur-3xl group-hover:bg-achivon-primary/10 transition-colors duration-500" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Stats */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-achivon-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-achivon-primary" />
            </div>
            <h3 className="text-sm font-bold text-achivon-text uppercase tracking-wider">
              Command Center
            </h3>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black text-achivon-text tracking-tight">{mounted ? percent : 0}%</span>
            <span className="text-sm font-medium text-achivon-text-muted">completed</span>
          </div>

          {mounted && (
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md ${
                  isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(delta)}%
              </span>
              <span className="text-xs font-medium text-achivon-text-light">vs yesterday</span>
            </div>
          )}

          <p className="text-sm font-medium text-achivon-text bg-achivon-bg inline-flex px-3 py-1.5 rounded-lg border border-achivon-border/50">
            {mounted && remaining === 0 ? "🎉 All tasks finished for today!" : `You're ${mounted ? remaining : 0} tasks away from completing today.`}
          </p>
        </div>

        {/* Right Side: Circular Ring */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#E8E4DE"
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#8B0000"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${mounted ? percent : 0} ${100 - (mounted ? percent : 0)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-achivon-text">{mounted ? stats.completed : 0}</span>
            <span className="text-[10px] font-semibold text-achivon-text-muted uppercase tracking-widest">
              / {mounted ? stats.total : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
