import { useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePropertyStore } from "@/lib/property-store";
import {
  estimateTotal,
  useRoofproStore,
  type JobPhase,
  type LeadStatus,
} from "@/lib/roofpro-store";
import { compactUsd } from "@/lib/utils";

const STATUSES: LeadStatus[] = ["new", "contacted", "inspection", "estimate", "won", "lost"];
const PHASES: JobPhase[] = ["inspection", "estimate", "production", "invoicing", "completed"];

export function RoofproWorkspace() {
  const tab = useRoofproStore((s) => s.tab);
  const setTab = useRoofproStore((s) => s.setTab);
  const leads = useRoofproStore((s) => s.leads);
  const jobs = useRoofproStore((s) => s.jobs);
  const estimates = useRoofproStore((s) => s.estimates);
  const feed = useRoofproStore((s) => s.feed);
  const events = useRoofproStore((s) => s.events);
  const selectedJobId = useRoofproStore((s) => s.selectedJobId);
  const selectJob = useRoofproStore((s) => s.selectJob);
  const setLeadStatus = useRoofproStore((s) => s.setLeadStatus);
  const setJobPhase = useRoofproStore((s) => s.setJobPhase);
  const addLead = useRoofproStore((s) => s.addLead);
  const addJobFromLead = useRoofproStore((s) => s.addJobFromLead);
  const addFeed = useRoofproStore((s) => s.addFeed);
  const dossier = usePropertyStore((s) => s.dossier);
  const [note, setNote] = useState("");
  const [draftName, setDraftName] = useState("");

  const job = jobs.find((j) => j.id === selectedJobId) ?? jobs[0];
  const jobFeed = feed.filter((f) => f.jobId === job?.id);
  const margin = useMemo(() => {
    const priced = jobs.filter((j) => j.price > 0);
    const revenue = priced.reduce((s, j) => s + j.price, 0);
    const cost = priced.reduce((s, j) => s + j.cost, 0);
    return { revenue, cost, profit: revenue - cost };
  }, [jobs]);

  const openFromScout = () => {
    if (!dossier) return;
    addLead({
      name: dossier.pin.address,
      address: dossier.pin.address,
      city: dossier.pin.city,
      state: dossier.pin.state,
      source: "Scout dossier",
      dps: dossier.dps.score,
      storm: null,
      notes: `DPS ${dossier.dps.score}. AVM ${compactUsd(dossier.valuation.estimate)}.`,
      status: "new",
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl">RoofPro</h1>
          <p className="text-sm text-muted-foreground">
            Pipeline, jobs, and margin. This desk stays on this browser — it is not a multi-crew login.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-md border border-border px-2 py-1">Revenue {compactUsd(margin.revenue)}</span>
          <span className="rounded-md border border-border px-2 py-1">Cost {compactUsd(margin.cost)}</span>
          <span className="rounded-md border border-border px-2 py-1">Gross {compactUsd(margin.profit)}</span>
        </div>
      </header>
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-3 py-2">
        {(["pipeline", "jobs", "calendar", "feed", "estimates"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`h-9 shrink-0 rounded-md border px-3 text-xs uppercase tracking-wider ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
        <Button type="button" size="sm" variant="outline" className="ml-auto shrink-0" onClick={openFromScout} disabled={!dossier}>
          Lead from scout
        </Button>
      </div>

      {tab === "pipeline" && (
        <div className="min-h-0 flex-1 overflow-x-auto">
          <div className="flex h-full min-w-max gap-3 p-3">
            {STATUSES.map((status) => (
              <section key={status} className="flex w-64 flex-col rounded-lg border border-border bg-card">
                <header className="border-b border-border px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {status} · {leads.filter((l) => l.status === status).length}
                </header>
                <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                  {leads
                    .filter((l) => l.status === status)
                    .map((l) => (
                      <li key={l.id} className="rounded-md border border-border bg-background p-2">
                        <p className="text-sm">{l.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {l.address}, {l.city}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          DPS {l.dps} · {l.source}
                          {l.storm ? ` · ${l.storm}` : ""}
                        </p>
                        <div className="mt-2 flex gap-1">
                          <select
                            className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background px-1 text-xs"
                            value={l.status}
                            onChange={(e) => setLeadStatus(l.id, e.target.value as LeadStatus)}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <Button type="button" size="sm" variant="ghost" onClick={() => addJobFromLead(l.id)}>
                            Job
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}

      {tab === "jobs" && (
        <div className="grid min-h-0 flex-1 md:grid-cols-[280px_1fr]">
          <ul className="overflow-y-auto border-b border-border md:border-b-0 md:border-r">
            {jobs.map((j) => (
              <li key={j.id}>
                <button
                  type="button"
                  onClick={() => selectJob(j.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-accent ${job?.id === j.id ? "bg-secondary" : ""}`}
                >
                  <p className="text-sm">{j.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {j.phase} · {j.crew}
                  </p>
                </button>
              </li>
            ))}
          </ul>
          {job && (
            <div className="overflow-y-auto p-4">
              <h2 className="font-display text-xl">{job.name}</h2>
              <p className="text-sm text-muted-foreground">{job.address}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="text-xs text-muted-foreground">Phase</label>
                <select
                  className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                  value={job.phase}
                  onChange={(e) => setJobPhase(job.id, e.target.value as JobPhase)}
                >
                  {PHASES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="text-sm">Price {compactUsd(job.price)}</span>
                <span className="text-sm text-muted-foreground">Cost {compactUsd(job.cost)}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {jobFeed.map((f) => (
                  <li key={f.id} className="rounded-md border border-border px-3 py-2 text-sm">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{f.author}</span>
                    <p>{f.body}</p>
                  </li>
                ))}
              </ul>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!note.trim()) return;
                  addFeed(job.id, note.trim());
                  setNote("");
                }}
              >
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Field note" />
                <Button type="submit">Post</Button>
              </form>
            </div>
          )}
        </div>
      )}

      {tab === "calendar" && (
        <ul className="min-h-0 flex-1 overflow-y-auto p-4">
          {[0, 1, 2, 3].map((offset) => {
            const day = new Date();
            day.setDate(day.getDate() + offset);
            const items = events.filter((ev) => isSameDay(new Date(ev.start), day));
            return (
              <li key={offset} className="mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{format(day, "EEEE MMM d")}</p>
                {items.length === 0 && <p className="mt-1 text-sm text-muted-foreground">Clear.</p>}
                {items.map((ev) => (
                  <p key={ev.id} className="mt-1 text-sm">
                    {format(new Date(ev.start), "h:mm a")} · {ev.title} · {ev.who}
                  </p>
                ))}
              </li>
            );
          })}
        </ul>
      )}

      {tab === "feed" && (
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {feed.map((f) => {
            const j = jobs.find((x) => x.id === f.jobId);
            return (
              <li key={f.id} className="border-b border-border px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {f.author} · {j?.name ?? "Job"} · {format(new Date(f.createdAt), "MMM d h:mm a")}
                </p>
                <p className="text-sm">{f.body}</p>
              </li>
            );
          })}
        </ul>
      )}

      {tab === "estimates" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <form
            className="mb-4 flex max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draftName.trim()) return;
              addLead({ name: draftName.trim(), address: "Address pending", source: "Manual", status: "new" });
              setDraftName("");
            }}
          >
            <Input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="New lead name" />
            <Button type="submit">Add lead</Button>
          </form>
          <ul className="space-y-3">
            {estimates.map((est) => {
              const j = jobs.find((x) => x.id === est.jobId);
              const total = estimateTotal(est);
              return (
                <li key={est.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm">
                      {est.name} · {est.status}
                    </p>
                    <p className="font-mono text-sm">{compactUsd(total)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{j?.address}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {est.items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-3">
                        <span>
                          {item.description} · {item.qty} {item.unit}
                        </span>
                        <span className="tabular text-muted-foreground">{compactUsd(item.qty * item.unitPrice)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
