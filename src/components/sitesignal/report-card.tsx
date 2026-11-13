import { Link } from "@tanstack/react-router";
import { ImageOff, MapPin } from "lucide-react";

import { ReviewFlag, SeverityBadge, StatusBadge } from "@/components/sitesignal/badges";
import { effectiveSeverity, formatAgo, needsImmediateReview, type HazardReport, type Role } from "@/lib/hazards";
import { cn } from "@/lib/utils";

export function ReportThumb({ src, className }: { src?: string; className?: string }) {
  return src ? (
    <img src={src} alt="" loading="lazy" className={cn("object-cover", className)} />
  ) : (
    <div className={cn("grid place-items-center bg-surface text-muted-foreground", className)}>
      <ImageOff className="size-5" />
    </div>
  );
}

export function ReportCard({
  report,
  view,
  showFlag = false,
}: {
  report: HazardReport;
  view: Role;
  showFlag?: boolean;
}) {
  const flagged = showFlag && needsImmediateReview(report);
  return (
    <Link
      to="/hazard/$id"
      params={{ id: report.id }}
      search={{ view }}
      className={cn(
        "flex gap-3 rounded-xl border-2 bg-card p-3 transition-colors hover:border-primary/60",
        flagged ? "border-sev-high/60" : "border-border",
      )}
    >
      <ReportThumb src={report.photo} className="size-20 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        {flagged && (
          <div className="mb-1.5">
            <ReviewFlag />
          </div>
        )}
        <p className="line-clamp-2 font-semibold leading-snug">{report.title}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">
            {report.zone} · {report.category}
          </span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <SeverityBadge severity={effectiveSeverity(report)} ai={!report.confirmedSeverity} />
          <StatusBadge status={report.status} />
          <span className="ml-auto font-mono text-[0.65rem] text-muted-foreground">
            {formatAgo(report.minutesAgo)}
          </span>
        </div>
      </div>
    </Link>
  );
}
