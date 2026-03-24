"use client";

import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import DailyCompletion from "@/components/dashboard/DailyCompletion";
import FocusToday from "@/components/dashboard/FocusToday";
import HabitConsistency from "@/components/dashboard/HabitConsistency";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import NextBestAction from "@/components/dashboard/NextBestAction";
import DailySummary from "@/components/dashboard/DailySummary";

export default function DashboardPage() {
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

      <HabitConsistency />
      <ActivityHeatmap />
      <DailySummary />
    </div>
  );
}
