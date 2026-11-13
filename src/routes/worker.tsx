import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ClipboardList, TriangleAlert } from "lucide-react";

import { AppShell } from "@/components/sitesignal/app-shell";

export const Route = createFileRoute("/worker")({
  component: WorkerLayout,
});

function WorkerLayout() {
  return (
    <AppShell
      role="worker"
      tabs={[
        { to: "/worker/report", label: "Report", icon: TriangleAlert },
        { to: "/worker/reports", label: "My reports", icon: ClipboardList },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
