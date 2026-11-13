import { Link, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { FooterNote, Logo } from "@/components/sitesignal/brand";
import type { Role } from "@/lib/hazards";
import { cn } from "@/lib/utils";

export type TabPath = "/worker/report" | "/worker/reports" | "/manager/dashboard" | "/manager/risks";
export interface TabItem {
  to: TabPath;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

function RoleSwitch({ role, onSwitch }: { role: Role; onSwitch?: (role: Role) => void }) {
  const navigate = useNavigate();
  const go = (next: Role) => {
    if (next === role) return;
    if (onSwitch) return onSwitch(next);
    navigate({ to: next === "worker" ? "/worker/report" : "/manager/dashboard" });
  };
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="label-caps text-[0.58rem]">Switch role</span>
      <div role="group" aria-label="Switch role" className="flex rounded-full border bg-card p-0.5">
        {(["worker", "manager"] as const).map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={role === r}
            onClick={() => go(r)}
            className={cn(
              "rounded-full px-3 py-1 font-display text-sm font-bold transition-colors",
              role === r ? "bg-signal text-signal-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {r === "worker" ? "Worker" : "Manager"}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AppShell({
  role,
  tabs,
  onSwitchRole,
  children,
}: {
  role: Role;
  tabs?: TabItem[];
  onSwitchRole?: (role: Role) => void;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background shadow-frame">
      <div className="hazard-stripe h-1.5 w-full" aria-hidden />
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <Link to="/" aria-label="SiteSignal home">
          <Logo />
        </Link>
        <RoleSwitch role={role} onSwitch={onSwitchRole} />
      </header>
      <main className={cn("flex-1 px-4 pt-5", tabs ? "pb-28" : "pb-10")}>
        {children}
        <FooterNote />
      </main>
      {tabs && (
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-md border-t bg-card/95 backdrop-blur"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group relative flex h-[4.5rem] flex-col items-center justify-center gap-1 text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <span className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-primary opacity-0 transition-opacity group-data-[status=active]:opacity-100" />
              <span className="relative">
                <t.icon className="size-6" strokeWidth={2.25} />
                {t.badge ? (
                  <span className="absolute -right-3 -top-1.5 grid min-w-5 place-items-center rounded-full bg-sev-high px-1 font-mono text-[0.6rem] font-bold text-destructive-foreground">
                    {t.badge}
                  </span>
                ) : null}
              </span>
              <span className="font-display text-sm font-bold uppercase tracking-wide">{t.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export function PageTitle({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-5">
      {kicker && <p className="label-caps mb-1 text-primary">{kicker}</p>}
      <h1 className="font-display text-4xl font-extrabold leading-none">{title}</h1>
      {children && <div className="mt-2 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}
