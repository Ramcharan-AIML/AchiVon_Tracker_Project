"use client";

import { useHabitStore } from "@/store/habitStore";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export default function DailySummary() {
  const getTodayStats = useHabitStore((s) => s.getTodayStats);
  const [stats, setStats] = useState({ completed: 0, total: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getTodayStats());
  }, [getTodayStats]);

  if (!mounted) return null;

  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const missed = stats.total - stats.completed;

  return (
    <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-4 mt-6">
      <h3 className="text-base font-semibold text-achivon-text mb-4">
        Daily Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completed */}
        <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-4 border border-emerald-100">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700">{stats.completed}</p>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Tasks Done</p>
          </div>
        </div>

        {/* Missed */}
        <div className="bg-rose-50 rounded-xl p-4 flex items-center gap-4 border border-rose-100">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-700">{missed}</p>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Remaining</p>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-achivon-primary/10 rounded-xl p-4 flex items-center gap-4 border border-achivon-primary/20">
          <div className="w-10 h-10 rounded-full bg-achivon-primary/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-achivon-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-achivon-primary">{percent}%</p>
            <p className="text-xs font-semibold text-achivon-primary uppercase tracking-wider">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
