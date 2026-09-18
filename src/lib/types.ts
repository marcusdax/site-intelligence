export type FeatureKey =
  | "garage_door"
  | "roof"
  | "windows"
  | "siding"
  | "paint"
  | "landscaping";

export type GeofenceShape = "circle" | "polygon";

export type PanelTab =
  | "dossier"
  | "underwrite"
  | "neighborhood"
  | "scorecard"
  | "alter"
  | "campaign"
  | "analyst";

export type GeocodeHit = {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  county?: string;
};

export type PropertyPin = GeocodeHit & {
  source: "search" | "map" | "geofence" | "sample" | "locate";
};

export type Amenity = {
  id: string;
  name: string;
  kind: string;
  lat: number;
  lng: number;
  distanceM: number;
};

export type ConditionScore = {
  score: number;
  note: string;
  ageYears?: number;
};

export type DpsFactor = {
  name: string;
  weight: number;
  points: number;
  note: string;
};

export type RoiPlay = {
  id: FeatureKey;
  label: string;
  costLow: number;
  costHigh: number;
  costMid: number;
  roiPct: number;
  valueAdd: number;
  paybackYears: number;
  demand: "hot" | "steady" | "soft";
  narrative: string;
  rank: number;
};

export type Incentive = {
  name: string;
  kind: "federal" | "state" | "local" | "utility";
  valueNote: string;
  eligibility: string;
};

export type RiskItem = {
  label: string;
  severity: "low" | "moderate" | "high" | "critical";
  detail: string;
};

export type InvestorFit = {
  strategy: string;
  score: number;
  why: string;
};

export type EvidenceSource = {
  sourceType: string;
  sourceId: string;
  timestamp: string;
  meta?: Record<string, string>;
};

export type EvidenceDocument = {
  evidenceId: string;
  createdAt: string;
  sources: EvidenceSource[];
  modelVersions: Record<string, { version: string }>;
  confidence: { overall: number; byStage: Record<string, number> };
  assertions: { type: string; value: string; explanation: string }[];
};

export type MetroProfile = {
  id: string;
  name: string;
  state: string;
  medianValue: number;
  yoyAppreciation: number;
  rentYield: number;
  costIndex: number;
  hailRisk: number;
  windRisk: number;
  floodRisk: number;
  wildfireRisk: number;
  unemployment: number;
  medianIncome: number;
  bachelorPlus: number;
  medianAge: number;
  householdSize: number;
  ownerOcc: number;
  narrative: string;
};

export type PropertyProfile = {
  yearBuilt: number;
  sqft: number;
  beds: number;
  baths: number;
  lotSqft: number;
  stories: number;
  occupancy: "owner" | "rental" | "vacant";
  construction: string;
  roofMaterial: string;
  roofAge: number;
  garage: "none" | "1-car" | "2-car" | "3-car";
};

export type CarryCosts = {
  taxRate: number;
  taxAnnual: number;
  insuranceAnnual: number;
  insuranceNote: string;
  vacancyPct: number;
  maintenancePct: number;
  mgmtPct: number;
  pitiMonthly: number;
};

export type ProFormaYear = {
  year: number;
  label: string;
  rent: number;
  noi: number;
  debtService: number;
  cashFlow: number;
  value: number;
  equity: number;
};

export type ProForma = {
  price: number;
  downPct: number;
  downPayment: number;
  loan: number;
  rate: number;
  termYears: number;
  monthlyPI: number;
  closingCost: number;
  rehab: number;
  cashIn: number;
  grossRentAnnual: number;
  noi: number;
  capRate: number;
  cashOnCash: number;
  dscr: number;
  monthlyCashFlow: number;
  years: ProFormaYear[];
  irr5: number;
  equityMultiple5: number;
  exitValue: number;
  remainingLoan5: number;
};

export type ScenarioId = "as_is" | "curb" | "refresh" | "envelope" | "brrrr";

export type Scenario = {
  id: ScenarioId;
  label: string;
  blurb: string;
  features: FeatureKey[];
  rehab: number;
  arv: number;
  valueAdd: number;
  timelineWeeks: number;
  proForma: ProForma;
};

export type Comp = {
  id: string;
  address: string;
  lat: number;
  lng: number;
  distanceM: number;
  estimate: number;
  beds: number;
  sqft: number;
  yearBuilt: number;
  deltaPct: number;
};

export type CensusTract = {
  geoid: string;
  name: string;
  stateFips: string;
  countyFips: string;
  tract: string;
  population: number | null;
  medianIncome: number | null;
  medianHomeValue: number | null;
  medianRent: number | null;
  medianAge: number | null;
  ownerOccPct: number | null;
  renterOccPct: number | null;
  vacancyPct: number | null;
  bachelorPlusPct: number | null;
  povertyPct: number | null;
  transitCommutePct: number | null;
  medianYearBuilt: number | null;
  households: number | null;
  geometry: number[][][] | null;
};

export type FloodIntel = {
  zone: string;
  subtype: string;
  sfha: boolean;
  bfe: string | null;
  note: string;
};

export type BuildingIntel = {
  use: string;
  levels: number | null;
  year: string | null;
  roof: string | null;
  footprint: [number, number][] | null;
};

export type GroundTruth = {
  census: CensusTract | null;
  flood: FloodIntel | null;
  building: BuildingIntel | null;
};

export type ScoreDimension = {
  id: string;
  label: string;
  score: number;
  weight: number;
  note: string;
};

export type SiteScorecard = {
  overall: number;
  verdict: string;
  dimensions: ScoreDimension[];
};

export type Dist = {
  p10: number;
  p50: number;
  p90: number;
};

export type MonteCarloResult = {
  n: number;
  irr: Dist;
  coc: Dist;
  monthlyCf: Dist;
  histogram: { bucket: string; count: number }[];
  tornado: { driver: string; low: number; high: number; base: number }[];
};

export type HarvestScore = {
  pin: PropertyPin;
  estimate: number;
  dps: number;
  dpsTier: string;
  topPlay: string;
  roiPct: number;
  yearBuilt: number;
  occupancy: string;
};

export type WatchItem = {
  pin: PropertyPin;
  estimate: number;
  dps: number;
  topPlay: string;
  roiPct: number;
  capRate: number;
  irr5: number;
};

export type Dossier = {
  pin: PropertyPin;
  profile: PropertyProfile;
  metro: MetroProfile;
  valuation: {
    estimate: number;
    low: number;
    high: number;
    confidence: number;
    method: string;
    asOf: string;
    psf: number;
  };
  condition: Record<FeatureKey, ConditionScore>;
  dps: { score: number; tier: string; factors: DpsFactor[]; action: string };
  plays: RoiPlay[];
  incentives: Incentive[];
  risks: RiskItem[];
  thesis: string;
  narrative: string;
  occupancyNote: string;
  investorFit: InvestorFit[];
  evidence: EvidenceDocument;
  appreciation: { year: string; value: number }[];
  demographics: {
    label: string;
    value: string;
    detail: string;
  }[];
  carry: CarryCosts;
  scenarios: Scenario[];
  comps: Comp[];
  imageryUrl: string;
  enriched: boolean;
  census: CensusTract | null;
  flood: FloodIntel | null;
  building: BuildingIntel | null;
  scorecard: SiteScorecard;
  monteCarlo: MonteCarloResult;
};

export type NeighborhoodIntel = {
  pin: PropertyPin;
  summary: string;
  walkScore: number;
  transitScore: number;
  amenityScore: number;
  amenities: Amenity[];
  clusters: { kind: string; count: number }[];
  nearest: { label: string; name: string; distanceM: number }[];
  schoolsNote: string;
  laborNote: string;
  zoningNote: string;
  trend: string;
  enriched: boolean;
  census: CensusTract | null;
  flood: FloodIntel | null;
  building: BuildingIntel | null;
  scorecard: SiteScorecard | null;
};

export type RenderJob = {
  feature: FeatureKey;
  style: string;
  prompt: string;
  beforeDataUrl: string;
  afterDataUrl: string | null;
  headline: string;
  body: string;
  roiStatement: string;
  status: "idle" | "running" | "done" | "error";
  error?: string;
};

export type OnePager = {
  id: string;
  address: string;
  headline: string;
  summary: string;
  cta: string;
  dps?: number;
  estimate?: number;
  topPlay?: string;
};

export type SampleProperty = {
  label: string;
  blurb: string;
  pin: PropertyPin;
};

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
};
