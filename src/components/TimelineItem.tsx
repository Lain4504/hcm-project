import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export interface TimelineEntry {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  image?: string;
}

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ entry, index }) => {
  const isLeft = index % 2 === 0;
  const ref = React.useRef<HTMLLIElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const baseAnimation =
    "transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]";

  const hiddenY = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  const sideOffset = isLeft
    ? isVisible
      ? "md:translate-x-0"
      : "md:-translate-x-10"
    : isVisible
      ? "md:translate-x-0"
      : "md:translate-x-10";

  const cardClasses = [
    "relative rounded-2xl border border-[color:var(--border)] bg-white/95",
    "shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-sm",
    "px-5 py-4 sm:px-6 sm:py-5",
    "hover:shadow-[0_22px_55px_rgba(0,0,0,0.24)] hover:-translate-y-1",
    "hover:bg-[color-mix(in_srgb,#F5E663_6%,#FFFFFF_94%)]",
    "transition-all",
    baseAnimation,
    hiddenY,
    sideOffset,
  ].join(" ");

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-1 items-center md:grid-cols-2 md:gap-16"
    >
      {/* Mobile: Dot marker on left timeline */}
      <div className="pointer-events-none absolute left-[calc(1rem+1.5px)] top-6 z-20 -translate-x-1/2 md:hidden">
        <div className="h-3 w-3 rounded-full border-2 border-[color:var(--vn-yellow-soft)] bg-[color:var(--vn-red-dark)] shadow-md" />
      </div>
      
      {/* Mobile: Time capsule on left timeline */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 md:hidden">
        <div className="ml-5 inline-flex items-center rounded-full border border-[color:var(--vn-yellow-soft)] bg-[color:var(--vn-red-dark)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--vn-yellow-soft)] shadow-md">
          {entry.date}
        </div>
      </div>

      {/* Desktop: Time capsule anchored to the central line */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div className="inline-flex items-center rounded-full border border-[color:var(--vn-yellow-soft)] bg-[color:var(--vn-red-dark)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--vn-yellow-soft)] shadow-md">
          {entry.date}
        </div>
      </div>

      {/* Mobile: Content card on the right */}
      {/* Desktop: Left column card */}
      {isLeft && (
        <div className="ml-16 md:ml-0 md:pr-12">
          <article className={cardClasses}>
            <CardHeader className="flex flex-col gap-1 px-0 pb-3 pt-0">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--vn-red-soft)]/90">
                Mốc tư tưởng
              </p>
              <CardTitle className="text-base font-semibold text-[color:var(--foreground)] sm:text-lg">
                {entry.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-0 pb-0 pt-0 text-sm text-[color:var(--muted-foreground)]">
              <p>{entry.summary}</p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-[color:var(--vn-red-soft)]/40 bg-transparent text-[color:var(--vn-red-soft)] hover:bg-[color:var(--vn-red-soft)] hover:text-white"
              >
                <a href={`/timeline/${entry.slug}`}>Đọc chi tiết</a>
              </Button>
            </CardContent>
          </article>
        </div>
      )}

      {/* Mobile: Content card on the right */}
      {/* Desktop: Right column card */}
      {!isLeft && (
        <div className="ml-16 md:col-start-2 md:ml-0 md:pl-12">
          <article className={cardClasses}>
            <CardHeader className="flex flex-col gap-1 px-0 pb-3 pt-0">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--vn-red-soft)]/90">
                Mốc tư tưởng
              </p>
              <CardTitle className="text-base font-semibold text-[color:var(--foreground)] sm:text-lg">
                {entry.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-0 pb-0 pt-0 text-sm text-[color:var(--muted-foreground)]">
              <p>{entry.summary}</p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-[color:var(--vn-red-soft)]/40 bg-transparent text-[color:var(--vn-red-soft)] hover:bg-[color:var(--vn-red-soft)] hover:text-white"
              >
                <a href={`/timeline/${entry.slug}`}>Đọc chi tiết</a>
              </Button>
            </CardContent>
          </article>
        </div>
      )}
    </li>
  );
};

