import type React from "react";
import { TimelineItem, type TimelineEntry } from "./TimelineItem";

interface TimelineListProps {
  entries: TimelineEntry[];
}

export const TimelineList: React.FC<TimelineListProps> = ({ entries }) => {
  return (
    <section className="relative mx-auto max-w-5xl py-16 md:py-20">
      {/* Central vertical timeline line */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[color:var(--vn-red-dark)] via-[color:var(--vn-red-soft)]/85 to-[color:var(--vn-red-soft)]/30 md:block" />

      <ol className="relative space-y-20 md:space-y-24">
        {entries.map((entry, index) => (
          <TimelineItem key={entry.id} entry={entry} index={index} />
        ))}
      </ol>
    </section>
  );
};

