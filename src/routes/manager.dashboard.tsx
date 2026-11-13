import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, ClipboardList, MapPin, Timer, TriangleAlert } from "lucide-react";

import { PageTitle } from "@/components/sitesignal/app-shell";
import { ReportCard } from "@/components/sitesignal/report-card";
import { categoryCounts, computeKpis, hotspotZones } from "@/lib/hazards";
import { useHazards } from "@/lib/hazard-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manager/dashboard")({
  head: () => ({
    meta: [
      { title: "Safety dashboard – SiteSignal" },
      { name: "description", content: "Open hazards, hotspot zones and the latest reports from your site." },
      { property: "og:title", content: "Safety dashboard – SiteSignal" },
      { property: "og:description", content: "Open hazards, hotspot zones and the latest reports from your site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Kpi({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: typeof AlertTriangle;
  tone: "primary" | "high" | "signal" | "teal";
}) {
  const toneCls = {
    primary: "text-primary",
    high: "text-sev-high",
    signal: "text-signal",
    teal: "text-teal",
  }[tone];
  return (
    <div className="rounded-xl border-2 border-border bg-card p-4">
      <Icon className={cn("size-5", toneCls)} />
      <p className={cn("mt-3 font-display text-5xl font-black leading-none", toneCls)}>{value}</p>
      <p className="label-caps mt-1.5">{label}</p>
    </div>
  );
}

function Dashboard() {
  const { reports } = useHazards();
  const kpi = computeKpis(reports);
  const cats = categoryCounts(reports);
  const max = Math.max(...cats.map((c) => c.count));
  const zones = hotspotZones(reports);
  const recent = [...reports].sort((a, b) => a.minutesAgo - b.minutesAgo).slice(0, 5);

  return (
    <div className="space-y-8">
      <PageTitle kicker="Site manager" title="Dashboard">
        Riverside Towers · Week 46
      </PageTitle>

      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Open hazards" value={kpi.open} icon={TriangleAlert} tone="primary" />
        <Kpi label="High severity" value={kpi.high} icon={AlertTriangle} tone="high" />
        <Kpi label="Reports this week" value={kpi.week} icon={ClipboardList} tone="signal" />
        <Kpi label="Avg. time to action" value={kpi.avgTimeToAction} icon={Timer} tone="teal" />
      </div>

      <section className="rounded-xl border-2 border-border bg-card p-4">
        <h2 className="font-display text-2xl font-extrabold uppercase">Hazards by category</h2>
        <p className="label-caps mb-4">This week</p>
        <ul className="space-y-2.5">
          {cats.map((c, i) => (
            <li key={c.category} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-2 text-sm">
              <span className="truncate text-muted-foreground">{c.category}</span>
              <span className="h-5 overflow-hidden rounded bg-surface">
                <span
                  className={cn("block h-full rounded", i < 3 ? "bg-primary" : "bg-signal/70")}
                  style={{ width: `${(c.count / max) * 100}%` }}
                />
              </span>
              <span className="text-right font-mono font-bold">{c.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl font-extrabold uppercase">Hotspot zones</h2>
        <ol className="divide-y divide-border overflow-hidden rounded-xl border-2 border-border bg-card">
          {zones.map((z, i) => (
            <li key={z.zone} className="flex items-center gap-3 px-4 py-3">
              <span className="w-6 font-display text-2xl font-black text-muted-foreground">{i + 1}</span>
              <MapPin className={cn("size-4", i === 0 ? "text-primary" : "text-muted-foreground")} />
              <span className="flex-1 font-semibold">{z.zone}</span>
              {z.openHigh > 0 && (
                <span className="rounded bg-sev-high/15 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold text-sev-high">
                  {z.openHigh} HIGH
                </span>
              )}
              <span className="font-mono text-sm font-bold">{z.count}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-2xl font-extrabold uppercase">Recent reports</h2>
          <Link to="/manager/risks" className="flex items-center gap-1 text-sm font-semibold text-primary">
            Open risks <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recent.map((r) => (
            <ReportCard key={r.id} report={r} view="manager" />
          ))}
        </div>
      </section>
    </div>
  );
}
