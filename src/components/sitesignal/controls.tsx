import { Camera, ImagePlus, X } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="label-caps text-foreground">{label}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  tone = (_: T) => "primary" as const,
}: {
  options: readonly T[];
  value: T | null;
  onChange: (v: T) => void;
  label: string;
  tone?: (v: T) => "primary" | "high" | "medium" | "low";
}) {
  const active = {
    primary: "border-primary bg-primary text-primary-foreground",
    high: "border-sev-high bg-sev-high text-destructive-foreground",
    medium: "border-sev-medium bg-sev-medium text-signal-foreground",
    low: "border-sev-low bg-sev-low text-teal-foreground",
  };
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "min-h-12 rounded-lg border-2 px-2 font-display text-base font-bold uppercase tracking-wide transition-colors",
            value === o ? active[tone(o)] : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function PhotoPicker({
  value,
  onChange,
  demoPhoto,
  emptyLabel = "Take or upload a photo",
}: {
  value?: string | undefined;
  onChange: (url?: string) => void;
  demoPhoto?: string | undefined;
  emptyLabel?: string;
}) {
  const id = useId();
  if (value) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-border">
        <img src={value} alt="Selected" className="aspect-[4/3] w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(undefined)}
          aria-label="Remove photo"
          className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-background/85 text-foreground"
        >
          <X className="size-5" />
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-card text-center transition-colors hover:border-primary"
      >
        <span className="grid size-14 place-items-center rounded-full bg-surface text-primary">
          <Camera className="size-7" />
        </span>
        <span className="font-display text-lg font-bold uppercase">{emptyLabel}</span>
        <span className="text-xs text-muted-foreground">Tap to open camera or gallery</span>
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(URL.createObjectURL(f));
        }}
      />
      {demoPhoto && (
        <button
          type="button"
          onClick={() => onChange(demoPhoto)}
          className="flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline"
        >
          <ImagePlus className="size-3.5" /> Use demo photo
        </button>
      )}
    </div>
  );
}
