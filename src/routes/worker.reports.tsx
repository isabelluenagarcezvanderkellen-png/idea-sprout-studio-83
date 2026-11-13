import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Wrench } from "lucide-react";

import { PageTitle } from "@/components/sitesignal/app-shell";
import { StatusBadge } from "@/components/sitesignal/badges";
import { ReportCard, ReportThumb } from "@/components/sitesignal/report-card";
import { Button } from "@/components/ui/button";
import { formatAgo, type HazardReport, type Status } from "@/lib/hazards";
import { useHazards } from "@/lib/hazard-store";

export const Route = createFileRoute("/worker/reports")({
  head: () => ({
    meta: [
      { title: "My reports – SiteSignal" },
      { name: "description", content: "Track the hazards you reported, from review to resolved." },
      { property: "og:title", content: "My reports – SiteSignal" },
      { property: "og:description", content: "Track the hazards you reported, from review to resolved." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyReports,
});

const STATUSES: Status[] = ["Pending review", "In progress", "Resolved"];

function ResolvedCard({ report }: { report: HazardReport }) {
  return (
    <Link
      to="/hazard/$id"
      params={{ id: report.id }}
      search={{ view: "worker" }}
      className="block overflow-hidden rounded-xl border-2 border-teal/40 bg-card"
    >
      <div className="grid grid-cols-2 gap-0.5 bg-border">
        <div className="relative">
          <ReportThumb src={report.photo} className="aspect-[4/3] w-full" />
          <span className="absolute left-2 top-2 rounded bg-background/85 px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase">
            Before
          </span>
        </div>
        <div className="relative">
          <ReportThumb src={report.afterPhoto} className="aspect-[4/3] w-full" />
          <span className="absolute left-2 top-2 rounded bg-teal px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase text-teal-foreground">
            After
          </span>
        </div>
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status="Resolved" />
          <span className="font-mono text-[0.65rem] text-muted-foreground">{formatAgo(report.minutesAgo)}</span>
        </div>
        <p className="font-semibold leading-snug">{report.title}</p>
        <p className="text-xs text-muted-foreground">{report.zone}</p>
        <div className="flex gap-2 rounded-lg bg-surface p-2.5 text-sm">
          <Wrench className="mt-0.5 size-4 shrink-0 text-teal" />
          <p>
            <span className="font-semibold">Action taken: </span>
            {report.actionTaken}
          </p>
        </div>
      </div>
    </Link>
  );
}

function MyReports() {
  const { reports } = useHazards();
  const mine = reports.filter((r) => r.mine);
  const counts = STATUSES.map((s) => ({ s, n: mine.filter((r) => r.status === s).length }));

  return (
    <div>
      <PageTitle kicker="Worker" title="My reports">
        You've reported {mine.length} hazard{mine.length === 1 ? "" : "s"}. Thanks for speaking up.
      </PageTitle>

      <div className="mb-6 grid grid-cols-3 gap-2">
        {counts.map(({ s, n }) => (
          <div key={s} className="rounded-xl border-2 border-border bg-card p-3">
            <p className="font-display text-3xl font-black leading-none">{n}</p>
            <p className="label-caps mt-1 text-[0.58rem]">{s}</p>
          </div>
        ))}
      </div>

      {mine.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-8 text-center">
          <CheckCircle2 className="mx-auto size-10 text-teal" />
          <p className="mt-2 font-semibold">No reports yet</p>
          <Button asChild variant="hero" className="mt-4">
            <Link to="/worker/report">
              Report a hazard <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {mine.map((r) =>
            r.status === "Resolved" ? (
              <ResolvedCard key={r.id} report={r} />
            ) : (
              <ReportCard key={r.id} report={r} view="worker" />
            ),
          )}
        </div>
      )}
    </div>
  );
}
