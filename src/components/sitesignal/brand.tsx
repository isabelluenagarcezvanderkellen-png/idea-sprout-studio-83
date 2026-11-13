import { RadioTower } from "lucide-react";

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <RadioTower className="size-5" strokeWidth={2.5} />
      </span>
      <span className="font-display text-2xl font-extrabold leading-none">
        Site<span className="text-primary">Signal</span>
      </span>
    </span>
  );
}

export function FooterNote() {
  return (
    <p className="mx-auto mt-10 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
      SiteSignal supports, but does not replace, official safety inspections and professional
      judgment.
    </p>
  );
}
