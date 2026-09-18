import { FEATURES, HAIL_BELT, STATE_TAX_RATE, incentivesFor, metroFor } from "./knowledge";
import type {
  BuildingIntel,
  CarryCosts,
  CensusTract,
  Comp,
  ConditionScore,
  Dist,
  Dossier,
  DpsFactor,
  FeatureKey,
  FloodIntel,
  GroundTruth,
  HarvestScore,
  InvestorFit,
  MetroProfile,
  MonteCarloResult,
  ProForma,
  ProFormaYear,
  PropertyPin,
  PropertyProfile,
  RiskItem,
  RoiPlay,
  Scenario,
  SiteScorecard,
} from "./types";
import { clamp, haversineMeters, id, mulberry32, seedFromCoord, usd } from "./utils";

const FEATURE_KEYS: FeatureKey[] = [
  "garage_door",
  "roof",
  "windows",
  "siding",
  "paint",
  "landscaping",
];

export function buildProfile(lat: number, lng: number): PropertyProfile {
  const rng = mulberry32(seedFromCoord(lat, lng));
  const yearBuilt = 1948 + Math.floor(rng() * 72);
  const sqft = 980 + Math.floor(rng() * 2400);
  const beds = sqft > 2200 ? 4 : sqft > 1600 ? 3 : 2 + (rng() > 0.6 ? 1 : 0);
  const baths = Math.max(1, Math.round(beds * 0.7 * 2) / 2);
  const lotSqft = Math.round(sqft * (3.2 + rng() * 4));
  const stories = sqft > 2000 && rng() > 0.45 ? 2 : 1;
  const occRoll = rng();
  const occupancy: PropertyProfile["occupancy"] =
    occRoll > 0.92 ? "vacant" : occRoll > 0.78 ? "rental" : "owner";
  const construction = rng() > 0.55 ? "wood frame" : rng() > 0.4 ? "brick veneer" : "masonry";
  const roofMaterial =
    rng() > 0.72 ? "architectural shingle" : rng() > 0.5 ? "3-tab shingle" : rng() > 0.25 ? "metal" : "tile";
  const roofAge = Math.max(1, Math.min(32, Math.round((2026 - yearBuilt) * (0.25 + rng() * 0.5))));
  const gRoll = rng();
  const garage: PropertyProfile["garage"] =
    gRoll > 0.85 ? "3-car" : gRoll > 0.45 ? "2-car" : gRoll > 0.18 ? "1-car" : "none";
  return { yearBuilt, sqft, beds, baths, lotSqft, stories, occupancy, construction, roofMaterial, roofAge, garage };
}

function conditionFor(
  profile: PropertyProfile,
  metro: MetroProfile,
  rng: () => number,
): Record<FeatureKey, ConditionScore> {
  const age = 2026 - profile.yearBuilt;
  const roofScore = clamp(100 - profile.roofAge * 3.4 - metro.hailRisk * 18 + rng() * 8, 18, 96);
  const paintScore = clamp(92 - age * 0.9 - metro.hailRisk * 6 - rng() * 12, 22, 94);
  const sidingScore = clamp(90 - age * 0.7 - (profile.construction === "wood frame" ? 8 : 0) - rng() * 10, 25, 95);
  const windowScore = clamp(88 - age * 0.85 - metro.windRisk * 10 - rng() * 8, 20, 94);
  const garageScore =
    profile.garage === "none" ? 70 : clamp(90 - age * 0.8 - rng() * 16, 18, 96);
  const landScore = clamp(86 - rng() * 28, 30, 94);
  const note = (s: number, good: string, mid: string, bad: string) =>
    s > 78 ? good : s > 52 ? mid : bad;
  return {
    roof: {
      score: Math.round(roofScore),
      ageYears: profile.roofAge,
      note: note(
        roofScore,
        "Roof reads serviceable in recent imagery.",
        "Wear consistent with age; inspect flashing and field.",
        "Visible granule loss / curl risk — replacement window is open.",
      ),
    },
    paint: {
      score: Math.round(paintScore),
      note: note(
        paintScore,
        "Paint film intact.",
        "Chalking and isolated peel — cosmetic reset is cheap lift.",
        "Peel and fade will photograph poorly and invite moisture.",
      ),
    },
    siding: {
      score: Math.round(sidingScore),
      note: note(
        sidingScore,
        "Cladding aligned.",
        "Minor wave / fade; overlay or paint may suffice.",
        "Panel failure or moisture staining — budget a proper envelope fix.",
      ),
    },
    windows: {
      score: Math.round(windowScore),
      note: note(
        windowScore,
        "Glazing looks recent.",
        "Aging frames; energy and wind story is available.",
        "Failed seals or single-pane — replacement is both comfort and insurance.",
      ),
    },
    garage_door: {
      score: Math.round(garageScore),
      note:
        profile.garage === "none"
          ? "No garage — curb story lives in entry, paint, landscape."
          : note(
              garageScore,
              "Door is current.",
              "Tired door; highest-ROI visual swap on this facade.",
              "Dented or dated door dominates the elevation.",
            ),
    },
    landscaping: {
      score: Math.round(landScore),
      note: note(
        landScore,
        "Yard is held.",
        "Sparse plantings; an edge-and-mulch package would photograph.",
        "Overgrown or bare — cheap staging before any listing.",
      ),
    },
  };
}

function dpsFor(
  profile: PropertyProfile,
  metro: MetroProfile,
  condition: Record<FeatureKey, ConditionScore>,
  state: string,
): { score: number; tier: string; factors: DpsFactor[]; action: string } {
  const hail = metro.hailRisk;
  const hailPts = Math.round(hail * 95);
  const roofVuln = Math.round(clamp((profile.roofAge / 28) * 100, 8, 96));
  const windPts = Math.round(metro.windRisk * 88);
  const duration = Math.round(30 + hail * 40);
  const materialAdj = profile.roofMaterial.includes("metal") ? -18 : profile.roofMaterial.includes("tile") ? -8 : 6;
  const prior = Math.round((100 - condition.roof.score) * 0.22);
  const weighted =
    hailPts * 0.38 +
    roofVuln * 0.28 +
    windPts * 0.16 +
    duration * 0.1 +
    clamp(50 + materialAdj, 0, 100) * 0.05 +
    prior * 0.03;
  const score = Math.round(clamp(weighted, 4, 98));
  const tier =
    score >= 90 ? "CRITICAL" : score >= 75 ? "HIGH" : score >= 55 ? "MODERATE" : score >= 30 ? "LOW" : "MINIMAL";
  const action =
    score >= 90
      ? "Same-day field visit. Pre-position materials."
      : score >= 75
        ? "Priority queue — 24-hour dispatch window."
        : score >= 55
          ? "Marketing outreach: mail + digital with a render."
          : score >= 30
            ? "Monitor. Revisit if a claim surfaces."
            : "Do not allocate restoration resources.";
  const factors: DpsFactor[] = [
    { name: "Hail exposure", weight: 38, points: hailPts, note: HAIL_BELT.has(state) ? "Inside hail alley." : "Background hail probability." },
    { name: "Roof vulnerability", weight: 28, points: roofVuln, note: `${profile.roofAge} yr ${profile.roofMaterial}` },
    { name: "Wind", weight: 16, points: windPts, note: "Sustained vs. gust differential (modeled)." },
    { name: "Storm duration", weight: 10, points: duration, note: "Minutes at peak intensity, parcel class." },
    { name: "Material class", weight: 5, points: clamp(50 + materialAdj, 0, 100), note: profile.roofMaterial },
    { name: "Prior distress", weight: 3, points: prior, note: "Condition residual from imagery proxies." },
  ];
  return { score, tier, factors, action };
}

function playsFor(
  profile: PropertyProfile,
  metro: MetroProfile,
  condition: Record<FeatureKey, ConditionScore>,
  estimate: number,
): RoiPlay[] {
  const sizeFactor = clamp(profile.sqft / 1800, 0.75, 1.55);
  const plays: RoiPlay[] = FEATURES.map((f) => {
    const cond = condition[f.key].score;
    const need = (100 - cond) / 100;
    const costMid = ((f.costLow + f.costHigh) / 2) * metro.costIndex * sizeFactor;
    const costLow = f.costLow * metro.costIndex * sizeFactor * 0.92;
    const costHigh = f.costHigh * metro.costIndex * sizeFactor * 1.08;
    const roiAdj = f.roiPct * (0.88 + need * 0.22) * (0.96 + metro.yoyAppreciation * 0.01);
    const valueAdd = costMid * (roiAdj / 100);
    const rentLift = (valueAdd * (metro.rentYield / 100)) / 12;
    const paybackYears = rentLift > 0 ? costMid / (rentLift * 12) : 12;
    const demand: RoiPlay["demand"] = roiAdj > 78 || need > 0.45 ? "hot" : roiAdj > 55 ? "steady" : "soft";
    return {
      id: f.key,
      label: f.label,
      costLow: Math.round(costLow),
      costHigh: Math.round(costHigh),
      costMid: Math.round(costMid),
      roiPct: Math.round(roiAdj * 10) / 10,
      valueAdd: Math.round(valueAdd),
      paybackYears: Math.round(paybackYears * 10) / 10,
      demand,
      narrative: `${f.label} at ${Math.round(cond)} condition. Modeled mid cost ${usd(costMid)} against a ${usd(estimate)} basis.`,
      rank: 0,
    };
  });
  plays.sort((a, b) => {
    const aa = a.roiPct * (1.1 - condition[a.id].score / 200);
    const bb = b.roiPct * (1.1 - condition[b.id].score / 200);
    return bb - aa;
  });
  return plays.map((p, i) => ({ ...p, rank: i + 1 }));
}

function risksFor(
  metro: MetroProfile,
  dps: number,
  profile: PropertyProfile,
  flood?: FloodIntel | null,
): RiskItem[] {
  const items: RiskItem[] = [];
  if (metro.hailRisk > 0.7)
    items.push({
      label: "Hail",
      severity: dps > 74 ? "high" : "moderate",
      detail: "Parcel sits in a high-frequency hail corridor. Roof class and remaining life dominate carry cost.",
    });
  if (flood?.sfha)
    items.push({
      label: "FEMA SFHA",
      severity: flood.zone.startsWith("V") ? "critical" : "high",
      detail: `National Flood Hazard Layer zone ${flood.zone}${flood.subtype ? ` (${flood.subtype})` : ""}. Flood insurance is an underwriting gate, not a footnote.`,
    });
  else if (metro.floodRisk > 0.55)
    items.push({
      label: "Flood / surge",
      severity: metro.floodRisk > 0.75 ? "high" : "moderate",
      detail: "Water is a basis risk. Confirm flood zone and elevation before bidding.",
    });
  if (metro.windRisk > 0.7)
    items.push({
      label: "Wind",
      severity: "high",
      detail: "Wind-mitigation credits and opening protection are underwriting, not optional cosmetics.",
    });
  if (metro.wildfireRisk > 0.45)
    items.push({
      label: "Wildfire interface",
      severity: metro.wildfireRisk > 0.55 ? "high" : "moderate",
      detail: "Defensible space and ember-resistant cladding affect both insurance and appraisal.",
    });
  if (profile.yearBuilt < 1978)
    items.push({
      label: "Lead / legacy systems",
      severity: "moderate",
      detail: "Pre-1978 stock. Budget for paint, wiring, and possible lead protocols on exterior work.",
    });
  if (metro.yoyAppreciation < 1.2)
    items.push({
      label: "Price softness",
      severity: "moderate",
      detail: "Appreciation is thin. Do not over-improve; buy the cheapest class-lift that photographs.",
    });
  if (items.length === 0)
    items.push({
      label: "Idiosyncratic",
      severity: "low",
      detail: "No metro-scale catastrophe spike. Residual risk is property-specific condition and title.",
    });
  return items;
}

function fitFor(metro: MetroProfile, profile: PropertyProfile, plays: RoiPlay[], estimate: number): InvestorFit[] {
  const rent = (estimate * (metro.rentYield / 100)) / 12;
  const brrrr = clamp(58 + metro.rentYield * 4 + (plays[0]?.roiPct ?? 0) * 0.15 - metro.costIndex * 10, 35, 92);
  const str = clamp(40 + metro.medianIncome / 4000 + (profile.sqft > 1400 ? 8 : 0) - metro.unemployment * 2, 30, 90);
  const hold = clamp(55 + metro.yoyAppreciation * 4 + metro.ownerOcc * 0.15, 38, 92);
  const wholesale = clamp(
    50 + (100 - (plays.find((p) => p.id === "paint")?.roiPct ?? 50)) * 0.1 + (profile.occupancy === "vacant" ? 12 : 0),
    28,
    88,
  );
  return [
    {
      strategy: "Fix and hold",
      score: Math.round(hold),
      why: `Modeled in-place yield ${metro.rentYield.toFixed(1)}% with ${metro.yoyAppreciation.toFixed(1)}% metro appreciation.`,
    },
    {
      strategy: "BRRRR",
      score: Math.round(brrrr),
      why: `Rent proxy ${usd(rent)}/mo. Cheapest high-ROI play is ${plays[0]?.label ?? "paint"}.`,
    },
    {
      strategy: "Short-term rental",
      score: Math.round(str),
      why: "STR depends on local ordinance — treat this as demand, not a permit.",
    },
    {
      strategy: "Wholesale / assign",
      score: Math.round(wholesale),
      why:
        profile.occupancy === "vacant"
          ? "Vacant stock moves faster through assignment if the render is ready."
          : "Occupied — allow for access and tenant friction.",
    },
  ].sort((a, b) => b.score - a.score);
}

function monthlyPI(principal: number, annualRate: number, years: number) {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

function remainingLoan(principal: number, annualRate: number, years: number, afterYears: number) {
  const r = annualRate / 12;
  const k = afterYears * 12;
  const p = monthlyPI(principal, annualRate, years);
  if (r === 0) return Math.max(0, principal - p * k);
  return principal * Math.pow(1 + r, k) - (p * (Math.pow(1 + r, k) - 1)) / r;
}

function irr(cashflows: number[]) {
  let lo = -0.4;
  let hi = 1.6;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    const npv = cashflows.reduce((s, c, t) => s + c / Math.pow(1 + mid, t), 0);
    if (npv > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function buildCarry(
  estimate: number,
  metro: MetroProfile,
  state: string,
  monthlyPIAmt: number,
  flood?: FloodIntel | null,
): CarryCosts {
  const taxRate = STATE_TAX_RATE[state.toUpperCase()] ?? STATE_TAX_RATE.US!;
  const taxAnnual = estimate * taxRate;
  let insRate =
    0.0042 + metro.hailRisk * 0.0038 + metro.windRisk * 0.0044 + metro.floodRisk * 0.0028 + metro.wildfireRisk * 0.0022;
  if (flood?.sfha) insRate += 0.0045;
  const insuranceAnnual = estimate * insRate;
  const notes: string[] = [];
  if (metro.hailRisk > 0.7) notes.push("hail loading");
  if (metro.windRisk > 0.7) notes.push("wind mitigation");
  if (flood?.sfha) notes.push(`FEMA ${flood.zone}`);
  else if (metro.floodRisk > 0.55) notes.push("flood overlay");
  if (metro.wildfireRisk > 0.45) notes.push("WUI");
  return {
    taxRate,
    taxAnnual: Math.round(taxAnnual),
    insuranceAnnual: Math.round(insuranceAnnual),
    insuranceNote: notes.length ? `Loaded for ${notes.join(", ")}.` : "Baseline HO-3 style premium.",
    vacancyPct: 0.05,
    maintenancePct: 0.08,
    mgmtPct: 0.08,
    pitiMonthly: Math.round(monthlyPIAmt + taxAnnual / 12 + insuranceAnnual / 12),
  };
}

export function buildProForma(opts: {
  price: number;
  rehab: number;
  metro: MetroProfile;
  state: string;
  downPct?: number;
  rate?: number;
  rentYield?: number;
  vacancyPct?: number;
  appr?: number;
  insMult?: number;
  flood?: FloodIntel | null;
}): ProForma {
  const downPct = opts.downPct ?? 0.2;
  const rate = opts.rate ?? 0.0675;
  const termYears = 30;
  const price = opts.price;
  const rehab = opts.rehab;
  const downPayment = price * downPct;
  const loan = price - downPayment;
  const closingCost = price * 0.025;
  const cashIn = downPayment + closingCost + rehab;
  const pi = monthlyPI(loan, rate, termYears);
  const carry = buildCarry(price + rehab * 0.35, opts.metro, opts.state, pi, opts.flood);
  if (opts.vacancyPct != null) carry.vacancyPct = opts.vacancyPct;
  if (opts.insMult != null) carry.insuranceAnnual = Math.round(carry.insuranceAnnual * opts.insMult);
  const yieldPct = opts.rentYield ?? opts.metro.rentYield;
  const grossRentAnnual = (price + rehab * 0.55) * (yieldPct / 100);
  const egi = grossRentAnnual * (1 - carry.vacancyPct);
  const opex = carry.taxAnnual + carry.insuranceAnnual + egi * (carry.maintenancePct + carry.mgmtPct);
  const noi = egi - opex;
  const debtService = pi * 12;
  const cashFlow = noi - debtService;
  const capRate = noi / Math.max(1, price + rehab);
  const cashOnCash = cashFlow / Math.max(1, cashIn);
  const dscr = noi / Math.max(1, debtService);
  const appr = (opts.appr ?? opts.metro.yoyAppreciation) / 100;
  const years: ProFormaYear[] = [];
  const cfs: number[] = [-cashIn];
  for (let y = 1; y <= 5; y++) {
    const value = (price + rehab * 0.7) * Math.pow(1 + appr, y);
    const rent = grossRentAnnual * Math.pow(1.025, y - 1);
    const yNoi = rent * (1 - carry.vacancyPct) - opex * Math.pow(1.02, y - 1);
    const yCf = yNoi - debtService;
    const rem = remainingLoan(loan, rate, termYears, y);
    const equity = value - rem;
    years.push({
      year: y,
      label: `Y${y}`,
      rent: Math.round(rent),
      noi: Math.round(yNoi),
      debtService: Math.round(debtService),
      cashFlow: Math.round(yCf),
      value: Math.round(value),
      equity: Math.round(equity),
    });
    cfs.push(y === 5 ? yCf + equity : yCf);
  }
  const exitValue = years[4]!.value;
  const remainingLoan5 = remainingLoan(loan, rate, termYears, 5);
  return {
    price: Math.round(price),
    downPct,
    downPayment: Math.round(downPayment),
    loan: Math.round(loan),
    rate,
    termYears,
    monthlyPI: Math.round(pi),
    closingCost: Math.round(closingCost),
    rehab: Math.round(rehab),
    cashIn: Math.round(cashIn),
    grossRentAnnual: Math.round(grossRentAnnual),
    noi: Math.round(noi),
    capRate,
    cashOnCash,
    dscr,
    monthlyCashFlow: Math.round(cashFlow / 12),
    years,
    irr5: irr(cfs),
    equityMultiple5: years[4]!.equity / Math.max(1, cashIn),
    exitValue: Math.round(exitValue),
    remainingLoan5: Math.round(remainingLoan5),
  };
}

function buildScenarios(
  estimate: number,
  plays: RoiPlay[],
  metro: MetroProfile,
  state: string,
  flood?: FloodIntel | null,
): Scenario[] {
  const byId = (k: FeatureKey) => plays.find((p) => p.id === k);
  const sum = (keys: FeatureKey[]) => keys.reduce((s, k) => s + (byId(k)?.costMid ?? 0), 0);
  const add = (keys: FeatureKey[]) => keys.reduce((s, k) => s + (byId(k)?.valueAdd ?? 0), 0);

  const curbKeys: FeatureKey[] = ["paint", "landscaping", "garage_door"];
  const refreshKeys: FeatureKey[] = plays.slice(0, 3).map((p) => p.id);
  const envelopeKeys: FeatureKey[] = FEATURE_KEYS;

  const mk = (
    sid: Scenario["id"],
    label: string,
    blurb: string,
    features: FeatureKey[],
    weeks: number,
    arvBoost = 1,
  ): Scenario => {
    const rehab = sum(features);
    const valueAdd = add(features);
    const arv = Math.round((estimate + valueAdd) * arvBoost);
    return {
      id: sid,
      label,
      blurb,
      features,
      rehab: Math.round(rehab),
      arv,
      valueAdd: Math.round(valueAdd),
      timelineWeeks: weeks,
      proForma: buildProForma({ price: estimate, rehab, metro, state, flood }),
    };
  };

  const brrrr = mk(
    "brrrr",
    "BRRRR exterior",
    "Rehab the envelope, season rent, then refinance at 70% of ARV.",
    refreshKeys,
    16,
    1.02,
  );
  const refiLoan = brrrr.arv * 0.7;
  const recovered = Math.max(0, refiLoan - brrrr.proForma.loan);
  const newCashIn = Math.max(8000, brrrr.proForma.cashIn - recovered * 0.85);
  brrrr.proForma = {
    ...brrrr.proForma,
    cashIn: Math.round(newCashIn),
    cashOnCash: (brrrr.proForma.monthlyCashFlow * 12) / Math.max(1, newCashIn),
  };

  return [
    mk("as_is", "Hold as-is", "No rehab. Carry the basis and let rent do the work.", [], 0),
    mk("curb", "Curb-appeal reset", "Paint, landscape, garage door — cheapest photographable lift.", curbKeys, 3),
    mk("refresh", "Exterior refresh", "Top three ROI plays on this parcel, sequenced for listing photography.", refreshKeys, 8),
    mk("envelope", "Full envelope", "Roof, windows, siding, paint, door, landscape. Insurance and class story.", envelopeKeys, 14),
    brrrr,
  ];
}

function buildSyntheticComps(pin: PropertyPin, estimate: number): Comp[] {
  const rng = mulberry32(seedFromCoord(pin.lat, pin.lng) ^ 0x51ed);
  const streets = ["Maple", "Oak", "Cedar", "Elm", "Pine", "Walnut", "Hickory", "Birch"];
  const comps: Comp[] = [];
  for (let i = 0; i < 6; i++) {
    const dLat = (rng() - 0.5) * 0.012;
    const dLng = (rng() - 0.5) * 0.012;
    const lat = pin.lat + dLat;
    const lng = pin.lng + dLng;
    const profile = buildProfile(lat, lng);
    const delta = (rng() - 0.48) * 0.18;
    const value = Math.round(estimate * (1 + delta) * (profile.sqft / 1800) * 0.55 + estimate * 0.5);
    comps.push({
      id: `comp_${i}`,
      address: `${1200 + Math.floor(rng() * 4800)} ${streets[i % streets.length]} ${rng() > 0.5 ? "St" : "Ave"}`,
      lat,
      lng,
      distanceM: haversineMeters(pin, { lat, lng }),
      estimate: value,
      beds: profile.beds,
      sqft: profile.sqft,
      yearBuilt: profile.yearBuilt,
      deltaPct: ((value - estimate) / estimate) * 100,
    });
  }
  return comps.sort((a, b) => a.distanceM - b.distanceM);
}

export function overlayComps(pin: PropertyPin, estimate: number, hits: PropertyPin[]): Comp[] {
  if (!hits.length) return buildSyntheticComps(pin, estimate);
  return hits.slice(0, 8).map((h, i) => {
    const profile = buildProfile(h.lat, h.lng);
    const value = Math.round(estimate * (0.88 + (profile.sqft / 2000) * 0.22));
    return {
      id: h.id || `comp_${i}`,
      address: h.address,
      lat: h.lat,
      lng: h.lng,
      distanceM: haversineMeters(pin, h),
      estimate: value,
      beds: profile.beds,
      sqft: profile.sqft,
      yearBuilt: profile.yearBuilt,
      deltaPct: ((value - estimate) / estimate) * 100,
    };
  });
}

function imageryUrl(lat: number, lng: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${lng - 0.0012},${lat - 0.0008},${lng + 0.0012},${lat + 0.0008}&bboxSR=4326&imageSR=4326&size=720,420&format=jpg&f=image`;
}

function percentile(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  const i = (sorted.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (i - lo);
}

function distOf(values: number[]): Dist {
  const s = [...values].sort((a, b) => a - b);
  return { p10: percentile(s, 0.1), p50: percentile(s, 0.5), p90: percentile(s, 0.9) };
}

export function runMonteCarlo(opts: {
  price: number;
  rehab: number;
  metro: MetroProfile;
  state: string;
  flood?: FloodIntel | null;
  seed?: number;
  n?: number;
}): MonteCarloResult {
  const n = opts.n ?? 400;
  const rng = mulberry32(opts.seed ?? seedFromCoord(opts.price, opts.rehab) ^ 0xc0ffee);
  const irrs: number[] = [];
  const cocs: number[] = [];
  const cfs: number[] = [];
  for (let i = 0; i < n; i++) {
    const rentYield = opts.metro.rentYield * (0.85 + rng() * 0.3);
    const vacancyPct = 0.03 + rng() * 0.09;
    const appr = opts.metro.yoyAppreciation + (rng() - 0.5) * 4;
    const insMult = 0.8 + rng() * 0.5;
    const rehab = opts.rehab * (0.85 + rng() * 0.3);
    const pf = buildProForma({
      price: opts.price,
      rehab,
      metro: opts.metro,
      state: opts.state,
      rentYield,
      vacancyPct,
      appr,
      insMult,
      flood: opts.flood,
    });
    irrs.push(pf.irr5);
    cocs.push(pf.cashOnCash);
    cfs.push(pf.monthlyCashFlow);
  }
  const base = buildProForma({
    price: opts.price,
    rehab: opts.rehab,
    metro: opts.metro,
    state: opts.state,
    flood: opts.flood,
  });
  const drivers: { driver: string; lowMult: Partial<Parameters<typeof buildProForma>[0]>; highMult: Partial<Parameters<typeof buildProForma>[0]> }[] = [
    {
      driver: "Rent yield",
      lowMult: { rentYield: opts.metro.rentYield * 0.85 },
      highMult: { rentYield: opts.metro.rentYield * 1.15 },
    },
    {
      driver: "Vacancy",
      lowMult: { vacancyPct: 0.12 },
      highMult: { vacancyPct: 0.03 },
    },
    {
      driver: "Appreciation",
      lowMult: { appr: opts.metro.yoyAppreciation - 2 },
      highMult: { appr: opts.metro.yoyAppreciation + 2 },
    },
    {
      driver: "Insurance",
      lowMult: { insMult: 1.3 },
      highMult: { insMult: 0.8 },
    },
    {
      driver: "Rehab cost",
      lowMult: { rehab: opts.rehab * 1.2 },
      highMult: { rehab: opts.rehab * 0.85 },
    },
  ];
  const tornado = drivers.map((d) => {
    const low = buildProForma({
      price: opts.price,
      rehab: opts.rehab,
      metro: opts.metro,
      state: opts.state,
      flood: opts.flood,
      ...d.lowMult,
    }).irr5;
    const high = buildProForma({
      price: opts.price,
      rehab: opts.rehab,
      metro: opts.metro,
      state: opts.state,
      flood: opts.flood,
      ...d.highMult,
    }).irr5;
    return { driver: d.driver, low, high, base: base.irr5 };
  });

  const histBuckets = ["<0%", "0–4%", "4–8%", "8–12%", "12–16%", "16%+"];
  const histogram = histBuckets.map((bucket) => ({ bucket, count: 0 }));
  for (const v of irrs) {
    const pct = v * 100;
    const idx = pct < 0 ? 0 : pct < 4 ? 1 : pct < 8 ? 2 : pct < 12 ? 3 : pct < 16 ? 4 : 5;
    histogram[idx]!.count += 1;
  }

  return {
    n,
    irr: distOf(irrs),
    coc: distOf(cocs),
    monthlyCf: distOf(cfs),
    histogram,
    tornado,
  };
}

export function buildScorecard(opts: {
  metro: MetroProfile;
  profile: PropertyProfile;
  dps: number;
  plays: RoiPlay[];
  census?: CensusTract | null;
  flood?: FloodIntel | null;
  walkScore?: number;
  amenityScore?: number;
  incentiveCount?: number;
}): SiteScorecard {
  const income = opts.census?.medianIncome ?? opts.metro.medianIncome;
  const bach = opts.census?.bachelorPlusPct ?? opts.metro.bachelorPlus;
  const owner = opts.census?.ownerOccPct ?? opts.metro.ownerOcc;
  const poverty = opts.census?.povertyPct ?? 12;
  const vacancy = opts.census?.vacancyPct ?? 6;
  const talent = clamp((income / 120000) * 45 + (bach / 60) * 40 + 15 - poverty * 0.4, 18, 96);
  const renoCost = clamp(100 - (opts.metro.costIndex - 0.8) * 90 - opts.metro.unemployment * 3, 22, 94);
  const incentive = clamp(48 + (opts.incentiveCount ?? 3) * 7 + (opts.flood?.sfha ? 4 : 0), 30, 92);
  const appr = clamp(40 + opts.metro.yoyAppreciation * 8 + (100 - vacancy) * 0.15, 22, 94);
  const insurance = clamp(
    88 - opts.metro.hailRisk * 28 - opts.metro.windRisk * 18 - (opts.flood?.sfha ? 22 : opts.metro.floodRisk * 16),
    12,
    94,
  );
  const hood = clamp(((opts.walkScore ?? 55) + (opts.amenityScore ?? 50)) / 2, 18, 96);
  const photo = clamp((opts.plays[0]?.roiPct ?? 60) * 0.7 + (100 - opts.dps) * 0.15, 24, 96);
  const tenure = clamp(owner * 0.7 + 20, 20, 92);

  const dimensions = [
    { id: "talent", label: "Labor / talent", score: Math.round(talent), weight: 0.14, note: `Income ${usd(income)} · bachelor+ ${bach.toFixed(0)}%` },
    { id: "reno", label: "Rehab cost", score: Math.round(renoCost), weight: 0.14, note: `Construction index ${opts.metro.costIndex.toFixed(2)}` },
    { id: "incentive", label: "Incentive capture", score: Math.round(incentive), weight: 0.1, note: `${opts.incentiveCount ?? 0} stacked programs` },
    { id: "appr", label: "Appreciation", score: Math.round(appr), weight: 0.16, note: `${opts.metro.yoyAppreciation.toFixed(1)}% metro CAGR` },
    { id: "ins", label: "Insurance friction", score: Math.round(insurance), weight: 0.16, note: opts.flood?.sfha ? `SFHA ${opts.flood.zone}` : "No SFHA hit" },
    { id: "hood", label: "Neighborhood amenity", score: Math.round(hood), weight: 0.12, note: `Walk proxy ${opts.walkScore ?? "n/a"}` },
    { id: "photo", label: "Photographable lift", score: Math.round(photo), weight: 0.1, note: `Top play ${opts.plays[0]?.label ?? "—"}` },
    { id: "tenure", label: "Tenure stability", score: Math.round(tenure), weight: 0.08, note: `Owner-occ ${owner.toFixed(0)}%` },
  ];
  const overall = Math.round(dimensions.reduce((s, d) => s + d.score * d.weight, 0));
  const verdict =
    overall >= 78
      ? "Deploy capital. Cheap class-lift plus a hold; insurance is the only hard gate."
      : overall >= 62
        ? "Workable. Buy the cheapest photographable package and do not over-improve."
        : overall >= 48
          ? "Selective. Underwrite insurance and access before any rehab budget."
          : "Pass unless basis is distressed enough to absorb the carry.";
  return { overall, verdict, dimensions };
}

function demographicsFrom(metro: MetroProfile, census: CensusTract | null) {
  if (!census) {
    return [
      { label: "Median income", value: usd(metro.medianIncome), detail: "ACS-style metro band" },
      { label: "Bachelor+", value: `${metro.bachelorPlus}%`, detail: "Educational attainment" },
      { label: "Median age", value: `${metro.medianAge}`, detail: "Household formation proxy" },
      { label: "HH size", value: metro.householdSize.toFixed(1), detail: "Occupancy pressure" },
      { label: "Owner-occ", value: `${metro.ownerOcc}%`, detail: "Tenure mix" },
      { label: "Unemployment", value: `${metro.unemployment.toFixed(1)}%`, detail: "Labor slack" },
    ];
  }
  return [
    { label: "Median income", value: census.medianIncome != null ? usd(census.medianIncome) : "—", detail: `Tract ${census.geoid}` },
    { label: "Home value", value: census.medianHomeValue != null ? usd(census.medianHomeValue) : "—", detail: "ACS B25077" },
    { label: "Gross rent", value: census.medianRent != null ? usd(census.medianRent) : "—", detail: "ACS B25064" },
    { label: "Bachelor+", value: census.bachelorPlusPct != null ? `${census.bachelorPlusPct.toFixed(0)}%` : "—", detail: "Age 25+" },
    { label: "Owner-occ", value: census.ownerOccPct != null ? `${census.ownerOccPct.toFixed(0)}%` : "—", detail: "Tenure mix" },
    { label: "Vacancy", value: census.vacancyPct != null ? `${census.vacancyPct.toFixed(1)}%` : "—", detail: "Housing units" },
    { label: "Poverty", value: census.povertyPct != null ? `${census.povertyPct.toFixed(1)}%` : "—", detail: "ACS B17001" },
    { label: "Transit commute", value: census.transitCommutePct != null ? `${census.transitCommutePct.toFixed(1)}%` : "—", detail: "Journey to work" },
    { label: "Median age", value: census.medianAge != null ? census.medianAge.toFixed(1) : "—", detail: "Household formation" },
    { label: "Population", value: census.population != null ? census.population.toLocaleString() : "—", detail: census.name },
    { label: "Year built (med)", value: census.medianYearBuilt != null ? String(Math.round(census.medianYearBuilt)) : "—", detail: "ACS B25035" },
    { label: "Households", value: census.households != null ? census.households.toLocaleString() : "—", detail: "Occupied + vacant" },
  ];
}

export function applyGroundTruth(dossier: Dossier, ground: GroundTruth, walkScore = 55, amenityScore = 50): Dossier {
  const census = ground.census;
  const flood = ground.flood;
  const building = ground.building;
  let { profile, valuation } = dossier;
  const metro = dossier.metro;

  if (building?.year) {
    const y = parseInt(building.year, 10);
    if (y > 1800 && y < 2027) profile = { ...profile, yearBuilt: y };
  }
  if (building?.levels && building.levels >= 1 && building.levels <= 6) {
    profile = { ...profile, stories: Math.round(building.levels) };
  }
  if (building?.roof) {
    profile = { ...profile, roofMaterial: building.roof };
  }

  if (census?.medianHomeValue && census.medianHomeValue > 40000) {
    const sizeAdj = profile.sqft / 1800;
    const blended = Math.round(valuation.estimate * 0.55 + census.medianHomeValue * sizeAdj * 0.45);
    const band = (valuation.high - valuation.low) / (2 * valuation.estimate);
    valuation = {
      ...valuation,
      estimate: blended,
      low: Math.round(blended * (1 - band)),
      high: Math.round(blended * (1 + band)),
      confidence: clamp(valuation.confidence + 0.08, 0.45, 0.9),
      method: "Ensemble AVM blended with ACS tract median home value (B25077)",
      psf: Math.round(blended / Math.max(1, profile.sqft)),
    };
  }

  const plays = playsFor(profile, metro, dossier.condition, valuation.estimate);
  const asIs = buildProForma({ price: valuation.estimate, rehab: 0, metro, state: dossier.pin.state, flood });
  const carry = buildCarry(valuation.estimate, metro, dossier.pin.state, asIs.monthlyPI, flood);
  const scenarios = buildScenarios(valuation.estimate, plays, metro, dossier.pin.state, flood);
  const dps = dossier.dps;
  const scorecard = buildScorecard({
    metro,
    profile,
    dps: dps.score,
    plays,
    census,
    flood,
    walkScore,
    amenityScore,
    incentiveCount: dossier.incentives.length,
  });
  const monteCarlo = runMonteCarlo({
    price: valuation.estimate,
    rehab: scenarios.find((s) => s.id === "refresh")?.rehab ?? plays.slice(0, 3).reduce((s, p) => s + p.costMid, 0),
    metro,
    state: dossier.pin.state,
    flood,
    seed: seedFromCoord(dossier.pin.lat, dossier.pin.lng),
  });

  const extraSources = [
    census
      ? { sourceType: "census_acs", sourceId: census.geoid, timestamp: new Date().toISOString(), meta: { vintage: "ACS 5-year 2023" } }
      : null,
    flood
      ? { sourceType: "fema_nfhl", sourceId: flood.zone, timestamp: new Date().toISOString(), meta: { sfha: String(flood.sfha) } }
      : null,
    building
      ? { sourceType: "osm_building", sourceId: building.use, timestamp: new Date().toISOString() }
      : null,
  ].filter(Boolean) as Dossier["evidence"]["sources"];

  return {
    ...dossier,
    profile,
    valuation,
    plays,
    carry,
    scenarios,
    census,
    flood,
    building,
    scorecard,
    monteCarlo,
    risks: risksFor(metro, dps.score, profile, flood),
    demographics: demographicsFrom(metro, census),
    investorFit: fitFor(metro, profile, plays, valuation.estimate),
    evidence: {
      ...dossier.evidence,
      sources: [...dossier.evidence.sources, ...extraSources],
      confidence: {
        ...dossier.evidence.confidence,
        overall: clamp(dossier.evidence.confidence.overall + (census ? 0.06 : 0) + (flood ? 0.04 : 0), 0.45, 0.9),
      },
    },
  };
}

export function scoreHarvest(hits: PropertyPin[]): HarvestScore[] {
  return hits.slice(0, 36).map((pin) => {
    const d = buildDossier(pin);
    return {
      pin,
      estimate: d.valuation.estimate,
      dps: d.dps.score,
      dpsTier: d.dps.tier,
      topPlay: d.plays[0]?.label ?? "—",
      roiPct: d.plays[0]?.roiPct ?? 0,
      yearBuilt: d.profile.yearBuilt,
      occupancy: d.profile.occupancy,
    };
  }).sort((a, b) => b.dps - a.dps);
}

export function buildDossier(pin: PropertyPin, nearbyHits: PropertyPin[] = [], ground?: GroundTruth | null): Dossier {
  const metro = metroFor(pin.city, pin.state);
  const rng = mulberry32(seedFromCoord(pin.lat, pin.lng) ^ 0x9e3779b9);
  let profile = buildProfile(pin.lat, pin.lng);
  if (ground?.building?.year) {
    const y = parseInt(ground.building.year, 10);
    if (y > 1800 && y < 2027) profile = { ...profile, yearBuilt: y };
  }
  if (ground?.building?.levels) profile = { ...profile, stories: Math.round(ground.building.levels) };
  const condition = conditionFor(profile, metro, rng);
  const sizeAdj = profile.sqft / 1800;
  const condAvg = FEATURE_KEYS.reduce((s, k) => s + condition[k].score, 0) / FEATURE_KEYS.length;
  let estimate = Math.round(metro.medianValue * sizeAdj * (0.82 + (condAvg / 100) * 0.36) * (0.94 + rng() * 0.12));
  let method = "Ensemble AVM — metro median × size × condition residual";
  let confidence = clamp(0.58 + condAvg / 400 + (pin.city ? 0.08 : 0), 0.45, 0.86);
  if (ground?.census?.medianHomeValue && ground.census.medianHomeValue > 40000) {
    estimate = Math.round(estimate * 0.55 + ground.census.medianHomeValue * sizeAdj * 0.45);
    method = "Ensemble AVM blended with ACS tract median home value (B25077)";
    confidence = clamp(confidence + 0.08, 0.45, 0.9);
  }
  const band = 0.07 + (1 - condAvg / 100) * 0.05;
  const dps = dpsFor(profile, metro, condition, pin.state);
  const plays = playsFor(profile, metro, condition, estimate);
  const now = new Date().toISOString();
  const start = estimate / Math.pow(1 + metro.yoyAppreciation / 100, 6);
  const appreciation = Array.from({ length: 7 }, (_, i) => ({
    year: String(2020 + i),
    value: Math.round(start * Math.pow(1 + metro.yoyAppreciation / 100, i) * (0.98 + rng() * 0.04)),
  }));
  const flood = ground?.flood ?? null;
  const census = ground?.census ?? null;
  const building = ground?.building ?? null;
  const asIs = buildProForma({ price: estimate, rehab: 0, metro, state: pin.state, flood });
  const carry = buildCarry(estimate, metro, pin.state, asIs.monthlyPI, flood);
  const scenarios = buildScenarios(estimate, plays, metro, pin.state, flood);
  const comps = overlayComps(pin, estimate, nearbyHits);
  const incentives = incentivesFor(pin.state, metro);
  const scorecard = buildScorecard({
    metro,
    profile,
    dps: dps.score,
    plays,
    census,
    flood,
    incentiveCount: incentives.length,
  });
  const monteCarlo = runMonteCarlo({
    price: estimate,
    rehab: scenarios.find((s) => s.id === "refresh")?.rehab ?? 0,
    metro,
    state: pin.state,
    flood,
    seed: seedFromCoord(pin.lat, pin.lng),
  });

  const thesis = `Cheapest class-lift on this parcel is ${plays[0]!.label.toLowerCase()} (modeled ${plays[0]!.roiPct.toFixed(0)}% ROI, mid cost ${usd(plays[0]!.costMid)}). Do not over-improve: the ${metro.name} buyer still pays for photographable curb, not a custom interior.`;

  const narrative = `${pin.address} in ${pin.city}, ${pin.state} models as a ${profile.yearBuilt} ${profile.stories}-story ${profile.construction} home, ${profile.sqft.toLocaleString()} sf, ${profile.beds} bed / ${profile.baths} bath. Metro median is ${usd(metro.medianValue)}; this parcel screens at ${usd(estimate)} (${Math.round(band * 100)}% band) given size and a ${Math.round(condAvg)} blended condition score. ${metro.narrative}`;

  return {
    pin,
    profile,
    metro,
    valuation: {
      estimate,
      low: Math.round(estimate * (1 - band)),
      high: Math.round(estimate * (1 + band)),
      confidence,
      method,
      asOf: now.slice(0, 10),
      psf: Math.round(estimate / Math.max(1, profile.sqft)),
    },
    condition,
    dps,
    plays,
    incentives,
    risks: risksFor(metro, dps.score, profile, flood),
    thesis,
    narrative,
    occupancyNote:
      profile.occupancy === "owner"
        ? "Modeled owner-occupied. Sales conversation is equity and insurance, not rent."
        : profile.occupancy === "rental"
          ? "Modeled as rental. Access and lease terms gate any exterior work."
          : "Modeled vacant. Fastest path is a photographed reset and a clean close.",
    investorFit: fitFor(metro, profile, plays, estimate),
    evidence: {
      evidenceId: id("evi"),
      createdAt: now,
      sources: [
        { sourceType: "osm", sourceId: `${pin.lat.toFixed(5)},${pin.lng.toFixed(5)}`, timestamp: now, meta: { provider: "Nominatim / OSM" } },
        { sourceType: "metro_benchmarks", sourceId: metro.id, timestamp: now, meta: { table: "PropertyInsight knowledge 2026 Q2" } },
        { sourceType: "nar_cost_value", sourceId: "2024 Cost vs Value", timestamp: now },
        { sourceType: "imagery", sourceId: "esri-world-imagery", timestamp: now },
        ...(census ? [{ sourceType: "census_acs", sourceId: census.geoid, timestamp: now, meta: { vintage: "ACS 5-year 2023" } }] : []),
        ...(flood ? [{ sourceType: "fema_nfhl", sourceId: flood.zone, timestamp: now }] : []),
      ],
      modelVersions: {
        avm: { version: "pi-avm-1.4" },
        dps: { version: "recon-dps-1.0" },
        roi: { version: "nar-2024-local-index" },
        proforma: { version: "pi-uw-1.1" },
        montecarlo: { version: "pi-mc-400" },
      },
      confidence: {
        overall: confidence,
        byStage: { acquisition: 0.9, segmentation: 0.62, alignment: 0.7, blending: 0.7, roi: 0.74 },
      },
      assertions: [
        { type: "value_estimate", value: String(estimate), explanation: method },
        { type: "dps", value: String(dps.score), explanation: dps.action },
        { type: "top_play", value: plays[0]!.id, explanation: plays[0]!.narrative },
        { type: "cap_rate", value: (asIs.capRate * 100).toFixed(2), explanation: "NOI / purchase price, as-is hold." },
        { type: "irr_p50", value: (monteCarlo.irr.p50 * 100).toFixed(1), explanation: "Monte Carlo p50 5-year IRR, refresh scenario." },
      ],
    },
    appreciation,
    demographics: demographicsFrom(metro, census),
    carry,
    scenarios,
    comps,
    imageryUrl: imageryUrl(pin.lat, pin.lng),
    enriched: false,
    census,
    flood,
    building,
    scorecard,
    monteCarlo,
  };
}

export function watchFromDossier(d: Dossier) {
  return {
    pin: d.pin,
    estimate: d.valuation.estimate,
    dps: d.dps.score,
    topPlay: d.plays[0]?.label ?? "—",
    roiPct: d.plays[0]?.roiPct ?? 0,
    capRate: d.scenarios[0]?.proForma.capRate ?? 0,
    irr5: d.scenarios.find((s) => s.id === "refresh")?.proForma.irr5 ?? 0,
  };
}
