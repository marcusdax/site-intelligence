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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { usePropertyStore } from "@/lib/property-store";
import type { Dossier, Scenario } from "@/lib/types";
import { compactUsd, pct, usd } from "@/lib/utils";

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl tabular tracking-tight">{value}</p>
      {hint ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function UnderwritePanel({ dossier, loading }: { dossier: Dossier | null; loading: boolean }) {
  const scenarioId = usePropertyStore((s) => s.scenarioId);
  const setScenarioId = usePropertyStore((s) => s.setScenarioId);

  if (loading && !dossier) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
      </div>
    );
  }
  if (!dossier) {
    return <p className="text-sm text-muted-foreground">Select a parcel to underwrite purchase, rehab, and five-year hold.</p>;
  }

  const scenario: Scenario = dossier.scenarios.find((s) => s.id === scenarioId) ?? dossier.scenarios[0]!;
  const pf = scenario.proForma;
  const { carry } = dossier;

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header>
        <h2 className="font-display text-2xl tracking-tight">Underwrite</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          20% down · 6.75% 30-year · {dossier.metro.name} rent yield {dossier.metro.rentYield.toFixed(1)}%. Toggle a scenario to re-cut cash-in and IRR.
        </p>
      </header>

      <div className="grid gap-2">
        {dossier.scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenarioId(s.id)}
            className={`rounded-xl border px-3 py-3 text-left transition-colors ${
              s.id === scenario.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{s.label}</span>
              <span className="tabular text-xs text-muted-foreground">
                {s.rehab ? usd(s.rehab) : "No rehab"} · {s.timelineWeeks ? `${s.timelineWeeks} wk` : "Day-1"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{s.blurb}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="Cash in" value={compactUsd(pf.cashIn)} hint={`${pct(pf.downPct * 100)} down + close + rehab`} />
        <Metric label="Cap rate" value={pct(pf.capRate * 100, 1)} hint={`NOI ${usd(pf.noi)}`} />
        <Metric label="Cash-on-cash" value={pct(pf.cashOnCash * 100, 1)} hint={`${usd(pf.monthlyCashFlow)} / mo`} />
        <Metric label="5-yr IRR" value={pct(pf.irr5 * 100, 1)} hint={`${pf.equityMultiple5.toFixed(2)}x equity`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sources and uses</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Purchase", usd(pf.price)],
                ["Rehab", usd(pf.rehab)],
                ["Closing (2.5%)", usd(pf.closingCost)],
                ["Down payment", usd(pf.downPayment)],
                ["Loan", usd(pf.loan)],
                ["Monthly P&I", usd(pf.monthlyPI)],
                ["DSCR", pf.dscr.toFixed(2)],
                ["ARV / exit Y5", usd(scenario.arv) + " / " + usd(pf.exitValue)],
              ].map(([k, v]) => (
                <tr key={k} className="border-t border-border">
                  <td className="py-2 text-muted-foreground">{k}</td>
                  <td className="py-2 text-right tabular">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Tax" value={usd(carry.taxAnnual)} hint={`${pct(carry.taxRate * 100, 2)} effective`} />
            <Metric label="Insurance" value={usd(carry.insuranceAnnual)} hint={carry.insuranceNote} />
            <Metric label="PITI / mo" value={usd(carry.pitiMonthly)} hint="P&I + tax + ins" />
            <Metric label="Vacancy" value={pct(carry.vacancyPct * 100)} hint={`Mgmt ${pct(carry.mgmtPct * 100)}`} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Five-year hold</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pf.years} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="rgb(236 234 228 / 8%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#9c9a92", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => compactUsd(Number(v))}
                />
                <RTooltip
                  contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
                  formatter={(v, n) => [usd(Number(v)), String(n)]}
                />
                <Line type="monotone" dataKey="equity" stroke="#8aa07a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="value" stroke="#c4b49a" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Yr</th>
                  <th className="pb-2 font-medium">Rent</th>
                  <th className="pb-2 font-medium">NOI</th>
                  <th className="pb-2 font-medium">CF</th>
                  <th className="pb-2 font-medium">Equity</th>
                </tr>
              </thead>
              <tbody>
                {pf.years.map((y) => (
                  <tr key={y.year} className="border-t border-border">
                    <td className="py-1.5">{y.label}</td>
                    <td className="tabular py-1.5">{compactUsd(y.rent)}</td>
                    <td className="tabular py-1.5">{compactUsd(y.noi)}</td>
                    <td className="tabular py-1.5">{compactUsd(y.cashFlow)}</td>
                    <td className="tabular py-1.5">{compactUsd(y.equity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monte Carlo · 400 runs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Rent ±15%, vacancy 3–12%, appreciation ±2pp, insurance ±25%, rehab ±15%. Refresh-scenario cash-in. Not a forecast — a sensitivity envelope.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Metric
              label="IRR p10 / p50 / p90"
              value={pct(dossier.monteCarlo.irr.p50 * 100, 1)}
              hint={`${pct(dossier.monteCarlo.irr.p10 * 100, 1)} → ${pct(dossier.monteCarlo.irr.p90 * 100, 1)}`}
            />
            <Metric
              label="CoC p50"
              value={pct(dossier.monteCarlo.coc.p50 * 100, 1)}
              hint={`${pct(dossier.monteCarlo.coc.p10 * 100, 1)}–${pct(dossier.monteCarlo.coc.p90 * 100, 1)}`}
            />
            <Metric
              label="CF / mo p50"
              value={usd(dossier.monteCarlo.monthlyCf.p50)}
              hint={`${usd(dossier.monteCarlo.monthlyCf.p10)}–${usd(dossier.monteCarlo.monthlyCf.p90)}`}
            />
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dossier.monteCarlo.histogram} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgb(236 234 228 / 8%)" vertical={false} />
                <XAxis dataKey="bucket" tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} />
                <RTooltip
                  contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
                />
                <Bar dataKey="count" fill="#8aa07a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dossier.monteCarlo.tornado}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke="rgb(236 234 228 / 8%)" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => pct(Number(v) * 100, 0)}
                  tick={{ fill: "#9c9a92", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="driver"
                  width={88}
                  tick={{ fill: "#9c9a92", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RTooltip
                  contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
                  formatter={(v) => [pct(Number(v) * 100, 1), "IRR"]}
                />
                <Bar dataKey="low" fill="#c45c4a" radius={[4, 0, 0, 4]} />
                <Bar dataKey="high" fill="#8aa07a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investor fit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dossier.investorFit.map((f) => (
            <div key={f.strategy}>
              <div className="flex justify-between text-sm">
                <span>{f.strategy}</span>
                <span className="tabular text-primary">{f.score}</span>
              </div>
              <Progress value={f.score} className="mt-1" />
              <p className="mt-1 text-xs text-muted-foreground">{f.why}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modeled comps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-muted-foreground">
            Nearby OSM harvest when a geofence has been scanned; otherwise synthetic street-offset peers. Not sold comps.
          </p>
          <div className="mb-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dossier.comps} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgb(236 234 228 / 8%)" vertical={false} />
                <XAxis dataKey="address" hide />
                <YAxis tick={{ fill: "#9c9a92", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => compactUsd(Number(v))} />
                <RTooltip
                  contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
                  formatter={(v) => [usd(Number(v)), "Modeled"]}
                />
                <Bar dataKey="estimate" fill="#8aa07a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2 text-sm">
            {dossier.comps.map((c) => (
              <li key={c.id} className="flex justify-between gap-3">
                <span className="truncate">
                  {c.address}
                  <span className="text-muted-foreground">
                    {" "}
                    · {c.beds} bd · {c.sqft.toLocaleString()} sf
                  </span>
                </span>
                <span className="shrink-0 tabular">
                  {compactUsd(c.estimate)}{" "}
                  <Badge variant={c.deltaPct >= 0 ? "ok" : "warn"}>{c.deltaPct >= 0 ? "+" : ""}{c.deltaPct.toFixed(0)}%</Badge>
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
