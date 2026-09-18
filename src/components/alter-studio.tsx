import { useRef, useState } from "react";
import { toast } from "sonner";
import { ComparisonSlider } from "@/components/comparison-slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FEATURES, FEATURE_STYLES } from "@/lib/knowledge";
import { usePropertyStore } from "@/lib/property-store";
import { composeCopy, composeRender } from "@/lib/server/render";
import type { FeatureKey } from "@/lib/types";
import { usd } from "@/lib/utils";

async function fileToDataUrl(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const max = 1024;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bmp, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.84);
}

export function AlterStudio() {
  const dossier = usePropertyStore((s) => s.dossier);
  const selected = usePropertyStore((s) => s.selected);
  const render = usePropertyStore((s) => s.render);
  const setRender = usePropertyStore((s) => s.setRender);
  const patchRender = usePropertyStore((s) => s.patchRender);
  const setPanelTab = usePropertyStore((s) => s.setPanelTab);

  const [feature, setFeature] = useState<FeatureKey>("garage_door");
  const [style, setStyle] = useState(FEATURE_STYLES.garage_door[0]!.id);
  const [notes, setNotes] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const styles = FEATURE_STYLES[feature];
  const play = dossier?.plays.find((p) => p.id === feature);

  const onFeature = (v: FeatureKey) => {
    setFeature(v);
    setStyle(FEATURE_STYLES[v][0]!.id);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setRender({
        feature,
        style,
        prompt: "",
        beforeDataUrl: dataUrl,
        afterDataUrl: null,
        headline: "",
        body: "",
        roiStatement: "",
        status: "idle",
      });
    } catch {
      toast.error("Could not read that image");
    }
  };

  const run = async () => {
    if (!render?.beforeDataUrl) {
      toast.error("Upload a facade photo first");
      return;
    }
    patchRender({ status: "running", error: undefined, feature, style });
    try {
      const [img, copy] = await Promise.all([
        composeRender({
          data: {
            feature,
            style,
            imageDataUrl: render.beforeDataUrl,
            context: [selected?.label, notes].filter(Boolean).join(". "),
          },
        }),
        composeCopy({
          data: {
            feature,
            style,
            address: selected?.address,
            roiPct: play?.roiPct,
          },
        }),
      ]);
      if (!img.ok) {
        patchRender({ status: "error", error: img.error });
        toast.error(img.error);
        return;
      }
      patchRender({
        status: "done",
        afterDataUrl: img.afterUrl,
        prompt: img.prompt,
        headline: copy.ok ? copy.headline : "",
        body: copy.ok ? copy.body : "",
        roiStatement: copy.ok ? copy.roiStatement : "",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Render failed";
      patchRender({ status: "error", error: msg });
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      <header>
        <h2 className="font-display text-2xl tracking-tight">Alter Rendering Engine</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Photoreal before/after on the actual elevation. Highest-ROI exteriors first — garage, roof, siding, windows, paint.
        </p>
      </header>

      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void onFile(e.dataTransfer.files[0]);
        }}
      >
        <p className="text-sm">Drop a street photo or click to upload</p>
        <p className="mt-1 text-xs text-muted-foreground">JPEG or PNG · resized on-device to 1024px</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Feature</Label>
          <Select value={feature} onValueChange={(v) => onFeature(v as FeatureKey)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURES.map((f) => (
                <SelectItem key={f.key} value={f.key}>
                  {f.label} · {f.roiPct}% ROI
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styles.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Direction (optional)</Label>
        <Textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. keep the existing brick, darker hardware, no cars in frame"
        />
      </div>

      <Button
        type="button"
        onClick={() => void run()}
        disabled={render?.status === "running" || !render?.beforeDataUrl}
      >
        {render?.status === "running" ? "Rendering…" : "Generate Alter render"}
      </Button>

      {render?.status === "running" && (
        <ol className="grid grid-cols-5 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          {["Acquire", "Segment", "Align", "Blend", "ROI"].map((s, i) => (
            <li key={s} className="rounded-md border border-border bg-card py-2">
              <span className={i < 3 ? "text-primary" : ""}>{s}</span>
            </li>
          ))}
        </ol>
      )}

      <ComparisonSlider
        before={render?.beforeDataUrl ?? null}
        after={render?.afterDataUrl ?? null}
        loading={render?.status === "running"}
      />

      {play && (
        <div className="grid grid-cols-3 gap-2">
          <Mini label="Mid cost" value={usd(play.costMid)} />
          <Mini label="Modeled ROI" value={`${play.roiPct.toFixed(1)}%`} />
          <Mini label="Value add" value={usd(play.valueAdd)} />
        </div>
      )}

      {(render?.headline || render?.error) && (
        <Card>
          <CardHeader>
            <CardTitle>{render.error ? "Render note" : render.headline}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {render.error ? (
              <p className="text-destructive">{render.error}</p>
            ) : (
              <>
                <p>{render.body}</p>
                <p className="text-muted-foreground">{render.roiStatement}</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {render?.afterDataUrl && (
        <Button type="button" variant="outline" onClick={() => setPanelTab("campaign")}>
          Push into a campaign one-pager
        </Button>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 tabular text-sm">{value}</p>
    </div>
  );
}
