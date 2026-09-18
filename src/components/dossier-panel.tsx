import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SAMPLE_PINS } from "@/lib/property-store";
import type { Dossier, NeighborhoodIntel, PropertyPin } from "@/lib/types";
import { compactUsd, formatMiles, pct, usd } from "@/lib/utils";

function dpsVariant(tier: string) {
  if (tier === "CRITICAL" || tier === "HIGH") return "danger" as const;
  if (tier === "MODERATE") return "warn" as const;
  return "ok" as const;
}

function severityVariant(s: string) {
  if (s === "critical" || s === "high") return "danger" as const;
  if (s === "moderate") return "warn" as const;
  return "ok" as const;
}

function downloadJson(dossier: Dossier) {
  const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `propertyinsight-${dossier.pin.address.replace(/\s+/g, "-").toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DossierPanel({
  dossier,
  loading,
  neighborhood,
  onSample,
}: {
  dossier: Dossier | null;
  loading: boolean;
  neighborhood: NeighborhoodIntel | null;
  onSample?: (pin: PropertyPin) => void;
}) {
  if (loading && !dossier) return <DossierSkeleton />;
  if (!dossier) {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-4 p-2">
        <p className="font-display text-2xl tracking-tight">Scout a parcel</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Search any US address, drop a pin, or scan a geofence. The dossier blends Census ACS, FEMA flood, OSM buildings, storm DPS, and a renovation ROI matrix with a five-year underwrite.
        </p>
        <div className="grid w-full gap-2">
          {SAMPLE_PINS.map((s) => (
            <Button
              key={s.pin.id}
              type="button"
              variant="outline"
              className="h-auto justify-start px-3 py-3 text-left"
              onClick={() => onSample?.(s.pin)}
            >
              <span>
                <span className="block text-sm text-foreground">{s.label}</span>
                <span className="block text-xs font-normal normal-case tracking-normal text-muted-foreground">
                  {s.blurb}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const { valuation, profile, dps, plays, condition } = dossier;
  const condEntries = Object.entries(condition);
  const asIs = dossier.scenarios[0]?.proForma;

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={dpsVariant(dps.tier)}>
            DPS {dps.score} · {dps.tier}
          </Badge>
          {dossier.enriched ? <Badge variant="ok">Grok overlay</Badge> : <Badge variant="muted">Local model</Badge>}
          {profile.occupancy !== "owner" && <Badge variant="outline">{profile.occupancy}</Badge>}
        </div>
        <h2 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">{dossier.pin.address}</h2>
        <p className="text-sm text-muted-foreground">
          {[dossier.pin.neighborhood, dossier.pin.city, dossier.pin.state, dossier.pin.postcode]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p className="text-sm leading-relaxed text-foreground/90">{dossier.thesis}</p>
        <div className="flex flex-wrap gap-2">
          {dossier.flood && (
            <Badge variant={dossier.flood.sfha ? "danger" : "muted"}>FEMA {dossier.flood.zone}</Badge>
          )}
          {dossier.census && <Badge variant="outline">ACS {dossier.census.geoid}</Badge>}
          {dossier.building && <Badge variant="outline">{dossier.building.use}</Badge>}
          <Badge variant="outline">Score {dossier.scorecard.overall}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => window.print()}>
            Print brief
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => downloadJson(dossier)}>
            Export evidence
          </Button>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-border">
        <img
          src={dossier.imageryUrl}
          alt={`Aerial of ${dossier.pin.address}`}
          className="h-40 w-full object-cover md:h-52"
          crossOrigin="anonymous"
        />
        <p className="px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          Esri World Imagery · {dossier.pin.lat.toFixed(5)}, {dossier.pin.lng.toFixed(5)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat
          label="Modeled value"
          value={compactUsd(valuation.estimate)}
          hint={`${compactUsd(valuation.low)}–${compactUsd(valuation.high)}`}
        />
        <Stat label="90% band" value={pct(valuation.confidence * 100)} hint={`${usd(valuation.psf)} / sf`} />
        <Stat label="Year / area" value={`${profile.yearBuilt}`} hint={`${profile.sqft.toLocaleString()} sf · ${profile.beds} bd`} />
        <Stat label="Top play ROI" value={pct(plays[0]?.roiPct ?? 0)} hint={plays[0]?.label} />
        <Stat label="As-is cap" value={pct((asIs?.capRate ?? 0) * 100, 1)} hint="NOI / purchase" />
        <Stat label="Gross rent" value={compactUsd(asIs?.grossRentAnnual ?? 0)} hint={`${dossier.metro.rentYield.toFixed(1)}% yield`} />
        <Stat label="PITI / mo" value={usd(dossier.carry.pitiMonthly)} hint="P&I + tax + ins" />
        <Stat label="Roof age" value={`${profile.roofAge}y`} hint={profile.roofMaterial} />
        <Stat
          label="Site score"
          value={String(dossier.scorecard.overall)}
          hint={dossier.scorecard.verdict.split(".")[0]}
        />
        <Stat
          label="IRR p50"
          value={pct(dossier.monteCarlo.irr.p50 * 100, 1)}
          hint={`${pct(dossier.monteCarlo.irr.p10 * 100, 1)}–${pct(dossier.monteCarlo.irr.p90 * 100, 1)}`}
        />
        <Stat
          label="Flood"
          value={dossier.flood?.zone ?? "—"}
          hint={dossier.flood?.sfha ? "SFHA — insurance gate" : dossier.flood?.note.slice(0, 42)}
        />
        <Stat
          label="Tract value"
          value={dossier.census?.medianHomeValue ? compactUsd(dossier.census.medianHomeValue) : "—"}
          hint={dossier.census ? `ACS ${dossier.census.geoid}` : "Pending Census overlay"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {condEntries.map(([k, v]) => (
            <div key={k} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="capitalize text-muted-foreground">{k.replace("_", " ")}</span>
                <span className="tabular text-foreground">
                  {v.score}
                  {v.ageYears != null ? ` · ${v.ageYears}y` : ""}
                </span>
              </div>
              <Progress value={v.score} />
              <p className="text-xs text-muted-foreground">{v.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ground truth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {dossier.flood && <p>{dossier.flood.note}</p>}
          {dossier.census && (
            <p className="text-muted-foreground">
              Census tract {dossier.census.geoid} · {dossier.census.name}. Population{" "}
              {dossier.census.population?.toLocaleString() ?? "—"}, median income{" "}
              {dossier.census.medianIncome ? compactUsd(dossier.census.medianIncome) : "—"}, vacancy{" "}
              {dossier.census.vacancyPct != null ? `${dossier.census.vacancyPct.toFixed(1)}%` : "—"}.
            </p>
          )}
          {dossier.building && (
            <p className="text-muted-foreground">
              OSM building tagged {dossier.building.use}
              {dossier.building.levels ? ` · ${dossier.building.levels} levels` : ""}
              {dossier.building.year ? ` · start ${dossier.building.year}` : ""}
              {dossier.building.roof ? ` · roof ${dossier.building.roof}` : ""}.
            </p>
          )}
          {!dossier.flood && !dossier.census && (
            <p className="text-muted-foreground">Census and FEMA overlays did not return for this pin.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Renovation ROI matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plays} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgb(236 234 228 / 8%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <RTooltip
                  contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
                  formatter={(v) => [`${Number(v).toFixed(1)}%`, "ROI"]}
                />
                <Bar dataKey="roiPct" fill="#8aa07a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Play</th>
                  <th className="pb-2 font-medium">Mid cost</th>
                  <th className="pb-2 font-medium">ROI</th>
                  <th className="pb-2 font-medium">Value add</th>
                </tr>
              </thead>
              <tbody>
                {plays.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <span>{p.rank}.</span>
                        <span>{p.label}</span>
                        <Badge variant={p.demand === "hot" ? "ok" : p.demand === "steady" ? "outline" : "muted"}>
                          {p.demand}
                        </Badge>
                      </div>
                    </td>
                    <td className="tabular py-2">{usd(p.costMid)}</td>
                    <td className="tabular py-2">{p.roiPct.toFixed(1)}%</td>
                    <td className="tabular py-2">{usd(p.valueAdd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Costs scaled by {dossier.metro.name} construction index {dossier.metro.costIndex.toFixed(2)}. ROI priors from NAR Cost vs. Value, residualized by condition.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storm intelligence · Recon DPS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{dps.action}</p>
          {dps.factors.map((f) => (
            <div key={f.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {f.name} · {f.weight}%
                </span>
                <span className="tabular">{f.points}</span>
              </div>
              <Progress value={f.points} />
              <p className="text-xs text-muted-foreground">{f.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metro path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dossier.appreciation} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="rgb(236 234 228 / 8%)" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#9c9a92", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => compactUsd(Number(v))}
                />
                <RTooltip
                  contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
                  formatter={(v) => [usd(Number(v)), "Modeled"]}
                />
                <Line type="monotone" dataKey="value" stroke="#8aa07a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {dossier.metro.name} · {dossier.metro.yoyAppreciation.toFixed(1)}% modeled CAGR · rent yield {dossier.metro.rentYield.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {dossier.demographics.map((d) => (
              <div key={d.label}>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{d.label}</p>
                <p className="tabular text-sm">{d.value}</p>
                <p className="text-xs text-muted-foreground">{d.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Parcel facts</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Fact k="Beds / baths" v={`${profile.beds} / ${profile.baths}`} />
            <Fact k="Stories" v={String(profile.stories)} />
            <Fact k="Lot" v={`${profile.lotSqft.toLocaleString()} sf`} />
            <Fact k="Garage" v={profile.garage} />
            <Fact k="Construction" v={profile.construction} />
            <Fact k="Occupancy" v={profile.occupancy} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dossier.risks.map((r) => (
            <div key={r.label} className="flex gap-3">
              <Badge variant={severityVariant(r.severity)}>{r.severity}</Badge>
              <div>
                <p className="text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incentives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dossier.incentives.map((i) => (
            <div key={i.name}>
              <div className="flex items-center gap-2">
                <p className="text-sm">{i.name}</p>
                <Badge variant="outline">{i.kind}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{i.valueNote}</p>
              <p className="text-xs text-muted-foreground">{i.eligibility}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Underwriting narrative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>{dossier.narrative}</p>
          <p className="text-muted-foreground">{dossier.occupancyNote}</p>
          {neighborhood && (
            <>
              <Separator />
              <p>{neighborhood.summary}</p>
              <p className="text-muted-foreground">{neighborhood.trend}</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidence chain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            {dossier.evidence.evidenceId} · overall confidence {pct(dossier.evidence.confidence.overall * 100)}
          </p>
          {dossier.evidence.sources.map((s) => (
            <p key={s.sourceId + s.sourceType}>
              {s.sourceType} · {s.sourceId} · {s.timestamp.slice(0, 16).replace("T", " ")}
            </p>
          ))}
          {dossier.evidence.assertions.map((a) => (
            <p key={a.type}>
              {a.type}: {a.value} — {a.explanation}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="capitalize">{v}</p>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl tabular tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function DossierSkeleton() {
  return (
    <div className="space-y-4 p-1">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function NeighborhoodPanel({ intel, loading }: { intel: NeighborhoodIntel | null; loading: boolean }) {
  if (loading && !intel) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-40" />
      </div>
    );
  }
  if (!intel) {
    return <p className="text-sm text-muted-foreground">Select a parcel to load neighborhood intelligence.</p>;
  }
  return (
    <div className="flex flex-col gap-4 pb-8">
      <div>
        <h2 className="font-display text-2xl tracking-tight">Neighborhood</h2>
        <p className="text-sm text-muted-foreground">{intel.pin.neighborhood || intel.pin.city}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Score label="Walk proxy" value={intel.walkScore} />
        <Score label="Transit" value={intel.transitScore} />
        <Score label="Amenity" value={intel.amenityScore} />
      </div>
      <p className="text-sm leading-relaxed">{intel.summary}</p>
      {intel.flood && (
        <div className="rounded-lg border border-border bg-card p-3 text-sm">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">FEMA NFHL</p>
          <p className={intel.flood.sfha ? "text-destructive" : ""}>
            Zone {intel.flood.zone}
            {intel.flood.subtype ? ` · ${intel.flood.subtype}` : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{intel.flood.note}</p>
        </div>
      )}
      {intel.census && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            ["Income", intel.census.medianIncome != null ? compactUsd(intel.census.medianIncome) : "—"],
            ["Home value", intel.census.medianHomeValue != null ? compactUsd(intel.census.medianHomeValue) : "—"],
            ["Rent", intel.census.medianRent != null ? compactUsd(intel.census.medianRent) : "—"],
            ["Owner-occ", intel.census.ownerOccPct != null ? `${intel.census.ownerOccPct.toFixed(0)}%` : "—"],
            ["Vacancy", intel.census.vacancyPct != null ? `${intel.census.vacancyPct.toFixed(1)}%` : "—"],
            ["Poverty", intel.census.povertyPct != null ? `${intel.census.povertyPct.toFixed(1)}%` : "—"],
            ["Bachelor+", intel.census.bachelorPlusPct != null ? `${intel.census.bachelorPlusPct.toFixed(0)}%` : "—"],
            ["Age", intel.census.medianAge != null ? intel.census.medianAge.toFixed(1) : "—"],
            ["Pop", intel.census.population != null ? intel.census.population.toLocaleString() : "—"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-card p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</p>
              <p className="tabular text-sm">{v}</p>
            </div>
          ))}
        </div>
      )}
      {intel.nearest.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {intel.nearest.map((n) => (
            <div key={n.label} className="rounded-lg border border-border bg-card p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{n.label}</p>
              <p className="truncate text-sm">{n.name}</p>
              <p className="tabular text-xs text-muted-foreground">{formatMiles(n.distanceM)}</p>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {intel.clusters.map((c) => (
          <div key={c.kind} className="rounded-lg border border-border bg-card p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.kind.replace("_", " ")}</p>
            <p className="tabular text-lg">{c.count}</p>
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="space-y-3 pt-4 text-sm">
          <p>{intel.schoolsNote}</p>
          <p className="text-muted-foreground">{intel.laborNote}</p>
          <p className="text-muted-foreground">{intel.zoningNote}</p>
          <p>{intel.trend}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mapped amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {intel.amenities.slice(0, 18).map((a) => (
              <li key={a.id} className="flex justify-between gap-3">
                <span className="truncate">
                  {a.name} <span className="text-muted-foreground">· {a.kind}</span>
                </span>
                <span className="shrink-0 tabular text-muted-foreground">{formatMiles(a.distanceM)}</span>
              </li>
            ))}
            {intel.amenities.length === 0 && (
              <li className="text-muted-foreground">No POIs returned for this radius.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-3xl tabular">{value}</p>
    </div>
  );
}
