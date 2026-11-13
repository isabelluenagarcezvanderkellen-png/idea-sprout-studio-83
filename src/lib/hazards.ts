import guardrailImg from "@/assets/hazard-guardrail.jpg";
import cableImg from "@/assets/hazard-cable.jpg";
import excavationImg from "@/assets/hazard-excavation.jpg";
import ppeImg from "@/assets/hazard-ppe.jpg";
import palletsImg from "@/assets/hazard-pallets.jpg";
import wetSlabImg from "@/assets/hazard-wetslab.jpg";
import stairImg from "@/assets/hazard-stair.jpg";
import afterTidyImg from "@/assets/after-tidy.jpg";

export type Role = "worker" | "manager";
export type Severity = "Low" | "Medium" | "High";
export type Status = "Pending review" | "In progress" | "Resolved";
export type ReportType = "Hazardous condition" | "Near-miss";

export const CATEGORIES = [
  "Fall from height",
  "Vehicles & machinery",
  "Excavation",
  "Lifting",
  "Slip/Trip",
  "Electrical",
  "Materials",
  "Tools",
  "Missing PPE",
  "Housekeeping",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const ZONES = [
  "Tower B Level 4",
  "Tower B",
  "Access Route 2",
  "South Foundation Trench",
  "West Laydown Yard",
  "Level 2",
  "Core A Level 3",
  "Crane Base",
  "North Gate",
] as const;

export const SEVERITIES: Severity[] = ["Low", "Medium", "High"];
export const SEVERITY_RANK: Record<Severity, number> = { High: 3, Medium: 2, Low: 1 };

/** Below this AI confidence a report is flagged for immediate manager review. */
export const LOW_CONFIDENCE_THRESHOLD = 0.6;

export const DEMO_AFTER_PHOTO = afterTidyImg;
export const DEMO_REPORT_PHOTO = stairImg;

export const ASSIGNEES = [
  "Site supervisor – M. Ribeiro",
  "Scaffolding crew – Team 3",
  "Electrical subcontractor – J. Costa",
  "Groundworks foreman – A. Silva",
  "Logistics lead – P. Nunes",
];

export interface HazardReport {
  id: string;
  title: string;
  zone: string;
  category: Category;
  type: ReportType;
  /** Severity the worker selected. */
  reportedSeverity: Severity;
  aiSeverity: Severity;
  aiConfidence: number;
  /** Set once a manager confirms (or overrides) the AI suggestion. */
  confirmedSeverity?: Severity;
  status: Status;
  anonymous: boolean;
  reporter?: string;
  mine: boolean;
  photo?: string;
  afterPhoto?: string;
  actionTaken?: string;
  assignedTo?: string;
  plannedAction?: string;
  transcription: string;
  aiSummary: string;
  minutesAgo: number;
}

export const INITIAL_REPORTS: HazardReport[] = [
  {
    id: "SS-1048",
    title: "Unsecured toe-board and loose guardrail near hoist",
    zone: "Tower B Level 4",
    category: "Fall from height",
    type: "Hazardous condition",
    reportedSeverity: "High",
    aiSeverity: "High",
    aiConfidence: 0.91,
    status: "Pending review",
    anonymous: false,
    reporter: "R. Mendes",
    mine: true,
    photo: guardrailImg,
    transcription:
      "Toe-board's missing next to the hoist on level four and the guardrail is loose — it moves when you lean on it. Someone could go straight over.",
    aiSummary:
      "Open edge at hoist landing with missing toe-board and loose guardrail. Risk of fall from height and falling objects onto the hoist base below.",
    minutesAgo: 12,
  },
  {
    id: "SS-1047",
    title: "Exposed 400V temporary cable across vehicle route",
    zone: "Access Route 2",
    category: "Electrical",
    type: "Hazardous condition",
    reportedSeverity: "High",
    aiSeverity: "High",
    aiConfidence: 0.88,
    status: "In progress",
    anonymous: true,
    mine: false,
    photo: cableImg,
    assignedTo: "Electrical subcontractor – J. Costa",
    plannedAction: "Re-route cable overhead or bury in protective ducting with a cable ramp.",
    transcription:
      "There's a big orange cable lying right across route two, dumpers are driving over it all morning. It's the 400 volt one from the genny.",
    aiSummary:
      "Live 400V temporary supply cable unprotected across an active vehicle route. Repeated crushing by plant risks insulation damage and electrocution.",
    minutesAgo: 47,
  },
  {
    id: "SS-1046",
    title: "Unbarricaded excavation edge",
    zone: "South Foundation Trench",
    category: "Excavation",
    type: "Hazardous condition",
    reportedSeverity: "Medium",
    aiSeverity: "High",
    aiConfidence: 0.54,
    status: "Pending review",
    anonymous: false,
    reporter: "T. Okafor",
    mine: false,
    photo: excavationImg,
    transcription:
      "South trench has no barriers on the long side, edge is crumbling a bit. People are walking right along it to get to the rebar.",
    aiSummary:
      "Deep excavation with no edge protection and signs of edge instability next to a pedestrian path. Fall and collapse risk.",
    minutesAgo: 95,
  },
  {
    id: "SS-1045",
    title: "Worker without helmet under crane load",
    zone: "Tower B",
    category: "Missing PPE",
    type: "Near-miss",
    reportedSeverity: "High",
    aiSeverity: "High",
    aiConfidence: 0.79,
    status: "Pending review",
    anonymous: true,
    mine: false,
    photo: ppeImg,
    transcription:
      "Guy was standing under the steel beams while the crane was lifting, no helmet on. Nothing fell but it was close.",
    aiSummary:
      "Near-miss: person without head protection inside the exclusion zone of a suspended load. Breach of lifting plan and PPE rules.",
    minutesAgo: 180,
  },
  {
    id: "SS-1044",
    title: "Unstable masonry pallets",
    zone: "West Laydown Yard",
    category: "Materials",
    type: "Hazardous condition",
    reportedSeverity: "Medium",
    aiSeverity: "Medium",
    aiConfidence: 0.57,
    status: "In progress",
    anonymous: false,
    reporter: "R. Mendes",
    mine: true,
    photo: palletsImg,
    assignedTo: "Logistics lead – P. Nunes",
    plannedAction: "Restack blocks on level ground and re-wrap pallets.",
    transcription:
      "Block pallets in the west yard are leaning, a few have already fallen off and broken. Wrap is torn.",
    aiSummary:
      "Leaning, partially collapsed masonry block stacks with damaged wrapping. Risk of crush injury to people retrieving materials.",
    minutesAgo: 320,
  },
  {
    id: "SS-1043",
    title: "Wet slab without signage",
    zone: "Level 2",
    category: "Slip/Trip",
    type: "Hazardous condition",
    reportedSeverity: "Low",
    aiSeverity: "Medium",
    aiConfidence: 0.74,
    status: "Pending review",
    anonymous: false,
    reporter: "D. Faria",
    mine: false,
    photo: wetSlabImg,
    transcription:
      "Level two slab is soaking wet after the curing, there's no signs up and people are walking through with materials.",
    aiSummary:
      "Large wet slab area on a busy walkway with no warning signage. Slip risk while carrying loads.",
    minutesAgo: 410,
  },
  {
    id: "SS-1039",
    title: "Stair landing blocked with offcuts and rebar",
    zone: "Core A Level 3",
    category: "Housekeeping",
    type: "Hazardous condition",
    reportedSeverity: "Medium",
    aiSeverity: "Low",
    aiConfidence: 0.83,
    confirmedSeverity: "Medium",
    status: "Resolved",
    anonymous: false,
    reporter: "R. Mendes",
    mine: true,
    photo: stairImg,
    afterPhoto: afterTidyImg,
    assignedTo: "Site supervisor – M. Ribeiro",
    actionTaken:
      "Offcuts and rebar cleared, hoses hung on wall hooks, landing swept and warning sign placed.",
    transcription:
      "Core A stair landing on three is full of timber offcuts and rebar, you have to step over it to get down.",
    aiSummary:
      "Escape stair landing obstructed by waste timber and loose rebar. Trip hazard on a primary access and egress route.",
    minutesAgo: 2880,
  },
];

export function effectiveSeverity(r: HazardReport): Severity {
  return r.confirmedSeverity ?? r.aiSeverity;
}

export function isLowConfidence(r: HazardReport): boolean {
  return r.aiConfidence < LOW_CONFIDENCE_THRESHOLD;
}

/** Open, not yet confirmed by a manager, and either high severity or low AI confidence. */
export function needsImmediateReview(r: HazardReport): boolean {
  if (r.status === "Resolved" || r.confirmedSeverity) return false;
  return effectiveSeverity(r) === "High" || isLowConfidence(r);
}

/** Open risks: everything not resolved, highest severity first, then flagged, then newest. */
export function sortOpenRisks(reports: HazardReport[]): HazardReport[] {
  return reports
    .filter((r) => r.status !== "Resolved")
    .sort((a, b) => {
      const sev = SEVERITY_RANK[effectiveSeverity(b)] - SEVERITY_RANK[effectiveSeverity(a)];
      if (sev !== 0) return sev;
      const flag = Number(needsImmediateReview(b)) - Number(needsImmediateReview(a));
      if (flag !== 0) return flag;
      return a.minutesAgo - b.minutesAgo;
    });
}

export const MOCK_TRANSCRIPT =
  "Guardrail on the east edge of level three is missing a clamp and the toe-board's gone. Materials are stacked right up against it — anything could get kicked off onto the walkway below.";

/** Every new worker report gets this mocked AI triage result. */
export const MOCK_AI_TRIAGE = { severity: "High" as Severity, confidence: 0.82 };

export interface NewReportInput {
  photo?: string;
  transcription: string;
  type: ReportType;
  category: Category;
  zone: string;
  severity: Severity;
  anonymous: boolean;
}

function titleFrom(input: NewReportInput): string {
  const first = input.transcription.trim().split(/[.!?—]/)[0]?.trim();
  if (first && first.length >= 12) {
    return first.length > 72 ? `${first.slice(0, 69).trimEnd()}…` : first;
  }
  return `${input.category} ${input.type === "Near-miss" ? "near-miss" : "hazard"}`;
}

export function createWorkerReport(input: NewReportInput, id: string): HazardReport {
  const kind = input.type === "Near-miss" ? "near-miss" : "hazardous condition";
  return {
    id,
    title: titleFrom(input),
    zone: input.zone,
    category: input.category,
    type: input.type,
    reportedSeverity: input.severity,
    aiSeverity: MOCK_AI_TRIAGE.severity,
    aiConfidence: MOCK_AI_TRIAGE.confidence,
    status: "Pending review",
    anonymous: input.anonymous,
    reporter: input.anonymous ? undefined : "R. Mendes",
    mine: true,
    photo: input.photo,
    transcription: input.transcription.trim() || "No voice note recorded.",
    aiSummary: `Worker reports a ${kind} (${input.category.toLowerCase()}) at ${input.zone}. Photo and voice note indicate people are exposed now; recommend isolating the area until a competent person inspects it.`,
    minutesAgo: 0,
  };
}

export function aiTriageLine(r: HazardReport): string {
  return `AI suggested severity: ${r.aiSeverity} (confidence ${Math.round(r.aiConfidence * 100)}%) – pending manager review`;
}

/** Demo baselines shown on the manager dashboard before any new reports arrive. */
export const KPI_BASELINE = { open: 14, high: 3, week: 42, avgTimeToAction: "48m" };

function openCount(list: HazardReport[]) {
  return list.filter((r) => r.status !== "Resolved").length;
}
function openHighCount(list: HazardReport[]) {
  return list.filter((r) => r.status !== "Resolved" && effectiveSeverity(r) === "High").length;
}

/** KPIs = demo baseline adjusted by whatever changed in this session. */
export function computeKpis(reports: HazardReport[], initial: HazardReport[] = INITIAL_REPORTS) {
  const initialIds = new Set(initial.map((r) => r.id));
  const added = reports.filter((r) => !initialIds.has(r.id)).length;
  return {
    open: KPI_BASELINE.open + openCount(reports) - openCount(initial),
    high: Math.max(0, KPI_BASELINE.high + openHighCount(reports) - openHighCount(initial)),
    week: KPI_BASELINE.week + added,
    avgTimeToAction: KPI_BASELINE.avgTimeToAction,
  };
}

const CATEGORY_BASELINE: Record<Category, number> = {
  "Fall from height": 9,
  "Vehicles & machinery": 6,
  Excavation: 4,
  Lifting: 3,
  "Slip/Trip": 7,
  Electrical: 4,
  Materials: 3,
  Tools: 1,
  "Missing PPE": 3,
  Housekeeping: 2,
};

export function categoryCounts(reports: HazardReport[], initial: HazardReport[] = INITIAL_REPORTS) {
  const initialIds = new Set(initial.map((r) => r.id));
  const counts = { ...CATEGORY_BASELINE };
  for (const r of reports) if (!initialIds.has(r.id)) counts[r.category] += 1;
  return CATEGORIES.map((c) => ({ category: c, count: counts[c] })).sort(
    (a, b) => b.count - a.count,
  );
}

const ZONE_BASELINE: Record<string, number> = {
  "Tower B Level 4": 11,
  "Access Route 2": 8,
  "South Foundation Trench": 6,
  "West Laydown Yard": 5,
  "Level 2": 4,
};

export function hotspotZones(reports: HazardReport[], initial: HazardReport[] = INITIAL_REPORTS) {
  const initialIds = new Set(initial.map((r) => r.id));
  const counts: Record<string, number> = { ...ZONE_BASELINE };
  for (const r of reports) if (!initialIds.has(r.id)) counts[r.zone] = (counts[r.zone] ?? 0) + 1;
  return Object.entries(counts)
    .map(([zone, count]) => ({
      zone,
      count,
      openHigh: reports.filter(
        (r) => r.zone === zone && r.status !== "Resolved" && effectiveSeverity(r) === "High",
      ).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function canResolve(afterPhoto?: string): boolean {
  return Boolean(afterPhoto);
}

export function formatAgo(minutes: number): string {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / (60 * 24))}d ago`;
}
