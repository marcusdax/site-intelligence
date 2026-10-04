import { useState } from "react";
import {
  Binoculars,
  Briefcase,
  Crosshair,
  Globe2,
  Radar,
  ScanLine,
} from "lucide-react";
import { GlobeWorkspace } from "@/components/globe-workspace";
import { RadarWorkspace } from "@/components/radar-workspace";
import { RoofproWorkspace } from "@/components/roofpro-workspace";
import { ScoutWorkspace } from "@/components/scout-workspace";
import { SourcesWorkspace } from "@/components/sources-workspace";
import { VisionWorkspace } from "@/components/vision-workspace";
import { useWeatherBootstrap } from "@/lib/use-weather";
import { cn } from "@/lib/utils";

export type Desk = "scout" | "radar" | "globe" | "jobs" | "vision" | "sources";

const DESKS: { id: Desk; label: string; icon: typeof Radar }[] = [
  { id: "scout", label: "Scout", icon: Binoculars },
  { id: "radar", label: "Radar", icon: Radar },
  { id: "globe", label: "Globe", icon: Globe2 },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "vision", label: "Vision", icon: ScanLine },
  { id: "sources", label: "Sources", icon: Crosshair },
];

export function CommandShell() {
  useWeatherBootstrap();
  const [desk, setDesk] = useState<Desk>("scout");

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-background text-foreground">
      <nav className="z-30 flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border px-3 py-2">
        <p className="hidden shrink-0 font-display text-sm tracking-tight sm:block">Command</p>
        <div className="flex min-w-0 gap-1">
          {DESKS.map((d) => {
            const Icon = d.icon;
            const on = desk === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDesk(d.id)}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-1.5 rounded-md border px-3 text-xs uppercase tracking-wider",
                  on
                    ? "border-primary bg-secondary text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.6} />
                {d.label}
              </button>
            );
          })}
        </div>
      </nav>
      <div className="min-h-0 flex-1">
        {desk === "scout" && <ScoutWorkspace />}
        {desk === "radar" && <RadarWorkspace onOpenScout={() => setDesk("scout")} />}
        {desk === "globe" && <GlobeWorkspace />}
        {desk === "jobs" && <RoofproWorkspace />}
        {desk === "vision" && <VisionWorkspace onOpenJobs={() => setDesk("jobs")} />}
        {desk === "sources" && <SourcesWorkspace />}
      </div>
    </div>
  );
}
