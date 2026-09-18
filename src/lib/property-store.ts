import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SAMPLES } from "./knowledge";
import type {
  Amenity,
  ChatTurn,
  Dossier,
  HarvestScore,
  NeighborhoodIntel,
  OnePager,
  PanelTab,
  PropertyPin,
  RenderJob,
  SampleProperty,
  ScenarioId,
  WatchItem,
} from "./types";

export const SAMPLE_PINS: SampleProperty[] = SAMPLES.map((s) => ({
  label: s.label,
  blurb: s.blurb,
  pin: {
    id: `sample_${s.lat}`,
    label: `${s.address}, ${s.city}, ${s.state}`,
    address: s.address,
    city: s.city,
    state: s.state,
    postcode: s.postcode,
    lat: s.lat,
    lng: s.lng,
    neighborhood: s.neighborhood,
    source: "sample",
  },
}));

type Status = "idle" | "loading" | "ready" | "error";
type MapLayer = "streets" | "satellite";

type State = {
  selected: PropertyPin | null;
  geofenceMode: boolean;
  geofenceRadiusM: number;
  zoneHits: PropertyPin[];
  harvest: HarvestScore[];
  dossier: Dossier | null;
  dossierStatus: Status;
  dossierError: string | null;
  neighborhood: NeighborhoodIntel | null;
  neighborhoodStatus: Status;
  amenities: Amenity[];
  panelTab: PanelTab;
  render: RenderJob | null;
  campaign: OnePager[];
  campaignStatus: Status;
  history: PropertyPin[];
  watchlist: WatchItem[];
  mapCenter: { lat: number; lng: number; zoom: number };
  mapLayer: MapLayer;
  scenarioId: ScenarioId;
  chat: ChatTurn[];
  chatStatus: Status;
  scanning: boolean;
  tractRing: [number, number][] | null;
  buildingRing: [number, number][] | null;
  geofenceShape: "circle" | "polygon";
  geofenceVertices: [number, number][];
  drawingPolygon: boolean;
};

type Actions = {
  selectPin: (pin: PropertyPin) => void;
  clearSelection: () => void;
  setGeofenceMode: (on: boolean) => void;
  setGeofenceRadius: (m: number) => void;
  setZoneHits: (hits: PropertyPin[]) => void;
  setHarvest: (h: HarvestScore[]) => void;
  setDossier: (d: Dossier | null, status?: Status, error?: string | null) => void;
  setNeighborhood: (n: NeighborhoodIntel | null, status?: Status) => void;
  setAmenities: (a: Amenity[]) => void;
  setPanelTab: (t: PanelTab) => void;
  setRender: (r: RenderJob | null) => void;
  patchRender: (p: Partial<RenderJob>) => void;
  setCampaign: (c: OnePager[], status?: Status) => void;
  setMapCenter: (c: { lat: number; lng: number; zoom: number }) => void;
  setMapLayer: (l: MapLayer) => void;
  setScenarioId: (id: ScenarioId) => void;
  pushChat: (t: ChatTurn) => void;
  setChat: (c: ChatTurn[]) => void;
  setChatStatus: (s: Status) => void;
  setScanning: (on: boolean) => void;
  toggleWatch: (item: WatchItem) => void;
  setTractRing: (r: [number, number][] | null) => void;
  setBuildingRing: (r: [number, number][] | null) => void;
  setGeofenceShape: (s: "circle" | "polygon") => void;
  addGeofenceVertex: (v: [number, number]) => void;
  undoGeofenceVertex: () => void;
  clearGeofenceVertices: () => void;
  setDrawingPolygon: (on: boolean) => void;
};

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const usePropertyStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      selected: null,
      geofenceMode: false,
      geofenceRadiusM: 800,
      zoneHits: [],
      harvest: [],
      dossier: null,
      dossierStatus: "idle",
      dossierError: null,
      neighborhood: null,
      neighborhoodStatus: "idle",
      amenities: [],
      panelTab: "dossier",
      render: null,
      campaign: [],
      campaignStatus: "idle",
      history: [],
      watchlist: [],
      mapCenter: { lat: 32.7555, lng: -97.3308, zoom: 11 },
      mapLayer: "streets",
      scenarioId: "curb",
      chat: [],
      chatStatus: "idle",
      scanning: false,
      tractRing: null,
      buildingRing: null,
      geofenceShape: "circle",
      geofenceVertices: [],
      drawingPolygon: false,

      selectPin: (pin) => {
        const history = [pin, ...get().history.filter((h) => h.id !== pin.id)].slice(0, 12);
        set({
          selected: pin,
          history,
          mapCenter: { lat: pin.lat, lng: pin.lng, zoom: 16 },
          dossier: null,
          dossierStatus: "idle",
          dossierError: null,
          neighborhood: null,
          neighborhoodStatus: "idle",
          amenities: [],
          campaign: [],
          chat: [],
          panelTab: "dossier",
          scenarioId: "curb",
          tractRing: null,
          buildingRing: null,
        });
      },
      clearSelection: () =>
        set({
          selected: null,
          dossier: null,
          dossierStatus: "idle",
          neighborhood: null,
          zoneHits: [],
          harvest: [],
          render: null,
          chat: [],
          tractRing: null,
          buildingRing: null,
        }),
      setGeofenceMode: (on) => set({ geofenceMode: on, drawingPolygon: on && get().geofenceShape === "polygon" }),
      setGeofenceRadius: (m) => set({ geofenceRadiusM: m }),
      setZoneHits: (hits) => set({ zoneHits: hits }),
      setHarvest: (h) => set({ harvest: h }),
      setDossier: (d, status = d ? "ready" : "idle", error = null) =>
        set({ dossier: d, dossierStatus: status, dossierError: error }),
      setNeighborhood: (n, status = n ? "ready" : "idle") =>
        set({ neighborhood: n, neighborhoodStatus: status }),
      setAmenities: (a) => set({ amenities: a }),
      setPanelTab: (t) => set({ panelTab: t }),
      setRender: (r) => set({ render: r }),
      patchRender: (p) => {
        const cur = get().render;
        if (!cur) return;
        set({ render: { ...cur, ...p } });
      },
      setCampaign: (c, status = "ready") => set({ campaign: c, campaignStatus: status }),
      setMapCenter: (c) => set({ mapCenter: c }),
      setMapLayer: (l) => set({ mapLayer: l }),
      setScenarioId: (id) => set({ scenarioId: id }),
      pushChat: (t) => set({ chat: [...get().chat, t] }),
      setChat: (c) => set({ chat: c }),
      setChatStatus: (s) => set({ chatStatus: s }),
      setScanning: (on) => set({ scanning: on }),
      toggleWatch: (item) => {
        const exists = get().watchlist.some((w) => w.pin.id === item.pin.id);
        set({
          watchlist: exists
            ? get().watchlist.filter((w) => w.pin.id !== item.pin.id)
            : [item, ...get().watchlist].slice(0, 6),
        });
      },
      setTractRing: (r) => set({ tractRing: r }),
      setBuildingRing: (r) => set({ buildingRing: r }),
      setGeofenceShape: (s) =>
        set({
          geofenceShape: s,
          drawingPolygon: get().geofenceMode && s === "polygon",
        }),
      addGeofenceVertex: (v) => set({ geofenceVertices: [...get().geofenceVertices, v].slice(0, 24) }),
      undoGeofenceVertex: () => set({ geofenceVertices: get().geofenceVertices.slice(0, -1) }),
      clearGeofenceVertices: () => set({ geofenceVertices: [] }),
      setDrawingPolygon: (on) => set({ drawingPolygon: on }),
    }),
    {
      name: "propertyinsight-v3",
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      partialize: (s) => ({
        history: s.history,
        watchlist: s.watchlist,
        geofenceRadiusM: s.geofenceRadiusM,
        mapCenter: s.mapCenter,
        mapLayer: s.mapLayer,
      }),
    },
  ),
);
