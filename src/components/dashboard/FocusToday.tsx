"use client";

import { useHabitStore } from "@/store/habitStore";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface TaskItem {
  id: string;
  name: string;
  category: string;
  done: boolean;
}

const categoryStyle: Record<string, string> = {
  Health: "bg-red-50 text-red-700 border-red-200",
  Career: "bg-amber-50 text-amber-700 border-amber-200",
  Learning: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Mindfulness: "bg-violet-50 text-violet-700 border-violet-200",
  "Self-Care": "bg-pink-50 text-pink-700 border-pink-200",
  Growth: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function FocusToday() {
  const { habits, logs, toggleLog } = useHabitStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = formatDate(new Date());

  const tasks: TaskItem[] = habits.map((h) => {
    const log = logs.find((l) => l.habitId === h.id && l.date === today);
    return {
      id: h.id,
      name: h.name,
      category: h.category,
      done: log?.status === "done",
    };
  });

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-achivon-card-white rounded-3xl p-6 shadow-md border border-achivon-border/80 fade-in fade-in-delay-2 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-achivon-text">Focus for Today</h3>
        <span className="text-xs font-semibold text-achivon-text-muted bg-achivon-bg px-2 py-1 rounded-md">
          {mounted ? completedCount : 0} of {mounted ? totalCount : 0} done
        </span>
      </div>

      <div className="w-full h-1.5 bg-achivon-bg rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-achivon-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${mounted ? progressPercent : 0}%` }}
        />
      </div>

      <div className="space-y-3 flex-1 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 group cursor-pointer p-2.5 rounded-xl transition-all duration-300 ${
              task.done
                ? "bg-transparent opacity-60"
                : "bg-achivon-bg hover:bg-achivon-primary/5 hover:shadow-sm"
            }`}
            onClick={() => {
              if (mounted) toggleLog(task.id, today);
            }}
          >
            <div
              className={`relative w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                task.done
                  ? "bg-achivon-primary border-achivon-primary scale-95"
                  : "border-achivon-border group-hover:border-achivon-primary/50"
              }`}
            >
              {task.done && (
                <Check className="w-3.5 h-3.5 text-white animate-[pop_0.2s_ease-out]" />
              )}
            </div>
            <span
              className={`flex-1 text-sm font-medium transition-all duration-300 ${
                task.done
                  ? "line-through text-achivon-text-muted"
                  : "text-achivon-text"
              }`}
            >
              {task.name}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border transition-opacity shrink-0 ${
                task.done ? "opacity-50" : "opacity-100"
              } ${
                categoryStyle[task.category] ||
                "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {task.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
