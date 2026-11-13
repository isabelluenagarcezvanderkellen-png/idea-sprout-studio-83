import { createFileRoute } from "@tanstack/react-router";

import { PageTitle } from "@/components/sitesignal/app-shell";
import { ReportCard } from "@/components/sitesignal/report-card";
import { needsImmediateReview, sortOpenRisks } from "@/lib/hazards";
import { useHazards } from "@/lib/hazard-store";

export const Route = createFileRoute("/manager/risks")({
  head: () => ({
    meta: [
      { title: "Open risks – SiteSignal" },
      { name: "description", content: "Every open hazard on site, sorted by severity." },
      { property: "og:title", content: "Open risks – SiteSignal" },
      { property: "og:description", content: "Every open hazard on site, sorted by severity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpenRisks,
});

function OpenRisks() {
  const { reports } = useHazards();
  const open = sortOpenRisks(reports);
  const flagged = open.filter(needsImmediateReview).length;

  return (
    <div>
      <PageTitle kicker="Site manager" title="Open risks">
        {open.length} open · <span className="font-semibold text-sev-high">{flagged} need immediate review</span>
        <span className="mt-1 block text-xs">Sorted by severity. High severity or low AI confidence is flagged.</span>
      </PageTitle>
      <div className="space-y-3">
        {open.map((r) => (
          <ReportCard key={r.id} report={r} view="manager" showFlag />
        ))}
      </div>
    </div>
  );
}
