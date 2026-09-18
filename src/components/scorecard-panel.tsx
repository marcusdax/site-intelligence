import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { usePropertyStore } from "@/lib/property-store";
import { compactUsd, pct } from "@/lib/utils";

export function ScorecardPanel() {
  const dossier = usePropertyStore((s) => s.dossier);
  const watchlist = usePropertyStore((s) => s.watchlist);
  const loading = usePropertyStore((s) => s.dossierStatus === "loading");

  if (loading && !dossier) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </div>
    );
  }
  if (!dossier) {
    return (
      <p className="text-sm text-muted-foreground">
        Scout a parcel to score talent, rehab cost, insurance friction, and appreciation on one card.
      </p>
    );
  }

  const { scorecard, census, flood, metro } = dossier;
  const radar = scorecard.dimensions.map((d) => ({ subject: d.label, score: d.score, full: 100 }));

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={scorecard.overall >= 70 ? "ok" : scorecard.overall >= 50 ? "warn" : "danger"}>
            Site score {scorecard.overall}
          </Badge>
          {census && <Badge variant="outline">ACS {census.geoid}</Badge>}
          {flood && <Badge variant={flood.sfha ? "danger" : "muted"}>FEMA {flood.zone}</Badge>}
        </div>
        <h2 className="font-display text-2xl tracking-tight">Site selection scorecard</h2>
        <p className="text-sm text-muted-foreground">{scorecard.verdict}</p>
      </header>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radar} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="rgb(236 234 228 / 12%)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#9c9a92", fontSize: 10 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar dataKey="score" stroke="#8aa07a" fill="#8aa07a" fillOpacity={0.28} />
            <RTooltip
              contentStyle={{ background: "#151613", border: "1px solid rgb(236 234 228 / 10%)", borderRadius: 8 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weighted dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scorecard.dimensions.map((d) => (
            <div key={d.id} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {d.label} · {(d.weight * 100).toFixed(0)}%
                </span>
                <span className="tabular">{d.score}</span>
              </div>
              <Progress value={d.score} />
              <p className="text-xs text-muted-foreground">{d.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {census && (
        <Card>
          <CardHeader>
            <CardTitle>Tract vs metro</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-2 text-left font-medium">Signal</th>
                  <th className="pb-2 text-right font-medium">Tract</th>
                  <th className="pb-2 text-right font-medium">Metro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Median income", census.medianIncome != null ? compactUsd(census.medianIncome) : "—", compactUsd(metro.medianIncome)],
                  ["Home value", census.medianHomeValue != null ? compactUsd(census.medianHomeValue) : "—", compactUsd(metro.medianValue)],
                  ["Owner-occ", census.ownerOccPct != null ? pct(census.ownerOccPct, 0) : "—", pct(metro.ownerOcc, 0)],
                  ["Bachelor+", census.bachelorPlusPct != null ? pct(census.bachelorPlusPct, 0) : "—", pct(metro.bachelorPlus, 0)],
                  ["Median age", census.medianAge != null ? census.medianAge.toFixed(1) : "—", String(metro.medianAge)],
                ].map(([k, a, b]) => (
                  <tr key={k} className="border-t border-border">
                    <td className="py-2 text-muted-foreground">{k}</td>
                    <td className="py-2 text-right tabular">{a}</td>
                    <td className="py-2 text-right tabular text-muted-foreground">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted-foreground">
              ACS 5-year 2023 · {census.name}. Margins of error not shown; treat small tracts as noisy.
            </p>
          </CardContent>
        </Card>
      )}

      {watchlist.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Watchlist compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="pb-2 font-medium">Parcel</th>
                    <th className="pb-2 font-medium">Value</th>
                    <th className="pb-2 font-medium">DPS</th>
                    <th className="pb-2 font-medium">Cap</th>
                    <th className="pb-2 font-medium">IRR</th>
                    <th className="pb-2 font-medium">Play</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((w) => (
                    <tr key={w.pin.id} className="border-t border-border">
                      <td className="py-2">{w.pin.address}</td>
                      <td className="tabular py-2">{compactUsd(w.estimate)}</td>
                      <td className="tabular py-2">{w.dps}</td>
                      <td className="tabular py-2">{pct(w.capRate * 100, 1)}</td>
                      <td className="tabular py-2">{pct(w.irr5 * 100, 1)}</td>
                      <td className="py-2 text-muted-foreground">{w.topPlay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
