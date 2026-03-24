"use client";

import { useState, useEffect, useMemo } from "react";
import { useHabitStore } from "@/store/habitStore";
import { heatmapData } from "@/lib/seedData";
import { getHeatmapIntensity, cn, formatDate } from "@/lib/utils";
import {
  ArrowUpRight,
  AlertTriangle,
  Award,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const HEAT_COLORS = [
  "bg-heat-0",
  "bg-heat-1",
  "bg-heat-2",
  "bg-heat-3",
  "bg-heat-4",
  "bg-heat-5",
];

const weeklyTrendData = [
  { label: "Mon", value: 72 },
  { label: "Tue", value: 68 },
  { label: "Wed", value: 75 },
  { label: "Thu", value: 80 },
  { label: "Fri", value: 78 },
  { label: "Sat", value: 65 },
  { label: "Sun", value: 70 },
];

const monthlyTrendData = [
  { label: "Jan", value: 65 },
  { label: "Feb", value: 70 },
  { label: "Mar", value: 68 },
  { label: "Apr", value: 72 },
  { label: "May", value: 75 },
  { label: "Jun", value: 78 },
  { label: "Jul", value: 82 },
  { label: "Aug", value: 76 },
  { label: "Sep", value: 80 },
  { label: "Oct", value: 78 },
  { label: "Nov", value: 82 },
  { label: "Dec", value: 85 },
];

const throughputData = [
  { hour: "12", tasks: 1 },
  { hour: "13", tasks: 2 },
  { hour: "14", tasks: 3 },
  { hour: "15", tasks: 2 },
  { hour: "16", tasks: 4 },
  { hour: "17", tasks: 5 },
  { hour: "18", tasks: 3 },
  { hour: "19", tasks: 4 },
  { hour: "20", tasks: 2 },
];

const categories = [
  { name: "Health", percent: 80, color: "#8B0000" },
  { name: "Finance", percent: 85, color: "#B45309" },
  { name: "Self-Care", percent: 60, color: "#BE185D" },
];

export default function AnalyticsPage() {
  const { habits, logs } = useHabitStore();
  const [trendView, setTrendView] = useState<"Weekly" | "Monthly">("Weekly");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Consistency matrix
  const consistencyGrid = useMemo(() => {
    const weeks: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    heatmapData.forEach((d, i) => {
      const dayOfWeek = new Date(d.date).getDay();
      if (dayOfWeek === 1 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(d);
      if (i === heatmapData.length - 1) {
        weeks.push(currentWeek);
      }
    });

    return weeks;
  }, []);

  const totalCompleted = logs.filter((l) => l.status === "done").length;
  const totalTasks = logs.length;
  const successRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 78;

  // Month labels for consistency matrix
  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
        <h1 className="text-2xl font-bold text-achivon-text">
          Analytics & Insights
        </h1>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in fade-in-delay-1">
        {/* Success Rate */}
        <div className="bg-achivon-card-white rounded-2xl p-5 shadow-sm border border-achivon-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-achivon-text-muted uppercase tracking-wider">
              Success Rate
            </h4>
            <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              +4.2%
            </span>
          </div>
          <p className="text-4xl font-bold text-achivon-text">{successRate}%</p>
          <p className="text-xs text-achivon-text-light mt-1">
            Overall completion rate across {habits.length} active habits this
            month.
          </p>
        </div>

        {/* Top Category */}
        <div className="bg-achivon-primary rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Top Category
            </h4>
            <Award className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-2xl font-bold">Career</p>
          <p className="text-sm opacity-80 mt-1">
            94% consistency. Your professional growth is on a steady upward
            trajectory.
          </p>
        </div>

        {/* Critical Insight */}
        <div className="bg-achivon-card-white rounded-2xl p-5 shadow-sm border border-achivon-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-achivon-text-muted uppercase tracking-wider">
              Critical Insight
            </h4>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-achivon-text">
            Late-Night Friction
          </p>
          <p className="text-xs text-achivon-text-light mt-1">
            You frequently miss your{" "}
            <span className="font-semibold">evening meditation</span>. Consider
            moving it to the morning.
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 fade-in fade-in-delay-2">
        {/* Completion Trends */}
        <div className="lg:col-span-3 bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-achivon-text">
              Completion Trends
            </h3>
            <div className="flex bg-achivon-bg rounded-lg p-0.5">
              {["Weekly", "Monthly"].map((view) => (
                <button
                  key={view}
                  onClick={() => setTrendView(view as "Weekly" | "Monthly")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                    trendView === view
                      ? "bg-achivon-card-white text-achivon-text shadow-sm"
                      : "text-achivon-text-muted"
                  )}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  trendView === "Weekly" ? weeklyTrendData : monthlyTrendData
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8E4DE"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9B9B9B" }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E8E4DE",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8B0000"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#8B0000" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Success */}
        <div className="lg:col-span-2 bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border">
          <h3 className="text-base font-semibold text-achivon-text mb-6">
            Category Success
          </h3>

          <div className="flex items-center justify-around">
            {categories.map((cat) => (
              <div key={cat.name} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="#E8E4DE"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke={cat.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${cat.percent} ${100 - cat.percent}`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-achivon-text">
                    {cat.percent}%
                  </span>
                </div>
                <p className="text-xs font-medium text-achivon-text-light">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consistency Matrix */}
      <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-achivon-text">
              Consistency Matrix
            </h3>
            <p className="text-xs text-achivon-text-muted mt-0.5">
              428 tasks completed in the last 12 months
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-achivon-text-muted">
            <span>Less</span>
            {HEAT_COLORS.map((color, i) => (
              <div key={i} className={cn("w-3 h-3 rounded-sm", color)} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Month labels */}
        <div className="overflow-x-auto">
          <div className="flex gap-[3px] mb-1 pl-0 min-w-[700px]">
            {MONTH_LABELS.map((m, i) => (
              <div
                key={i}
                className="text-[9px] text-achivon-text-muted"
                style={{ width: `${100 / 12}%` }}
              >
                {m}
              </div>
            ))}
          </div>

          <div className="flex gap-[3px] min-w-[700px]">
            {consistencyGrid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => {
                  const intensity = getHeatmapIntensity(day.count);
                  return (
                    <div
                      key={day.date}
                      className={cn(
                        "w-[11px] h-[11px] rounded-[2px] cursor-default",
                        HEAT_COLORS[intensity]
                      )}
                      title={`${day.date}: ${day.count} tasks`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in fade-in-delay-4">
        {/* Daily Throughput */}
        <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border">
          <h3 className="text-base font-semibold text-achivon-text mb-4">
            Daily Throughput
          </h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughputData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8E4DE"
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9B9B9B" }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E8E4DE",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="tasks"
                  fill="#8B0000"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Behavioral Analysis */}
        <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-achivon-primary flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-base font-semibold text-achivon-text">
              Behavioral Analysis
            </h3>
          </div>

          <div className="space-y-4">
            {/* Friction Point */}
            <div className="bg-achivon-bg rounded-xl p-4">
              <p className="text-[10px] font-bold text-achivon-text-muted uppercase tracking-wider mb-1">
                Primary Friction Point
              </p>
              <p className="text-sm font-semibold text-achivon-text">
                Evening Meditation
              </p>
              <p className="text-xs text-achivon-text-light mt-1">
                Missed 80% of the time after work meetings that run past 6 PM.
              </p>
            </div>

            {/* AI Suggestion */}
            <div className="bg-achivon-bg rounded-xl p-4">
              <p className="text-[10px] font-bold text-achivon-text-muted uppercase tracking-wider mb-1">
                AI Suggestion
              </p>
              <p className="text-sm text-achivon-text italic leading-relaxed">
                &quot;Your focus peaks at 10 AM. Scheduling challenging habits
                in this window increases success probability by 34%.&quot;
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm font-semibold text-achivon-primary hover:underline">
              Apply Adjustments
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
