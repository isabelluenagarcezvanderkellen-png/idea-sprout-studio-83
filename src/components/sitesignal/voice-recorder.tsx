import { Mic, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { MOCK_TRANSCRIPT } from "@/lib/hazards";
import { cn } from "@/lib/utils";

type RecState = "idle" | "recording" | "transcribing" | "done";

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-12 items-center justify-center gap-1" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className={cn("w-1.5 rounded-full bg-primary", active ? "animate-wave" : "opacity-30")}
          style={{
            height: `${30 + ((i * 37) % 70)}%`,
            animationDelay: `${(i % 7) * 0.11}s`,
            transform: active ? undefined : "scaleY(0.25)",
          }}
        />
      ))}
    </div>
  );
}

/** Simulated hold-to-record voice note that produces an editable mock transcription. */
export function VoiceRecorder({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [state, setState] = useState<RecState>(value ? "done" : "idle");
  const [seconds, setSeconds] = useState(0);
  const [hint, setHint] = useState(false);
  const startedAt = useRef(0);
  const recording = useRef(false);

  useEffect(() => {
    if (state !== "recording") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  const start = () => {
    if (state === "transcribing" || recording.current) return;
    recording.current = true;
    startedAt.current = Date.now();
    setSeconds(0);
    setHint(false);
    setState("recording");
  };

  const stop = () => {
    if (!recording.current) return;
    recording.current = false;
    if (Date.now() - startedAt.current < 500) {
      setState(value ? "done" : "idle");
      setHint(true);
      return;
    }
    setState("transcribing");
    setTimeout(() => {
      onChange(MOCK_TRANSCRIPT);
      setState("done");
    }, 1300);
  };

  const isRec = state === "recording";

  return (
    <div className="space-y-3">
      <div className="rounded-xl border-2 border-border bg-card p-4">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            aria-label="Hold to record voice note"
            aria-pressed={isRec}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              start();
            }}
            onPointerUp={stop}
            onPointerCancel={stop}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault();
                start();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") stop();
            }}
            onContextMenu={(e) => e.preventDefault()}
            className={cn(
              "relative grid size-28 touch-none select-none place-items-center rounded-full transition-transform",
              isRec ? "scale-105 bg-sev-high text-destructive-foreground" : "bg-primary text-primary-foreground shadow-glow",
            )}
          >
            {isRec && <span className="absolute inset-0 rounded-full bg-sev-high animate-ring-pulse" />}
            <Mic className="relative size-12" strokeWidth={2.25} />
          </button>
          <p className="font-display text-xl font-bold uppercase">
            {isRec
              ? `Recording… 0:${String(seconds).padStart(2, "0")}`
              : state === "transcribing"
                ? "Transcribing…"
                : state === "done"
                  ? "Hold to re-record"
                  : "Hold to record voice note"}
          </p>
          <Waveform active={isRec} />
          {hint && <p className="text-xs font-semibold text-signal">Keep holding the button while you speak.</p>}
        </div>
      </div>

      {state === "done" && (
        <div className="space-y-2 rounded-xl border-2 border-teal/40 bg-ai p-3">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs font-bold text-teal">
              <Sparkles className="size-3.5" /> AI transcription – check before sending
            </p>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setState("idle");
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3" /> Clear
            </button>
          </div>
          <Textarea
            aria-label="AI transcription"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="border-input bg-background/60 text-base"
          />
        </div>
      )}
    </div>
  );
}
