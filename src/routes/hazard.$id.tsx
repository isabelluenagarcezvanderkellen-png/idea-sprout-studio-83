import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, ClipboardCheck, MapPin, Mic, Sparkles, UserCheck, Wrench } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/sitesignal/app-shell";
import { ReviewFlag, SeverityBadge, StatusBadge } from "@/components/sitesignal/badges";
import { Field, PhotoPicker, Segmented } from "@/components/sitesignal/controls";
import { ReportThumb } from "@/components/sitesignal/report-card";
import { Button } from "@/components/ui/button";
import {
  ASSIGNEES,
  DEMO_AFTER_PHOTO,
  SEVERITIES,
  effectiveSeverity,
  formatAgo,
  isLowConfidence,
  needsImmediateReview,
  type Role,
  type Severity,
} from "@/lib/hazards";
import { useHazards } from "@/lib/hazard-store";

export const Route = createFileRoute("/hazard/$id")({
  validateSearch: (search: Record<string, unknown>): { view?: Role } => ({
    view: search.view === "worker" ? "worker" : search.view === "manager" ? "manager" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Hazard detail – SiteSignal" },
      { name: "description", content: "Full hazard report with AI suggestion and manager review." },
    ],
  }),
  component: HazardDetail,
});

const sevTone = (s: Severity) => (s === "High" ? "high" : s === "Medium" ? "medium" : "low");

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border-2 border-border bg-card p-4 ${className}`}>{children}</div>;
}

function HazardDetail() {
  const { id } = Route.useParams();
  const { view = "manager" } = Route.useSearch();
  const role: Role = view;
  const { getReport, confirmSeverity, assignAction, resolveReport } = useHazards();
  const report = getReport(id);

  const [severity, setSeverity] = useState<Severity | null>(null);
  const [assignee, setAssignee] = useState<string>(ASSIGNEES[0] ?? "");
  const [plan, setPlan] = useState("");
  const [afterPhoto, setAfterPhoto] = useState<string | undefined>(undefined);
  const [actionTaken, setActionTaken] = useState("");

  const backTo = role === "worker" ? "/worker/reports" : "/manager/risks";

  if (!report) {
    return (
      <AppShell role={role}>
        <Card className="text-center">
          <p className="font-semibold">Report not found</p>
          <p className="mt-1 text-sm text-muted-foreground">It may have been created in another session.</p>
          <Button asChild variant="hero" className="mt-4">
            <Link to={backTo}>Back</Link>
          </Button>
        </Card>
      </AppShell>
    );
  }

  const current = severity ?? report.confirmedSeverity ?? report.aiSeverity;
  const resolved = report.status === "Resolved";

  return (
    <AppShell role={role}>
      <Link to={backTo} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="size-4" /> {role === "worker" ? "My reports" : "Open risks"}
      </Link>

      <div className="mb-4 space-y-2">
        <p className="label-caps text-primary">
          {report.id} · {report.type}
        </p>
        <h1 className="font-display text-3xl font-extrabold leading-tight">{report.title}</h1>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4" /> {report.zone} · {report.category} · {formatAgo(report.minutesAgo)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={report.status} />
          <SeverityBadge severity={effectiveSeverity(report)} ai={!report.confirmedSeverity} />
          {needsImmediateReview(report) && <ReviewFlag />}
        </div>
      </div>

      {/* Photos */}
      {report.afterPhoto ? (
        <div className="mb-4 grid grid-cols-2 gap-1 overflow-hidden rounded-xl border-2 border-teal/40">
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
      ) : (
        <ReportThumb src={report.photo} className="mb-4 aspect-[4/3] w-full rounded-xl border-2 border-border" />
      )}

      <div className="space-y-4">
        {/* Voice note transcription */}
        <Card>
          <p className="label-caps mb-2 flex items-center gap-1.5 text-foreground">
            <Mic className="size-4 text-primary" /> Voice note transcription
          </p>
          <p className="text-sm italic">“{report.transcription}”</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Reported by {report.anonymous ? "Anonymous worker" : report.reporter} · worker estimate:{" "}
            {report.reportedSeverity}
          </p>
        </Card>

        {/* AI analysis */}
        <Card className="border-primary/40">
          <p className="label-caps mb-2 flex items-center gap-1.5 text-foreground">
            <Sparkles className="size-4 text-primary" /> AI analysis
          </p>
          <p className="text-sm">{report.aiSummary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={report.aiSeverity} ai />
            <span className="font-mono text-xs text-muted-foreground">
              confidence {Math.round(report.aiConfidence * 100)}%
              {isLowConfidence(report) && " · low"}
            </span>
          </div>
          <p className="mt-3 rounded-lg bg-surface p-2.5 text-xs font-semibold text-signal">
            AI suggestion – requires manager confirmation
          </p>
        </Card>

        {/* Action status */}
        {(report.assignedTo || report.actionTaken) && (
          <Card>
            {report.assignedTo && (
              <p className="flex gap-2 text-sm">
                <UserCheck className="mt-0.5 size-4 shrink-0 text-teal" />
                <span>
                  <span className="font-semibold">Assigned to: </span>
                  {report.assignedTo}
                  {report.plannedAction && <span className="block text-muted-foreground">{report.plannedAction}</span>}
                </span>
              </p>
            )}
            {report.actionTaken && (
              <p className="mt-2 flex gap-2 text-sm">
                <Wrench className="mt-0.5 size-4 shrink-0 text-teal" />
                <span>
                  <span className="font-semibold">Action taken: </span>
                  {report.actionTaken}
                </span>
              </p>
            )}
            {report.confirmedSeverity && (
              <p className="mt-2 flex gap-2 text-sm">
                <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-teal" />
                <span>
                  <span className="font-semibold">Severity confirmed by manager: </span>
                  {report.confirmedSeverity}
                </span>
              </p>
            )}
          </Card>
        )}

        {role === "worker" && !resolved && (
          <Card className="text-sm text-muted-foreground">
            Your report is with the site manager. You'll see the fix and an “after” photo here once it's resolved.
          </Card>
        )}

        {role === "worker" && resolved && (
          <Card className="flex gap-2 border-teal/40 text-sm">
            <CheckCircle2 className="size-5 shrink-0 text-teal" />
            Fixed. Thanks for speaking up — your report made the site safer.
          </Card>
        )}

        {/* Manager review */}
        {role === "manager" && !resolved && (
          <Card className="space-y-6 border-signal/50">
            <p className="label-caps text-signal">Manager review · human decision</p>

            <Field label="1. Confirm severity" hint={`AI suggested ${report.aiSeverity}`}>
              <Segmented
                label="Severity"
                options={SEVERITIES}
                value={current}
                onChange={setSeverity}
                tone={sevTone}
              />
              <Button
                variant="signal"
                className="w-full"
                onClick={() => {
                  confirmSeverity(report.id, current);
                  toast.success(`Severity confirmed: ${current}`);
                }}
              >
                Confirm severity
              </Button>
            </Field>

            <Field label="2. Assign action">
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="min-h-12 w-full rounded-lg border-2 border-border bg-background px-3 text-sm"
              >
                {ASSIGNEES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <textarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Planned action, e.g. isolate area and fix guardrail before next shift"
                className="min-h-20 w-full rounded-lg border-2 border-border bg-background p-3 text-sm"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  assignAction(report.id, assignee, plan.trim() || "Make safe and inspect before work resumes.");
                  toast.success(`Assigned to ${assignee}`);
                }}
              >
                Assign action
              </Button>
            </Field>

            <Field label="3. Mark resolved" hint="Requires after photo">
              <PhotoPicker
                value={afterPhoto}
                onChange={setAfterPhoto}
                demoPhoto={DEMO_AFTER_PHOTO}
                emptyLabel="Add after photo"
              />
              <textarea
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="Action taken"
                className="min-h-20 w-full rounded-lg border-2 border-border bg-background p-3 text-sm"
              />
              <Button
                variant="hero"
                className="w-full"
                disabled={!afterPhoto}
                onClick={() => {
                  if (afterPhoto && resolveReport(report.id, afterPhoto, actionTaken)) {
                    toast.success("Hazard resolved – the worker can now see the fix");
                  }
                }}
              >
                <CheckCircle2 /> Mark resolved
              </Button>
            </Field>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
