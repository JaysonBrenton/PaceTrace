import type { Metadata } from "next";

import { PageViewLogger } from "@/components/page-view-logger";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Telemetry, pit notes, and incidents sequenced for rapid reviews.",
};

const events = [
  {
    id: "lap-18",
    label: "Lap 18",
    message: "Driver clipped the apex; pit requested tighter line next lap.",
    severity: "medium" as const,
  },
  {
    id: "lap-19",
    label: "Lap 19",
    message: "Fast lap triggered. Broadcasting callout to tablets.",
    severity: "low" as const,
  },
  {
    id: "lap-20",
    label: "Lap 20",
    message: "Telemetry packet loss detected on sector three sensor.",
    severity: "high" as const,
  },
];

const severityStyles: Record<typeof events[number]["severity"], string> = {
  low: "bg-success/20 text-success border-success/40",
  medium: "bg-warning/10 text-warning border-warning/40",
  high: "bg-destructive/10 text-destructive border-destructive/40",
};

export default function TimelinePage() {
  return (
    <>
      <PageViewLogger
        context={{ route: "timeline" }}
        event="timeline.render"
        message="timeline.viewed"
      />
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Session timeline</h1>
          <p className="text-sm text-muted-foreground">
            Cross-reference telemetry spikes with pit callouts to coach smarter.
          </p>
        </header>
        <ol className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground/80">
                  {event.label}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] ${severityStyles[event.severity]}`}>
                  {event.severity}
                </span>
              </div>
              <p className="mt-3 text-sm text-foreground">{event.message}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
