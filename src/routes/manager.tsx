import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, ShieldAlert } from "lucide-react";

import { AppShell } from "@/components/sitesignal/app-shell";
import { needsImmediateReview } from "@/lib/hazards";
import { useHazards } from "@/lib/hazard-store";

export const Route = createFileRoute("/manager")({
  component: ManagerLayout,
});

function ManagerLayout() {
  const { reports } = useHazards();
  const flagged = reports.filter(needsImmediateReview).length;
  return (
    <AppShell
      role="manager"
      tabs={[
        { to: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/manager/risks", label: "Open risks", icon: ShieldAlert, badge: flagged },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
