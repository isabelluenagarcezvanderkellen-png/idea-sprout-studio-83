import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

import {
  INITIAL_REPORTS,
  canResolve,
  createWorkerReport,
  type HazardReport,
  type NewReportInput,
  type Severity,
} from "@/lib/hazards";

interface HazardStore {
  reports: HazardReport[];
  getReport: (id: string) => HazardReport | undefined;
  submitReport: (input: NewReportInput) => HazardReport;
  confirmSeverity: (id: string, severity: Severity) => void;
  assignAction: (id: string, assignee: string, plannedAction: string) => void;
  resolveReport: (id: string, afterPhoto: string, actionTaken: string) => boolean;
}

const HazardContext = createContext<HazardStore | null>(null);

/** In-memory demo state shared by worker and manager views (no backend). */
export function HazardProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<HazardReport[]>(INITIAL_REPORTS);
  const nextId = useRef(1049);

  const update = useCallback((id: string, patch: (r: HazardReport) => Partial<HazardReport>) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch(r) } : r)));
  }, []);

  const value = useMemo<HazardStore>(
    () => ({
      reports,
      getReport: (id) => reports.find((r) => r.id === id),
      submitReport: (input) => {
        const report = createWorkerReport(input, `SS-${nextId.current++}`);
        setReports((prev) => [report, ...prev]);
        return report;
      },
      confirmSeverity: (id, severity) => update(id, () => ({ confirmedSeverity: severity })),
      assignAction: (id, assignee, plannedAction) =>
        update(id, (r) => ({
          assignedTo: assignee,
          plannedAction,
          status: r.status === "Resolved" ? r.status : "In progress",
        })),
      resolveReport: (id, afterPhoto, actionTaken) => {
        if (!canResolve(afterPhoto)) return false;
        update(id, (r) => ({
          afterPhoto,
          actionTaken: actionTaken.trim() || "Hazard made safe and verified on site.",
          status: "Resolved",
          confirmedSeverity: r.confirmedSeverity ?? r.aiSeverity,
        }));
        return true;
      },
    }),
    [reports, update],
  );

  return <HazardContext.Provider value={value}>{children}</HazardContext.Provider>;
}

export function useHazards() {
  const ctx = useContext(HazardContext);
  if (!ctx) throw new Error("useHazards must be used inside HazardProvider");
  return ctx;
}
