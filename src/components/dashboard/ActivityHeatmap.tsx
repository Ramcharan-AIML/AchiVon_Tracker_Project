"use client";

import { heatmapData } from "@/lib/seedData";
import { getHeatmapIntensity, cn } from "@/lib/utils";
import { useMemo } from "react";

const HEAT_COLORS = [
  "bg-heat-0",
  "bg-heat-1",
  "bg-heat-2",
  "bg-heat-3",
  "bg-heat-4",
  "bg-heat-5",
];

export default function ActivityHeatmap() {
  const grid = useMemo(() => {
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

  return (
    <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-achivon-text">
            Activity Flow
          </h3>
          <p className="text-xs text-achivon-text-muted mt-0.5">
            Completion intensity over the past year
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-achivon-text-muted">
          <span>Less</span>
          {HEAT_COLORS.map((color, i) => (
            <div
              key={i}
              className={cn("w-3 h-3 rounded-sm", color)}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-[3px] min-w-[700px]">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => {
                const intensity = getHeatmapIntensity(day.count);
                return (
                  <div
                    key={day.date}
                    className={cn(
                      "w-3 h-3 rounded-sm transition-colors cursor-default",
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
  );
}
