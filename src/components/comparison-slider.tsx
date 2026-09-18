import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ComparisonSlider({
  before,
  after,
  loading,
}: {
  before: string | null;
  after: string | null;
  loading?: boolean;
}) {
  const [pos, setPos] = useState(56);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-64 w-full overflow-hidden rounded-lg bg-muted md:h-80",
        after && "cursor-ew-resize touch-none",
      )}
      onMouseDown={(e) => move(e.clientX)}
      onMouseMove={(e) => {
        if (e.buttons === 1) move(e.clientX);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) move(e.touches[0].clientX);
      }}
    >
      {!before && !loading && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          Upload a facade photo to run Alter
        </div>
      )}
      {before && (
        <img src={before} alt="Before" className="absolute inset-0 size-full object-cover" />
      )}
      {after && (
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={after} alt="After render" className="absolute inset-0 size-full object-cover" />
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 text-sm text-primary">
          Alter rendering…
        </div>
      )}
      {before && after && (
        <>
          <div className="absolute top-0 bottom-0 w-px bg-foreground" style={{ left: `${pos}%` }} />
          <div
            className="absolute top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card"
            style={{ left: `${pos}%` }}
          />
          <span className="absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 text-[11px] uppercase tracking-wider">
            Before
          </span>
          <span className="absolute right-3 top-3 rounded-md bg-primary/90 px-2 py-1 text-[11px] uppercase tracking-wider text-primary-foreground">
            Alter
          </span>
        </>
      )}
    </div>
  );
}
