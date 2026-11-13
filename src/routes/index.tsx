import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Camera, EyeOff, HardHat, Mic, ShieldCheck } from "lucide-react";

import { FooterNote, Logo } from "@/components/sitesignal/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SiteSignal – Snap it, say it, stay safe" },
      {
        name: "description",
        content:
          "Report construction site hazards in seconds with a photo and a voice note. Workers report, managers act.",
      },
      { property: "og:title", content: "SiteSignal – Snap it, say it, stay safe" },
      {
        property: "og:description",
        content: "Report construction site hazards in seconds with a photo and a voice note.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const BENEFITS = [
  {
    icon: Camera,
    icon2: Mic,
    title: "Photo + voice note",
    body: "Snap the hazard and say what's wrong. AI turns it into a clear report.",
  },
  {
    icon: EyeOff,
    title: "Report anonymously",
    body: "Speak up without your name attached. Safety first, no blame.",
  },
  {
    icon: BadgeCheck,
    title: "See it get fixed",
    body: "Track every report until it's resolved — with an after photo.",
  },
];

function Onboarding() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background bg-hero-glow shadow-frame">
      <div className="hazard-stripe h-1.5 w-full" aria-hidden />
      <header className="px-5 pt-5">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col px-5 pb-8 pt-10">
        <p className="label-caps mb-3 text-signal">Construction hazard reporting</p>
        <h1 className="font-display text-[3.6rem] font-black leading-[0.88]">
          Snap it,
          <br />
          say it,
          <br />
          <span className="text-primary">stay safe.</span>
        </h1>

        <ul className="mt-8 space-y-3">
          {BENEFITS.map((b) => (
            <li key={b.title} className="flex items-start gap-4 rounded-xl border-2 border-border bg-card p-4">
              <span className="flex shrink-0 items-center gap-0.5 rounded-lg bg-surface p-2.5 text-signal">
                <b.icon className="size-6" />
                {b.icon2 && <b.icon2 className="size-6" />}
              </span>
              <div>
                <h2 className="font-display text-xl font-bold uppercase leading-tight">{b.title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{b.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 space-y-3">
          <Button asChild variant="hero" size="xl" className="w-full justify-start">
            <Link to="/worker/report">
              <HardHat /> I'm a worker
            </Link>
          </Button>
          <Button asChild variant="panel" size="xl" className="h-auto min-h-16 w-full justify-start whitespace-normal py-3 text-left font-display text-lg uppercase">
            <Link to="/manager/dashboard">
              <ShieldCheck className="text-teal" /> I'm a site manager / safety officer
            </Link>
          </Button>
        </div>

        <FooterNote />
      </main>
    </div>
  );
}
