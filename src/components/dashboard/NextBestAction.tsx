"use client";

import { useHabitStore } from "@/store/habitStore";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Zap, ArrowRight, Play } from "lucide-react";

export default function NextBestAction() {
  const { habits, logs } = useHabitStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const today = formatDate(new Date());
  
  // Find the first task that is NOT done today
  const nextTask = habits.find((h) => {
    const log = logs.find((l) => l.habitId === h.id && l.date === today);
    return log?.status !== "done";
  });

  if (!nextTask) {
    return null; // All done!
  }

  return (
    <div className="bg-gradient-to-r from-achivon-primary to-achivon-primary-light rounded-3xl p-6 shadow-lg text-white fade-in relative overflow-hidden group cursor-pointer mt-6">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
              Recommended Next Action
            </p>
            <h3 className="text-xl font-bold">{nextTask.name}</h3>
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-white text-achivon-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform">
          <Play className="w-4 h-4 fill-current" />
          Start Now
        </button>
      </div>

      {/* Decorative gradient orb */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
    </div>
  );
}
