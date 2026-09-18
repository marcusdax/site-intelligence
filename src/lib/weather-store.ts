import { create } from "zustand";
import type { RadarFrame, WeatherAlert } from "@/lib/server/radar";

type Product = "radar" | "infrared";

type State = {
  host: string;
  frames: RadarFrame[];
  infrared: { time: number; path: string }[];
  frameIndex: number;
  playing: boolean;
  product: Product;
  opacity: number;
  overlayOn: boolean;
  alertsOn: boolean;
  alerts: WeatherAlert[];
  alertsSource: string | null;
  catalogStatus: "idle" | "loading" | "ready" | "error";
  alertsStatus: "idle" | "loading" | "ready" | "error";
  selectedAlertId: string | null;
};

type Actions = {
  setCatalog: (host: string, frames: RadarFrame[], infrared: { time: number; path: string }[]) => void;
  setFrameIndex: (i: number) => void;
  setPlaying: (on: boolean) => void;
  setProduct: (p: Product) => void;
  setOpacity: (n: number) => void;
  setOverlayOn: (on: boolean) => void;
  setAlertsOn: (on: boolean) => void;
  setAlerts: (a: WeatherAlert[], source?: string) => void;
  setCatalogStatus: (s: State["catalogStatus"]) => void;
  setAlertsStatus: (s: State["alertsStatus"]) => void;
  selectAlert: (id: string | null) => void;
  step: (delta: number) => void;
};

export const useWeatherStore = create<State & Actions>((set, get) => ({
  host: "https://tilecache.rainviewer.com",
  frames: [],
  infrared: [],
  frameIndex: 0,
  playing: true,
  product: "radar",
  opacity: 0.62,
  overlayOn: false,
  alertsOn: true,
  alerts: [],
  alertsSource: null,
  catalogStatus: "idle",
  alertsStatus: "idle",
  selectedAlertId: null,

  setCatalog: (host, frames, infrared) =>
    set({
      host,
      frames,
      infrared,
      frameIndex: Math.max(0, frames.length - 1),
      catalogStatus: "ready",
    }),
  setFrameIndex: (i) => set({ frameIndex: i }),
  setPlaying: (on) => set({ playing: on }),
  setProduct: (p) => set({ product: p }),
  setOpacity: (n) => set({ opacity: n }),
  setOverlayOn: (on) => set({ overlayOn: on }),
  setAlertsOn: (on) => set({ alertsOn: on }),
  setAlerts: (a, source) => set({ alerts: a, alertsSource: source ?? get().alertsSource, alertsStatus: "ready" }),
  setCatalogStatus: (s) => set({ catalogStatus: s }),
  setAlertsStatus: (s) => set({ alertsStatus: s }),
  selectAlert: (id) => set({ selectedAlertId: id }),
  step: (delta) => {
    const { frames, frameIndex } = get();
    if (!frames.length) return;
    const next = (frameIndex + delta + frames.length) % frames.length;
    set({ frameIndex: next });
  },
}));

export function currentRadarUrl(): string | null {
  const s = useWeatherStore.getState();
  if (s.product === "infrared") {
    const f = s.infrared[Math.min(s.frameIndex, Math.max(0, s.infrared.length - 1))];
    if (!f) return null;
    return `${s.host}${f.path}/256/{z}/{x}/{y}/0/0_0.png`;
  }
  const f = s.frames[s.frameIndex];
  if (!f) return null;
  return `${s.host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`;
}
