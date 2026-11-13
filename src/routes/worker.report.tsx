import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, EyeOff, Send, Sparkles } from "lucide-react";
import { useState } from "react";

import { PageTitle } from "@/components/sitesignal/app-shell";
import { Field, PhotoPicker, Segmented } from "@/components/sitesignal/controls";
import { VoiceRecorder } from "@/components/sitesignal/voice-recorder";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  CATEGORIES,
  DEMO_REPORT_PHOTO,
  SEVERITIES,
  ZONES,
  aiTriageLine,
  type Category,
  type HazardReport,
  type ReportType,
  type Severity,
} from "@/lib/hazards";
import { useHazards } from "@/lib/hazard-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/worker/report")({
  head: () => ({
    meta: [
      { title: "Report a hazard – SiteSignal" },
      { name: "description", content: "Report a construction site hazard with a photo and a voice note." },
      { property: "og:title", content: "Report a hazard – SiteSignal" },
      { property: "og:description", content: "Report a construction site hazard with a photo and a voice note." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportHazard,
});

const sevTone = (s: Severity) => (s === "High" ? "high" : s === "Medium" ? "medium" : "low");

function ReportHazard() {
  const { submitReport } = useHazards();
  const [photo, setPhoto] = useState<string>();
  const [transcript, setTranscript] = useState("");
  const [type, setType] = useState<ReportType>("Hazardous condition");
  const [category, setCategory] = useState<Category | null>(null);
  const [zone, setZone] = useState("");
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState<HazardReport | null>(null);

  const ready = Boolean(category && zone && severity);

  const reset = () => {
    setPhoto(undefined);
    setTranscript("");
    setType("Hazardous condition");
    setCategory(null);
    setZone("");
    setSeverity(null);
    setAnonymous(false);
    setSent(null);
  };

  if (sent) {
    return (
      <div className="pt-6 text-center">
        <span className="mx-auto grid size-24 place-items-center rounded-full bg-teal/15 text-teal">
          <CheckCircle2 className="size-14" strokeWidth={2.25} />
        </span>
        <h1 className="mt-5 font-display text-5xl font-black uppercase">Report sent.</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">Ref {sent.id}</p>
        <div className="mt-6 rounded-xl border-2 border-teal/40 bg-ai p-4 text-left">
          <p className="flex items-center gap-1.5 text-xs font-bold text-teal">
            <Sparkles className="size-3.5" /> AI triage
          </p>
          <p className="mt-1.5 text-lg font-semibold leading-snug">{aiTriageLine(sent)}</p>
        </div>
        {sent.anonymous && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <EyeOff className="size-4" /> Sent anonymously
          </p>
        )}
        <div className="mt-8 space-y-3">
          <Button asChild variant="hero" size="xl" className="w-full">
            <Link to="/worker/reports">View my reports</Link>
          </Button>
          <Button variant="panel" size="lg" className="w-full" onClick={reset}>
            Report another hazard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (!category || !zone || !severity) return;
        setSent(submitReport({ photo, transcription: transcript, type, category, zone, severity, anonymous }));
        window.scrollTo({ top: 0 });
      }}
    >
      <PageTitle kicker="Worker" title="Report a hazard" />

      <Field label="Photo">
        <PhotoPicker value={photo} onChange={setPhoto} demoPhoto={DEMO_REPORT_PHOTO} />
      </Field>

      <Field label="Voice note">
        <VoiceRecorder value={transcript} onChange={setTranscript} />
      </Field>

      <Field label="What is it?">
        <Segmented
          label="Report type"
          options={["Hazardous condition", "Near-miss"] as const}
          value={type}
          onChange={setType}
        />
      </Field>

      <Field label="Hazard category">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "min-h-11 rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                category === c
                  ? "border-signal bg-signal text-signal-foreground"
                  : "border-border bg-card text-foreground hover:border-signal/60",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Site zone">
        <Select value={zone} onValueChange={setZone}>
          <SelectTrigger aria-label="Site zone" className="h-14 rounded-lg border-2 bg-card text-base">
            <SelectValue placeholder="Select where it is" />
          </SelectTrigger>
          <SelectContent>
            {ZONES.map((z) => (
              <SelectItem key={z} value={z} className="py-3 text-base">
                {z}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Severity" hint="Your best guess">
        <Segmented label="Severity" options={SEVERITIES} value={severity} onChange={setSeverity} tone={sevTone} />
      </Field>

      <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-border bg-card px-4">
        <span className="flex items-center gap-3">
          <EyeOff className="size-5 text-teal" />
          <span>
            <span className="block font-semibold">Report anonymously</span>
            <span className="block text-xs text-muted-foreground">Your name won't be shared with the manager</span>
          </span>
        </span>
        <Switch checked={anonymous} onCheckedChange={setAnonymous} aria-label="Report anonymously" />
      </label>

      <div className="space-y-2">
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={!ready}>
          <Send /> Submit report
        </Button>
        {!ready && (
          <p className="text-center text-xs text-muted-foreground">
            Choose a category, site zone and severity to send.
          </p>
        )}
      </div>
    </form>
  );
}
