import { AlertTriangle, CheckCircle2, Clock, Loader, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Severity, Status } from "@/lib/hazards";

const sevVariant = { High: "high", Medium: "medium", Low: "low" } as const;

export function SeverityBadge({ severity, ai }: { severity: Severity; ai?: boolean }) {
  return (
    <Badge variant={sevVariant[severity]}>
      {ai && <Sparkles />}
      {ai ? `AI · ${severity}` : severity}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  if (status === "Resolved")
    return (
      <Badge variant="resolved">
        <CheckCircle2 /> Resolved
      </Badge>
    );
  if (status === "In progress")
    return (
      <Badge variant="progress">
        <Loader /> In progress
      </Badge>
    );
  return (
    <Badge variant="pending">
      <Clock /> Pending review
    </Badge>
  );
}

export function ReviewFlag() {
  return (
    <Badge variant="flag">
      <AlertTriangle /> Needs immediate review
    </Badge>
  );
}
