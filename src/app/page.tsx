"use client";

import { useState } from "react";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import DailyCompletion from "@/components/dashboard/DailyCompletion";
import FocusToday from "@/components/dashboard/FocusToday";
import HabitConsistency from "@/components/dashboard/HabitConsistency";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import NextBestAction from "@/components/dashboard/NextBestAction";
import DailySummary from "@/components/dashboard/DailySummary";
import { useHabitStore } from "@/store/habitStore";
import { cn } from "@/lib/utils";
import { Sparkles, X, Plus } from "lucide-react";

export default function DashboardPage() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const habits = useHabitStore((s) => s.habits);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Health & Fitness");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [newFrequency, setNewFrequency] = useState<"daily" | "weekly" | "custom">("daily");

  const categories = Array.from(new Set(habits.map((h) => h.category)));
  if (!categories.includes("Health & Fitness")) categories.unshift("Health & Fitness");

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <WelcomeHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <DailyCompletion />
          <NextBestAction />
        </div>
        <FocusToday />
      </div>

      {/* Create New Task Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-achivon-primary text-white text-sm font-semibold hover:bg-achivon-primary-light transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </button>
      </div>

      <HabitConsistency />
      <ActivityHeatmap />
      <DailySummary />

      {/* Add Habit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-achivon-card-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-achivon-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-achivon-primary" />
                </div>
                <h3 className="text-lg font-bold text-achivon-text">
                  Add New Task
                </h3>
              </div>
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
                  Task Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddHabit();
                  }}
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
                  {categories.map((c) => (
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
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
