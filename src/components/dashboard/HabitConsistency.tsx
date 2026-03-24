"use client";

import { useHabitStore } from "@/store/habitStore";
import { getWeekDates, formatDate, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check, Pencil, Trash2, X, Check as CheckIcon } from "lucide-react";
import { useState, useEffect } from "react";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function HabitConsistency() {
  const { habits, logs, toggleLog, renameHabit, deleteHabit } = useHabitStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weekDates = getWeekDates(weekOffset);
  const today = formatDate(new Date());

  const handleStartEdit = (habit: { id: string; name: string }) => {
    setEditingId(habit.id);
    setEditName(habit.name);
  };

  const handleConfirmEdit = () => {
    if (editingId && editName.trim()) {
      renameHabit(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = (habitId: string) => {
    deleteHabit(habitId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-achivon-text">
            Habit Consistency
          </h3>
          <p className="text-xs text-achivon-text-muted mt-0.5">
            Week {Math.abs(weekOffset) + 1} tracking
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-1 rounded-lg hover:bg-achivon-bg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-achivon-text-light" />
          </button>
          <button
            onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
            className="p-1 rounded-lg hover:bg-achivon-bg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-achivon-text-light" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs text-achivon-text-muted font-medium pb-3 pr-4 w-[180px]">
                HABIT
              </th>
              {DAY_LABELS.map((day, i) => {
                const isToday = formatDate(weekDates[i]) === today;
                return (
                  <th
                    key={day}
                    className={cn(
                      "text-center text-xs font-medium pb-3 px-1 w-[52px]",
                      isToday
                        ? "text-achivon-primary font-bold"
                        : "text-achivon-text-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full px-2 py-1 inline-block",
                        isToday ? "bg-achivon-primary/10" : ""
                      )}
                    >
                      {day}
                    </div>
                  </th>
                );
              })}
              <th className="text-center text-xs text-achivon-text-muted font-medium pb-3 px-1 w-[44px]">
                {/* Delete column */}
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id} className="border-t border-achivon-border/50">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1.5">
                    {editingId === habit.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleConfirmEdit();
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          autoFocus
                          className="text-sm font-medium text-achivon-text bg-achivon-bg border border-achivon-border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-achivon-primary/20"
                        />
                        <button
                          onClick={handleConfirmEdit}
                          className="p-1 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors"
                          title="Save"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-achivon-text flex-1">
                          {habit.name}
                        </p>
                        <button
                          onClick={() => handleStartEdit(habit)}
                          className="p-1 rounded-md hover:bg-achivon-bg text-achivon-text-muted hover:text-achivon-primary transition-colors opacity-0 group-hover:opacity-100"
                          style={{ opacity: 1 }}
                          title="Edit habit name"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
                {weekDates.map((date) => {
                  const dateStr = formatDate(date);
                  const log = logs.find(
                    (l) => l.habitId === habit.id && l.date === dateStr
                  );
                  const isDone = log?.status === "done";
                  const isPartial = log?.status === "partial";
                  const isFuture = date > new Date();

                  const isToday = dateStr === today;
                  
                  return (
                    <td
                      key={dateStr}
                      className={cn(
                        "py-3 px-1 transition-colors duration-300",
                        isToday ? "bg-achivon-primary/[0.03]" : ""
                      )}
                    >
                      <button
                        title={
                          isFuture
                            ? "Future"
                            : isDone
                            ? "Completed"
                            : isPartial
                            ? "Partial"
                            : "Missed"
                        }
                        onClick={() => {
                          if (mounted && !isFuture) toggleLog(habit.id, dateStr);
                        }}
                        disabled={isFuture}
                        className={cn(
                          "habit-cell w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 transform",
                          isDone
                            ? "bg-achivon-primary text-white shadow-sm shadow-achivon-primary/20 scale-100"
                            : isPartial
                            ? "bg-achivon-primary/30 text-achivon-primary scale-95"
                            : isFuture
                            ? "bg-achivon-bg/50 scale-95 opacity-50"
                            : "bg-achivon-bg hover:bg-achivon-primary/10 cursor-pointer hover:scale-105 active:scale-95"
                        )}
                      >
                        {isDone && (
                          <Check className="w-4 h-4 animate-[pop_0.2s_ease-out]" />
                        )}
                      </button>
                    </td>
                  );
                })}
                {/* Delete button column */}
                <td className="py-3 px-1 text-center">
                  {deleteConfirmId === habit.id ? (
                    <div className="flex items-center gap-0.5 justify-center">
                      <button
                        onClick={() => handleDelete(habit.id)}
                        className="p-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Confirm delete"
                      >
                        <CheckIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 rounded-md hover:bg-achivon-bg text-achivon-text-muted transition-colors"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(habit.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-achivon-text-muted hover:text-red-500 transition-colors"
                      title="Delete habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
