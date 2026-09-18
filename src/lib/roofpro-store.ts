import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { id } from "./utils";

export type LeadStatus = "new" | "contacted" | "inspection" | "estimate" | "won" | "lost";
export type JobPhase = "inspection" | "estimate" | "production" | "invoicing" | "completed";
export type EventType = "inspection" | "production" | "meeting" | "followup";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  source: string;
  status: LeadStatus;
  assigned: string;
  dps: number;
  storm: string | null;
  notes: string;
  createdAt: string;
};

export type Job = {
  id: string;
  leadId: string | null;
  name: string;
  address: string;
  phase: JobPhase;
  crew: string;
  start: string;
  end: string;
  price: number;
  cost: number;
  createdAt: string;
};

export type EstimateItem = { id: string; description: string; qty: number; unit: string; unitPrice: number };
export type Estimate = {
  id: string;
  jobId: string;
  name: string;
  status: "draft" | "sent" | "approved";
  items: EstimateItem[];
};

export type FeedPost = {
  id: string;
  jobId: string;
  author: string;
  body: string;
  kind: "note" | "system" | "photo";
  createdAt: string;
};

export type CalEvent = {
  id: string;
  jobId: string | null;
  title: string;
  type: EventType;
  start: string;
  end: string;
  who: string;
};

const CREW = ["Torres crew", "Hale crew", "Sales — Dana", "Sales — Malik", "Office"];

function iso(days: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function seed(): {
  leads: Lead[];
  jobs: Job[];
  estimates: Estimate[];
  feed: FeedPost[];
  events: CalEvent[];
} {
  const l1 = id("lead");
  const l2 = id("lead");
  const l3 = id("lead");
  const l4 = id("lead");
  const l5 = id("lead");
  const l6 = id("lead");
  const j1 = id("job");
  const j2 = id("job");
  const j3 = id("job");
  const j4 = id("job");
  const leads: Lead[] = [
    {
      id: l1, name: "Renee Calderon", phone: "(817) 555-0144", email: "renee.c@example.net",
      address: "412 Willow Park Dr", city: "Burleson", state: "TX", source: "Recon / hail",
      status: "inspection", assigned: "Sales — Dana", dps: 91, storm: "DFW supercell 04 Sep",
      notes: "2.0\" hail MESH, 19yr composition. Same-day inspect.", createdAt: iso(-2, 9),
    },
    {
      id: l2, name: "Marcus Hale", phone: "(682) 555-0190", email: "mhale@example.net",
      address: "8801 Trail Ridge Ct", city: "Fort Worth", state: "TX", source: "Geofence harvest",
      status: "estimate", assigned: "Sales — Malik", dps: 78, storm: "DFW supercell 04 Sep",
      notes: "Neighbor of Calderon. Gutter dents, garage oxidation.", createdAt: iso(-2, 11),
    },
    {
      id: l3, name: "Priya Shah", phone: "(214) 555-0118", email: "priya.shah@example.net",
      address: "19 Swiss Ave", city: "Dallas", state: "TX", source: "Web form",
      status: "new", assigned: "Sales — Dana", dps: 44, storm: null,
      notes: "Garage door inquiry, no storm.", createdAt: iso(-1, 14),
    },
    {
      id: l4, name: "Owen Briggs", phone: "(405) 555-0177", email: "obr@example.net",
      address: "2501 Classen Blvd", city: "Oklahoma City", state: "OK", source: "Radar dispatch",
      status: "contacted", assigned: "Sales — Malik", dps: 86, storm: "OKC bow echo",
      notes: "Warning polygon overlap. Wind + hail.", createdAt: iso(0, 8),
    },
    {
      id: l5, name: "Elena Ruiz", phone: "(813) 555-0133", email: "eruiz@example.net",
      address: "441 Bayshore Blvd", city: "Tampa", state: "FL", source: "Referral",
      status: "won", assigned: "Torres crew", dps: 62, storm: null,
      notes: "Tile roof, insurance supplement in flight.", createdAt: iso(-8, 10),
    },
    {
      id: l6, name: "Closed — no damage", phone: "", email: "",
      address: "100 Main St", city: "Arlington", state: "TX", source: "Canvass",
      status: "lost", assigned: "Sales — Dana", dps: 22, storm: "DFW supercell 04 Sep",
      notes: "Metal roof, no hits.", createdAt: iso(-3, 16),
    },
  ];
  const jobs: Job[] = [
    {
      id: j1, leadId: l5, name: "Ruiz — tile roof", address: "441 Bayshore Blvd, Tampa FL",
      phase: "production", crew: "Torres crew", start: iso(0, 7), end: iso(2, 16),
      price: 28400, cost: 17100, createdAt: iso(-6, 9),
    },
    {
      id: j2, leadId: l1, name: "Calderon — hail roof", address: "412 Willow Park Dr, Burleson TX",
      phase: "inspection", crew: "Hale crew", start: iso(0, 13), end: iso(0, 15),
      price: 0, cost: 0, createdAt: iso(-2, 9),
    },
    {
      id: j3, leadId: l2, name: "Hale — garage + gutters", address: "8801 Trail Ridge Ct, Fort Worth TX",
      phase: "estimate", crew: "Sales — Malik", start: iso(1, 10), end: iso(1, 11),
      price: 6400, cost: 3100, createdAt: iso(-2, 12),
    },
    {
      id: j4, leadId: l5, name: "Ruiz — supplement", address: "441 Bayshore Blvd, Tampa FL",
      phase: "invoicing", crew: "Office", start: iso(-1, 9), end: iso(0, 17),
      price: 4100, cost: 900, createdAt: iso(-1, 9),
    },
  ];
  const estimates: Estimate[] = [
    {
      id: id("est"), jobId: j3, name: "Hale exterior", status: "sent",
      items: [
        { id: id("li"), description: "Carriage garage door, 16×7", qty: 1, unit: "ea", unitPrice: 2850 },
        { id: id("li"), description: "5-inch gutters, front elevation", qty: 42, unit: "lf", unitPrice: 18 },
        { id: id("li"), description: "Dump + haul", qty: 1, unit: "ls", unitPrice: 420 },
      ],
    },
    {
      id: id("est"), jobId: j1, name: "Ruiz tile — approved", status: "approved",
      items: [
        { id: id("li"), description: "Concrete tile reroof, 32 sq", qty: 32, unit: "sq", unitPrice: 720 },
        { id: id("li"), description: "Underlayment + flashings", qty: 1, unit: "ls", unitPrice: 2800 },
        { id: id("li"), description: "Permit / dump", qty: 1, unit: "ls", unitPrice: 960 },
      ],
    },
  ];
  const feed: FeedPost[] = [
    { id: id("post"), jobId: j2, author: "system", body: "Job opened from Recon Engine — DPS 91 CRITICAL.", kind: "system", createdAt: iso(-2, 9) },
    { id: id("post"), jobId: j2, author: "Dana", body: "Homeowner home after 1pm. Bring MESH print and neighbor comps.", kind: "note", createdAt: iso(-1, 16) },
    { id: id("post"), jobId: j1, author: "Torres", body: "Tear-off 60% complete. Two extra pitch-change valleys — writing a change order.", kind: "note", createdAt: iso(0, 11) },
    { id: id("post"), jobId: j1, author: "system", body: "Phase moved to Production.", kind: "system", createdAt: iso(-4, 8) },
    { id: id("post"), jobId: j3, author: "Malik", body: "Estimate sent via portal. Follow-up Thursday.", kind: "note", createdAt: iso(-1, 15) },
  ];
  const events: CalEvent[] = [
    { id: id("evt"), jobId: j2, title: "Inspect Calderon", type: "inspection", start: iso(0, 13), end: iso(0, 15), who: "Hale crew" },
    { id: id("evt"), jobId: j1, title: "Ruiz production", type: "production", start: iso(0, 7), end: iso(0, 16), who: "Torres crew" },
    { id: id("evt"), jobId: j3, title: "Hale estimate follow-up", type: "followup", start: iso(1, 10), end: iso(1, 11), who: "Sales — Malik" },
    { id: id("evt"), jobId: j1, title: "Ruiz production day 2", type: "production", start: iso(1, 7), end: iso(1, 16), who: "Torres crew" },
    { id: id("evt"), jobId: null, title: "Storm desk standup", type: "meeting", start: iso(0, 8), end: iso(0, 8.5), who: "Office" },
  ];
  return { leads, jobs, estimates, feed, events };
}

type Tab = "pipeline" | "jobs" | "calendar" | "feed" | "estimates";

type State = {
  leads: Lead[];
  jobs: Job[];
  estimates: Estimate[];
  feed: FeedPost[];
  events: CalEvent[];
  tab: Tab;
  selectedJobId: string | null;
  selectedLeadId: string | null;
};

type Actions = {
  setTab: (t: Tab) => void;
  selectJob: (id: string | null) => void;
  selectLead: (id: string | null) => void;
  setLeadStatus: (id: string, status: LeadStatus) => void;
  setJobPhase: (id: string, phase: JobPhase) => void;
  addLead: (partial: Partial<Lead> & Pick<Lead, "name" | "address">) => string;
  addJobFromLead: (leadId: string) => string;
  addFeed: (jobId: string, body: string, author?: string) => void;
  addEvent: (e: Omit<CalEvent, "id">) => void;
};

const memoryStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

export const CREW_OPTIONS = CREW;

export const useRoofproStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...seed(),
      tab: "pipeline",
      selectedJobId: null,
      selectedLeadId: null,
      setTab: (t) => set({ tab: t }),
      selectJob: (id) => set({ selectedJobId: id, tab: id ? "jobs" : get().tab }),
      selectLead: (id) => set({ selectedLeadId: id }),
      setLeadStatus: (id, status) =>
        set({ leads: get().leads.map((l) => (l.id === id ? { ...l, status } : l)) }),
      setJobPhase: (id, phase) =>
        set({ jobs: get().jobs.map((j) => (j.id === id ? { ...j, phase } : j)) }),
      addLead: (partial) => {
        const lid = id("lead");
        const lead: Lead = {
          id: lid,
          phone: "",
          email: "",
          city: "",
          state: "",
          source: "Manual",
          status: "new",
          assigned: "Sales — Dana",
          dps: 0,
          storm: null,
          notes: "",
          createdAt: new Date().toISOString(),
          ...partial,
        };
        set({ leads: [lead, ...get().leads], selectedLeadId: lid, tab: "pipeline" });
        return lid;
      },
      addJobFromLead: (leadId) => {
        const lead = get().leads.find((l) => l.id === leadId);
        const jid = id("job");
        const job: Job = {
          id: jid,
          leadId,
          name: lead ? `${lead.name} — field` : "New job",
          address: lead ? `${lead.address}, ${lead.city} ${lead.state}` : "",
          phase: "inspection",
          crew: "Hale crew",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 2 * 3600_000).toISOString(),
          price: 0,
          cost: 0,
          createdAt: new Date().toISOString(),
        };
        set({
          jobs: [job, ...get().jobs],
          selectedJobId: jid,
          tab: "jobs",
          feed: [
            {
              id: id("post"),
              jobId: jid,
              author: "system",
              body: `Job opened from lead ${lead?.name ?? leadId}.`,
              kind: "system",
              createdAt: new Date().toISOString(),
            },
            ...get().feed,
          ],
        });
        return jid;
      },
      addFeed: (jobId, body, author = "You") =>
        set({
          feed: [
            { id: id("post"), jobId, author, body, kind: "note", createdAt: new Date().toISOString() },
            ...get().feed,
          ],
        }),
      addEvent: (e) => set({ events: [{ ...e, id: id("evt") }, ...get().events] }),
    }),
    {
      name: "roofpro-v1",
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      partialize: (s) => ({
        leads: s.leads,
        jobs: s.jobs,
        estimates: s.estimates,
        feed: s.feed,
        events: s.events,
      }),
    },
  ),
);

export function estimateTotal(e: Estimate) {
  return e.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
}
