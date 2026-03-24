"use client";

import { useState, useEffect } from "react";
import { useHabitStore } from "@/store/habitStore";
import { getWeekDates, formatDate, cn } from "@/lib/utils";
import { HabitIcon } from "@/components/ui/HabitIcon";
import {
  Check,
  Filter,
  Plus,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

// categoryMap and CATEGORIES removed; dynamic computation used below.
const categoryBadge: Record<string, string> = {
  Health: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Career: "bg-purple-50 text-purple-700 border border-purple-200",
  Learning: "bg-blue-50 text-blue-700 border border-blue-200",
  Mindfulness: "bg-orange-50 text-orange-700 border border-orange-200",
  "Self-Care": "bg-pink-50 text-pink-700 border border-pink-200",
};

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function HabitsPage() {
  const { habits, logs, toggleLog, addHabit, getStreak } = useHabitStore();
  const [activeCategory, setActiveCategory] = useState("All Habits");
  const [viewMode, setViewMode] = useState<"Daily" | "Weekly">("Daily");
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Health & Fitness");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [newFrequency, setNewFrequency] = useState<"daily" | "weekly" | "custom">("daily");

  useEffect(() => {
    setMounted(true);
  }, []);

  const weekDates = getWeekDates(weekOffset);
  const today = new Date();
  const todayStr = formatDate(today);

  const dynamicCategories = ["All Habits", ...Array.from(new Set(habits.map((h) => h.category)))];
  const modalCategories = Array.from(new Set(habits.map((h) => h.category)));
  if (!modalCategories.includes("Health & Fitness")) modalCategories.unshift("Health & Fitness");

  const filteredHabits =
    activeCategory === "All Habits"
      ? habits
      : habits.filter((h) => h.category === activeCategory);

  const handleAddHabit = () => {
    if (!newName.trim()) return;
    
    const finalCategory = isCustomCategory ? customCategory.trim() : newCategory;
    if (!finalCategory) return;

    addHabit({
      id: `h-${Date.now()}`,
      name: newName.trim(),
      category: finalCategory,
      frequency: newFrequency,
      targetCount: 1,
      userId: "user-1",
      icon: "Star",
    });
    setNewName("");
    setCustomCategory("");
    setIsCustomCategory(false);
    setShowModal(false);
  };

  // Monthly timeline data
  const getMonthlyData = (category: string) => {
    const categoryHabits = habits.filter((h) => h.category === category);
    const daysInMonth = 30;
    const data: ("done" | "missed" | "partial" | "none")[] = [];

    for (let i = daysInMonth; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      const dayLogs = logs.filter(
        (l) =>
          categoryHabits.some((h) => h.id === l.habitId) && l.date === dateStr
      );

      if (dayLogs.length === 0) {
        data.push("none");
      } else {
        const doneCount = dayLogs.filter((l) => l.status === "done").length;
        const ratio = doneCount / categoryHabits.length;
        data.push(ratio >= 0.8 ? "done" : ratio >= 0.5 ? "partial" : "missed");
      }
    }

    const totalDone = data.filter((d) => d === "done" || d === "partial").length;
    const percent = Math.round((totalDone / daysInMonth) * 100);

    return { data, percent };
  };

  // Calculate overall streak
  const overallStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      const dayLogs = logs.filter((l) => l.date === dateStr && l.status === "done");
      if (dayLogs.length >= habits.length * 0.5) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="h-96 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-achivon-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="fade-in">
        <p className="text-xs font-semibold text-achivon-primary uppercase tracking-wider mb-1">
          Weekly Performance
        </p>
        <h1 className="text-3xl font-bold text-achivon-text">Habits & Tasks</h1>
        <p className="text-achivon-text-light mt-1">
          Curation of your daily rhythms. Excellence is not an act, but a habit.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === cat
                  ? "text-achivon-primary border-b-2 border-achivon-primary bg-transparent"
                  : "text-achivon-text-light hover:text-achivon-text"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-achivon-bg rounded-xl p-0.5">
            {["Daily", "Weekly"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as "Daily" | "Weekly")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                  viewMode === mode
                    ? "bg-achivon-card-white text-achivon-text shadow-sm"
                    : "text-achivon-text-muted"
                )}
              >
                ● {mode}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-achivon-border text-sm text-achivon-text hover:bg-achivon-bg transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter View
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-achivon-primary text-white text-sm font-semibold hover:bg-achivon-primary-light transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Add New Task
          </button>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="p-1 rounded hover:bg-achivon-bg"
            >
              <ChevronLeft className="w-4 h-4 text-achivon-text-light" />
            </button>
            <button
              onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
              className="p-1 rounded hover:bg-achivon-bg"
            >
              <ChevronRight className="w-4 h-4 text-achivon-text-light" />
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th className="w-[200px]" />
              {weekDates.map((date, i) => {
                const isToday = formatDate(date) === todayStr;
                return (
                  <th key={i} className="text-center pb-3">
                    <span
                      className={cn(
                        "block text-xs font-medium",
                        isToday ? "text-achivon-primary" : "text-achivon-text-muted"
                      )}
                    >
                      {DAY_LABELS[i]}
                    </span>
                    <span
                      className={cn(
                        "block text-lg font-bold mt-0.5",
                        isToday ? "text-achivon-primary" : "text-achivon-text"
                      )}
                    >
                      {date.getDate()}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredHabits.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-achivon-text-muted">
                  <div className="flex flex-col items-center justify-center">
                    <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm">No habits yet.</p>
                    <p className="text-xs mt-1 mb-4">Start building your system today.</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-4 py-2 bg-achivon-primary/10 text-achivon-primary rounded-xl text-xs font-semibold hover:bg-achivon-primary/20 transition-colors"
                    >
                      + Add Habit
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredHabits.map((habit) => {
                const habitLogs = logs.filter(
                  (l) => l.habitId === habit.id && l.status === "done"
                );
                const completionPercent = Math.round(
                  (habitLogs.length / 30) * 100
                );

                return (
                  <tr key={habit.id} className="border-t border-achivon-border/50 group">
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-achivon-primary/10 flex items-center justify-center text-achivon-primary shrink-0">
                            <HabitIcon name={habit.icon} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-achivon-text">
                                {habit.name}
                              </p>
                              {getStreak(habit.id) > 2 && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">
                                  <Flame className="w-3 h-3" />
                                  {getStreak(habit.id)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[10px] font-semibold text-achivon-text-muted uppercase">
                                {habit.category}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    {weekDates.map((date) => {
                      const dateStr = formatDate(date);
                      const log = logs.find(
                        (l) => l.habitId === habit.id && l.date === dateStr
                      );
                      const isDone = log?.status === "done";
                      const isPartial = log?.status === "partial";
                      const isFuture = date > today;
                      const isToday = dateStr === todayStr;

                      return (
                        <td
                          key={dateStr}
                          className={cn(
                            "py-4 text-center transition-colors duration-300 relative",
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
                            onClick={() => !isFuture && toggleLog(habit.id, dateStr)}
                            disabled={isFuture}
                            className={cn(
                              "habit-cell w-11 h-11 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 transform",
                              isDone
                                ? "bg-achivon-primary text-white shadow-md shadow-achivon-primary/20 scale-100"
                                : isPartial
                                ? "bg-achivon-primary/20 text-achivon-primary scale-95"
                                : isFuture
                                ? "bg-achivon-bg/30 scale-95 opacity-50"
                                : "bg-achivon-bg hover:bg-achivon-primary/10 cursor-pointer hover:scale-105 active:scale-95"
                            )}
                          >
                            {isDone && <Check className="w-5 h-5 animate-[pop_0.2s_ease-out]" />}
                            {isPartial && (
                              <div className="w-2.5 h-2.5 bg-achivon-primary/60 rounded-sm" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Monthly Timeline + Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Timeline */}
        <div className="lg:col-span-2 bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-achivon-text">
                Monthly Timeline
              </h3>
              <p className="text-xs text-achivon-text-muted mt-0.5">
                Consistency overview for{" "}
                {today.toLocaleString("en", { month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-1">
              <button className="p-1 rounded-full bg-achivon-bg hover:bg-achivon-border transition-colors">
                <ChevronLeft className="w-3.5 h-3.5 text-achivon-text-light" />
              </button>
              <button className="p-1 rounded-full bg-achivon-bg hover:bg-achivon-border transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-achivon-text-light" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {["Health", "Career"].map((cat) => {
              const { data, percent } = getMonthlyData(cat);
              return (
                <div key={cat} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-achivon-text w-20 shrink-0">
                    {cat === "Health" ? "Health Focus" : "Deep Work"}
                  </span>
                  <div className="flex gap-[3px] flex-1">
                    {data.map((status, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-3 h-5 rounded-sm",
                          status === "done"
                            ? cat === "Health"
                              ? "bg-achivon-primary"
                              : "bg-blue-700"
                            : status === "partial"
                            ? cat === "Health"
                              ? "bg-achivon-primary/40"
                              : "bg-blue-400"
                            : "bg-achivon-bg"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-achivon-text-light w-10 text-right">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-achivon-primary rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center shadow-lg fade-in fade-in-delay-3">
          <Sparkles className="w-8 h-8 mb-3 opacity-80" />
          <h2 className="text-4xl font-bold mb-2">{overallStreak} Day Streak</h2>
          <p className="text-sm opacity-80 mb-4">
            You&apos;re in the top 5% of AchiVon curators this month. Your
            &quot;Mindfulness&quot; habit is your most stable pillar.
          </p>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            Analyze Patterns
          </button>
        </div>
      </div>

      {/* Categorized Details */}
      <div className="fade-in fade-in-delay-4">
        <h3 className="text-xs font-semibold text-achivon-text-muted uppercase tracking-wider mb-4">
          Categorized Details
        </h3>
        <div className="space-y-3">
          {habits.slice(0, 4).map((habit) => {
            const habitLogs = logs.filter(
              (l) => l.habitId === habit.id && l.status === "done"
            );
            const completionCount = habitLogs.length;
            const totalDays = 30;
            const completionPercent = Math.round(
              (completionCount / totalDays) * 100
            );

            return (
              <div
                key={habit.id}
                className="bg-achivon-card-white rounded-2xl p-5 shadow-sm border border-achivon-border flex items-center gap-4 card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-achivon-primary/10 flex items-center justify-center text-achivon-primary shrink-0">
                  <HabitIcon name={habit.icon} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-achivon-text">
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded",
                        categoryBadge[habit.category] || "bg-gray-100 text-gray-700"
                      )}
                    >
                      {habit.category}
                    </span>
                    <span className="text-[11px] text-achivon-text-muted">
                      ● {habit.frequency === "daily" ? "Daily" : "Mon, Wed, Fri"},{" "}
                      8:00 AM
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-achivon-text-muted uppercase font-medium">
                    Completion
                  </p>
                  <p className="text-sm font-bold text-achivon-text">
                    {completionCount} / {totalDays} Days
                  </p>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-achivon-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-achivon-primary rounded-full progress-animate"
                      style={{ width: `${Math.min(completionPercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-achivon-card-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-achivon-text">
                Add New Habit
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-achivon-bg transition-colors"
              >
                <X className="w-5 h-5 text-achivon-text-light" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Morning Run"
                  className="w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Category
                </label>
                <select
                  value={isCustomCategory ? "Other" : newCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "Other") {
                      setIsCustomCategory(true);
                      setNewCategory("Other");
                    } else {
                      setIsCustomCategory(false);
                      setNewCategory(val);
                    }
                  }}
                  className={cn(
                    "w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20",
                    isCustomCategory && "mb-3"
                  )}
                >
                  {modalCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Other">Other (Custom)</option>
                </select>

                {isCustomCategory && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Type custom category..."
                    className="w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20 animate-in fade-in slide-in-from-top-2"
                    autoFocus
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Frequency
                </label>
                <div className="flex gap-2">
                  {(["daily", "weekly", "custom"] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setNewFrequency(freq)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm capitalize transition-colors",
                        newFrequency === freq
                          ? "bg-achivon-primary text-white"
                          : "bg-achivon-bg text-achivon-text-light hover:bg-achivon-border"
                      )}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddHabit}
                className="w-full bg-achivon-primary text-white rounded-xl py-2.5 font-semibold hover:bg-achivon-primary-light transition-colors"
              >
                Create Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
