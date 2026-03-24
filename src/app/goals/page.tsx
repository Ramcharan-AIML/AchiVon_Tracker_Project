"use client";

import { useState, useEffect } from "react";
import { useGoalStore } from "@/store/goalStore";
import { cn } from "@/lib/utils";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Circle,
  Target,
} from "lucide-react";

const MONTHS = [
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

const categoryBadge: Record<string, string> = {
  "Career Growth": "text-achivon-primary",
  "Health & Vitality": "text-red-600",
  Wealth: "text-amber-700",
  Personal: "text-violet-700",
};

const goalColors: Record<string, string> = {
  "Career Growth": "bg-achivon-primary",
  "Health & Vitality": "bg-red-600",
  Wealth: "bg-amber-600",
  Personal: "bg-violet-600",
};

export default function GoalsPage() {
  const { goals, milestones, toggleMilestone, getGoalProgress, addGoal } =
    useGoalStore();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Career Growth");
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddGoal = () => {
    if (!newTitle.trim()) return;
    addGoal({
      id: `g-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      deadline: newDeadline || "2027-01-01",
      category: newCategory,
      userId: "user-1",
      icon: "🎯",
    });
    setNewTitle("");
    setNewDesc("");
    setShowModal(false);
  };

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="h-96 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-achivon-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const mainGoals = goals.slice(0, 3);
  const emptyGoal = goals.length < 4;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="fade-in">
        <p className="text-xs font-semibold text-achivon-primary uppercase tracking-wider mb-1">
          Strategic Focus
        </p>
        <h1 className="text-3xl font-bold text-achivon-text">My Roadmaps</h1>
        <p className="text-achivon-text-light mt-1">
          Visualizing long-term aspirations through structured milestones and
          real-time progress tracking.
        </p>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in fade-in-delay-1">
        {/* Goal 1 - Large */}
        {mainGoals[0] && (
          <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border card-hover">
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider mb-2",
                categoryBadge[mainGoals[0].category] || "text-achivon-primary"
              )}
            >
              {mainGoals[0].category}
            </p>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-achivon-text mb-1">
                  {mainGoals[0].title}
                </h3>
                <p className="text-sm text-achivon-text-light">
                  {mainGoals[0].description}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-achivon-primary/10 flex items-center justify-center text-xl">
                {mainGoals[0].icon}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-achivon-text-muted uppercase">
                  Current Progress
                </span>
                <span className="text-xs font-bold text-achivon-text">
                  {getGoalProgress(mainGoals[0].id)}%
                </span>
              </div>
              <div className="h-2 bg-achivon-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-achivon-primary rounded-full progress-animate"
                  style={{
                    width: `${getGoalProgress(mainGoals[0].id)}%`,
                  }}
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {milestones
                .filter((m) => m.goalId === mainGoals[0].id)
                .slice(0, 4)
                .map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={cn(
                      "text-left text-sm px-3 py-2 rounded-xl border transition-all",
                      m.completed
                        ? "bg-achivon-bg border-achivon-border text-achivon-text-muted line-through"
                        : "bg-achivon-card-white border-achivon-border text-achivon-text hover:border-achivon-primary/30"
                    )}
                  >
                    {m.title}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Goal 2 */}
        {mainGoals[1] && (
          <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border card-hover">
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider mb-2",
                categoryBadge[mainGoals[1].category] || "text-red-600"
              )}
            >
              {mainGoals[1].category}
            </p>
            <h3 className="text-xl font-bold text-achivon-text mb-1">
              {mainGoals[1].title}
            </h3>
            <p className="text-sm text-achivon-text-light mb-4">
              {mainGoals[1].description}
            </p>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-achivon-text-muted uppercase">
                Milestones
              </span>
              <span className="text-xs text-achivon-text-light">
                {
                  milestones.filter(
                    (m) => m.goalId === mainGoals[1].id && m.completed
                  ).length
                }{" "}
                of{" "}
                {milestones.filter((m) => m.goalId === mainGoals[1].id).length}
              </span>
            </div>

            <div className="space-y-2">
              {milestones
                .filter((m) => m.goalId === mainGoals[1].id)
                .map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className="flex items-center gap-2 w-full text-left group"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-achivon-primary shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-achivon-text-muted group-hover:text-achivon-primary shrink-0 transition-colors" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        m.completed
                          ? "text-achivon-text-muted line-through"
                          : "text-achivon-text"
                      )}
                    >
                      {m.title}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Goal 3 - Smaller */}
        {mainGoals[2] && (
          <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border card-hover">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                {mainGoals[2].category}
              </p>
              <span className="text-lg">{mainGoals[2].icon}</span>
            </div>
            <h3 className="text-xl font-bold text-achivon-text mb-1">
              {mainGoals[2].title}
            </h3>
            <p className="text-sm text-achivon-text-light mb-4">
              {mainGoals[2].description}
            </p>

            <div className="bg-achivon-bg rounded-xl p-3 mb-3">
              <p className="text-[10px] text-achivon-text-muted uppercase font-semibold mb-1">
                Next Action
              </p>
              <p className="text-sm font-medium text-achivon-text">
                Rebalance ETF Portfolio
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold text-achivon-text">
                  {getGoalProgress(mainGoals[2].id)}%
                </span>
              </div>
              <span className="text-xs text-achivon-text-muted uppercase font-semibold">
                Year 1 Phase
              </span>
            </div>
          </div>
        )}

        {/* Empty Goal Card */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-achivon-border flex flex-col items-center justify-center text-center min-h-[200px] hover:border-achivon-primary/30 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-achivon-bg flex items-center justify-center mb-3 group-hover:bg-achivon-primary/10 transition-colors">
            <Plus className="w-6 h-6 text-achivon-text-muted group-hover:text-achivon-primary transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-achivon-text-light">
            Define a New Chapter
          </h3>
          <p className="text-sm text-achivon-text-muted mt-1">
            What is the next mountain you want to climb?
          </p>
        </button>
      </div>

      {/* Roadmap Horizon */}
      <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-achivon-text">
            Roadmap Horizon
          </h3>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-lg hover:bg-achivon-bg transition-colors">
              <ChevronLeft className="w-4 h-4 text-achivon-text-light" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-achivon-bg transition-colors">
              <ChevronRight className="w-4 h-4 text-achivon-text-light" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative overflow-x-auto">
          <div className="flex border-b border-achivon-border pb-2 mb-4 min-w-[600px]">
            {MONTHS.map((month) => (
              <div
                key={month}
                className="flex-1 text-xs font-medium text-achivon-text-muted text-center uppercase"
              >
                {month}
              </div>
            ))}
          </div>

          <div className="space-y-3 min-w-[600px]">
            {/* Goal 1 bar */}
            <div className="relative h-10 flex items-center">
              <div
                className="absolute h-8 rounded-xl bg-achivon-primary/10 border border-achivon-primary/20 flex items-center px-3"
                style={{ left: "0%", width: "55%" }}
              >
                <span className="text-xs font-semibold text-achivon-primary truncate">
                  Senior Dev Preparation
                </span>
              </div>
              <div
                className="absolute flex items-center gap-1"
                style={{ left: "58%" }}
              >
                <span className="text-[10px] text-achivon-text-muted">● TECH/NEWS</span>
              </div>
            </div>

            {/* Goal 2 bar */}
            <div className="relative h-10 flex items-center">
              <div
                className="absolute h-8 rounded-xl bg-red-50 border border-red-200 flex items-center px-3"
                style={{ left: "15%", width: "50%" }}
              >
                <span className="text-xs font-semibold text-red-700 truncate">
                  Marathon Training Block
                </span>
              </div>
              <div
                className="absolute flex items-center gap-1"
                style={{ left: "67%" }}
              >
                <span className="text-[10px] text-red-600">● RACEDAY</span>
              </div>
            </div>

            {/* Goal 3 bar */}
            <div className="relative h-10 flex items-center">
              <div
                className="absolute h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center px-3"
                style={{ left: "25%", width: "60%" }}
              >
                <span className="text-xs font-semibold text-amber-700 truncate">
                  Investment Strategy Execution
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Milestones + Inspiration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in fade-in-delay-3">
        {/* Priority Milestones */}
        <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-achivon-primary" />
            <h3 className="text-lg font-semibold text-achivon-text">
              Priority Milestones
            </h3>
          </div>

          <div className="space-y-4">
            {milestones
              .filter((m) => m.priority && !m.completed)
              .slice(0, 3)
              .map((m) => {
                const goal = goals.find((g) => g.id === m.goalId);
                return (
                  <div key={m.id} className="flex items-start gap-3">
                    <button
                      onClick={() => toggleMilestone(m.id)}
                      className="mt-0.5"
                    >
                      <Circle className="w-5 h-5 text-achivon-text-muted hover:text-achivon-primary transition-colors" />
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-achivon-text">
                        {m.title}
                      </p>
                      <p className="text-xs text-achivon-text-light mt-0.5">
                        {goal?.description?.slice(0, 60)}...
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                            m.priority === "high"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          )}
                        >
                          {m.priority} priority
                        </span>
                        {m.dueDate && (
                          <span className="text-[10px] font-medium text-achivon-text-muted bg-achivon-bg px-2 py-0.5 rounded">
                            {new Date(m.dueDate).toLocaleDateString("en", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Inspiration Card */}
        <div className="relative rounded-2xl overflow-hidden min-h-[260px] bg-gradient-to-br from-amber-900/80 to-amber-800/90 flex items-end p-6 card-hover">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10">
            <p className="text-[10px] font-semibold text-amber-200 uppercase tracking-wider mb-2">
              Inspiration
            </p>
            <p className="text-xl font-bold text-white leading-snug">
              Focus is the ability to say no to a thousand things.
            </p>
            <p className="text-sm text-amber-200 mt-2">— Steve Jobs</p>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-achivon-card-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-achivon-text">
                Create New Goal
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-achivon-bg"
              >
                <X className="w-5 h-5 text-achivon-text-light" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Learn Piano"
                  className="w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe your goal..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20"
                >
                  {[
                    "Career Growth",
                    "Health & Vitality",
                    "Wealth",
                    "Personal",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20"
                />
              </div>

              <button
                onClick={handleAddGoal}
                className="w-full bg-achivon-primary text-white rounded-xl py-2.5 font-semibold hover:bg-achivon-primary-light transition-colors"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
