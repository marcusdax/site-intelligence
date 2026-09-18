import { a as haversineMeters, l as seedFromCoord, o as id, s as mulberry32, t as clamp, u as usd } from "./utils-BOIfZi7B.mjs";
import { c as metroFor, i as HAIL_BELT, n as FEATURES, o as STATE_TAX_RATE, s as incentivesFor } from "./knowledge-_ynDysTG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-CoB_AfSa.js
var FEATURE_KEYS = [
	"garage_door",
	"roof",
	"windows",
	"siding",
	"paint",
	"landscaping"
];
function buildProfile(lat, lng) {
	const rng = mulberry32(seedFromCoord(lat, lng));
	const yearBuilt = 1948 + Math.floor(rng() * 72);
	const sqft = 980 + Math.floor(rng() * 2400);
	const beds = sqft > 2200 ? 4 : sqft > 1600 ? 3 : 2 + (rng() > .6 ? 1 : 0);
	const baths = Math.max(1, Math.round(beds * .7 * 2) / 2);
	const lotSqft = Math.round(sqft * (3.2 + rng() * 4));
	const stories = sqft > 2e3 && rng() > .45 ? 2 : 1;
	const occRoll = rng();
	const occupancy = occRoll > .92 ? "vacant" : occRoll > .78 ? "rental" : "owner";
	const construction = rng() > .55 ? "wood frame" : rng() > .4 ? "brick veneer" : "masonry";
	const roofMaterial = rng() > .72 ? "architectural shingle" : rng() > .5 ? "3-tab shingle" : rng() > .25 ? "metal" : "tile";
	const roofAge = Math.max(1, Math.min(32, Math.round((2026 - yearBuilt) * (.25 + rng() * .5))));
	const gRoll = rng();
	return {
		yearBuilt,
		sqft,
		beds,
		baths,
		lotSqft,
		stories,
		occupancy,
		construction,
		roofMaterial,
		roofAge,
		garage: gRoll > .85 ? "3-car" : gRoll > .45 ? "2-car" : gRoll > .18 ? "1-car" : "none"
	};
}
function conditionFor(profile, metro, rng) {
	const age = 2026 - profile.yearBuilt;
	const roofScore = clamp(100 - profile.roofAge * 3.4 - metro.hailRisk * 18 + rng() * 8, 18, 96);
	const paintScore = clamp(92 - age * .9 - metro.hailRisk * 6 - rng() * 12, 22, 94);
	const sidingScore = clamp(90 - age * .7 - (profile.construction === "wood frame" ? 8 : 0) - rng() * 10, 25, 95);
	const windowScore = clamp(88 - age * .85 - metro.windRisk * 10 - rng() * 8, 20, 94);
	const garageScore = profile.garage === "none" ? 70 : clamp(90 - age * .8 - rng() * 16, 18, 96);
	const landScore = clamp(86 - rng() * 28, 30, 94);
	const note = (s, good, mid, bad) => s > 78 ? good : s > 52 ? mid : bad;
	return {
		roof: {
			score: Math.round(roofScore),
			ageYears: profile.roofAge,
			note: note(roofScore, "Roof reads serviceable in recent imagery.", "Wear consistent with age; inspect flashing and field.", "Visible granule loss / curl risk — replacement window is open.")
		},
		paint: {
			score: Math.round(paintScore),
			note: note(paintScore, "Paint film intact.", "Chalking and isolated peel — cosmetic reset is cheap lift.", "Peel and fade will photograph poorly and invite moisture.")
		},
		siding: {
			score: Math.round(sidingScore),
			note: note(sidingScore, "Cladding aligned.", "Minor wave / fade; overlay or paint may suffice.", "Panel failure or moisture staining — budget a proper envelope fix.")
		},
		windows: {
			score: Math.round(windowScore),
			note: note(windowScore, "Glazing looks recent.", "Aging frames; energy and wind story is available.", "Failed seals or single-pane — replacement is both comfort and insurance.")
		},
		garage_door: {
			score: Math.round(garageScore),
			note: profile.garage === "none" ? "No garage — curb story lives in entry, paint, landscape." : note(garageScore, "Door is current.", "Tired door; highest-ROI visual swap on this facade.", "Dented or dated door dominates the elevation.")
		},
		landscaping: {
			score: Math.round(landScore),
			note: note(landScore, "Yard is held.", "Sparse plantings; an edge-and-mulch package would photograph.", "Overgrown or bare — cheap staging before any listing.")
		}
	};
}
function dpsFor(profile, metro, condition, state) {
	const hail = metro.hailRisk;
	const hailPts = Math.round(hail * 95);
	const roofVuln = Math.round(clamp(profile.roofAge / 28 * 100, 8, 96));
	const windPts = Math.round(metro.windRisk * 88);
	const duration = Math.round(30 + hail * 40);
	const materialAdj = profile.roofMaterial.includes("metal") ? -18 : profile.roofMaterial.includes("tile") ? -8 : 6;
	const prior = Math.round((100 - condition.roof.score) * .22);
	const weighted = hailPts * .38 + roofVuln * .28 + windPts * .16 + duration * .1 + clamp(50 + materialAdj, 0, 100) * .05 + prior * .03;
	const score = Math.round(clamp(weighted, 4, 98));
	const tier = score >= 90 ? "CRITICAL" : score >= 75 ? "HIGH" : score >= 55 ? "MODERATE" : score >= 30 ? "LOW" : "MINIMAL";
	const action = score >= 90 ? "Same-day field visit. Pre-position materials." : score >= 75 ? "Priority queue — 24-hour dispatch window." : score >= 55 ? "Marketing outreach: mail + digital with a render." : score >= 30 ? "Monitor. Revisit if a claim surfaces." : "Do not allocate restoration resources.";
	return {
		score,
		tier,
		factors: [
			{
				name: "Hail exposure",
				weight: 38,
				points: hailPts,
				note: HAIL_BELT.has(state) ? "Inside hail alley." : "Background hail probability."
			},
			{
				name: "Roof vulnerability",
				weight: 28,
				points: roofVuln,
				note: `${profile.roofAge} yr ${profile.roofMaterial}`
			},
			{
				name: "Wind",
				weight: 16,
				points: windPts,
				note: "Sustained vs. gust differential (modeled)."
			},
			{
				name: "Storm duration",
				weight: 10,
				points: duration,
				note: "Minutes at peak intensity, parcel class."
			},
			{
				name: "Material class",
				weight: 5,
				points: clamp(50 + materialAdj, 0, 100),
				note: profile.roofMaterial
			},
			{
				name: "Prior distress",
				weight: 3,
				points: prior,
				note: "Condition residual from imagery proxies."
			}
		],
		action
	};
}
function playsFor(profile, metro, condition, estimate) {
	const sizeFactor = clamp(profile.sqft / 1800, .75, 1.55);
	const plays = FEATURES.map((f) => {
		const cond = condition[f.key].score;
		const need = (100 - cond) / 100;
		const costMid = (f.costLow + f.costHigh) / 2 * metro.costIndex * sizeFactor;
		const costLow = f.costLow * metro.costIndex * sizeFactor * .92;
		const costHigh = f.costHigh * metro.costIndex * sizeFactor * 1.08;
		const roiAdj = f.roiPct * (.88 + need * .22) * (.96 + metro.yoyAppreciation * .01);
		const valueAdd = costMid * (roiAdj / 100);
		const rentLift = valueAdd * (metro.rentYield / 100) / 12;
		const paybackYears = rentLift > 0 ? costMid / (rentLift * 12) : 12;
		const demand = roiAdj > 78 || need > .45 ? "hot" : roiAdj > 55 ? "steady" : "soft";
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
			rank: 0
		};
	});
	plays.sort((a, b) => {
		const aa = a.roiPct * (1.1 - condition[a.id].score / 200);
		return b.roiPct * (1.1 - condition[b.id].score / 200) - aa;
	});
	return plays.map((p, i) => ({
		...p,
		rank: i + 1
	}));
}
function risksFor(metro, dps, profile, flood) {
	const items = [];
	if (metro.hailRisk > .7) items.push({
		label: "Hail",
		severity: dps > 74 ? "high" : "moderate",
		detail: "Parcel sits in a high-frequency hail corridor. Roof class and remaining life dominate carry cost."
	});
	if (flood?.sfha) items.push({
		label: "FEMA SFHA",
		severity: flood.zone.startsWith("V") ? "critical" : "high",
		detail: `National Flood Hazard Layer zone ${flood.zone}${flood.subtype ? ` (${flood.subtype})` : ""}. Flood insurance is an underwriting gate, not a footnote.`
	});
	else if (metro.floodRisk > .55) items.push({
		label: "Flood / surge",
		severity: metro.floodRisk > .75 ? "high" : "moderate",
		detail: "Water is a basis risk. Confirm flood zone and elevation before bidding."
	});
	if (metro.windRisk > .7) items.push({
		label: "Wind",
		severity: "high",
		detail: "Wind-mitigation credits and opening protection are underwriting, not optional cosmetics."
	});
	if (metro.wildfireRisk > .45) items.push({
		label: "Wildfire interface",
		severity: metro.wildfireRisk > .55 ? "high" : "moderate",
		detail: "Defensible space and ember-resistant cladding affect both insurance and appraisal."
	});
	if (profile.yearBuilt < 1978) items.push({
		label: "Lead / legacy systems",
		severity: "moderate",
		detail: "Pre-1978 stock. Budget for paint, wiring, and possible lead protocols on exterior work."
	});
	if (metro.yoyAppreciation < 1.2) items.push({
		label: "Price softness",
		severity: "moderate",
		detail: "Appreciation is thin. Do not over-improve; buy the cheapest class-lift that photographs."
	});
	if (items.length === 0) items.push({
		label: "Idiosyncratic",
		severity: "low",
		detail: "No metro-scale catastrophe spike. Residual risk is property-specific condition and title."
	});
	return items;
}
function fitFor(metro, profile, plays, estimate) {
	const rent = estimate * (metro.rentYield / 100) / 12;
	const brrrr = clamp(58 + metro.rentYield * 4 + (plays[0]?.roiPct ?? 0) * .15 - metro.costIndex * 10, 35, 92);
	const str = clamp(40 + metro.medianIncome / 4e3 + (profile.sqft > 1400 ? 8 : 0) - metro.unemployment * 2, 30, 90);
	const hold = clamp(55 + metro.yoyAppreciation * 4 + metro.ownerOcc * .15, 38, 92);
	const wholesale = clamp(50 + (100 - (plays.find((p) => p.id === "paint")?.roiPct ?? 50)) * .1 + (profile.occupancy === "vacant" ? 12 : 0), 28, 88);
	return [
		{
			strategy: "Fix and hold",
			score: Math.round(hold),
			why: `Modeled in-place yield ${metro.rentYield.toFixed(1)}% with ${metro.yoyAppreciation.toFixed(1)}% metro appreciation.`
		},
		{
			strategy: "BRRRR",
			score: Math.round(brrrr),
			why: `Rent proxy ${usd(rent)}/mo. Cheapest high-ROI play is ${plays[0]?.label ?? "paint"}.`
		},
		{
			strategy: "Short-term rental",
			score: Math.round(str),
			why: "STR depends on local ordinance — treat this as demand, not a permit."
		},
		{
			strategy: "Wholesale / assign",
			score: Math.round(wholesale),
			why: profile.occupancy === "vacant" ? "Vacant stock moves faster through assignment if the render is ready." : "Occupied — allow for access and tenant friction."
		}
	].sort((a, b) => b.score - a.score);
}
function monthlyPI(principal, annualRate, years) {
	const r = annualRate / 12;
	const n = years * 12;
	if (r === 0) return principal / n;
	return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}
function remainingLoan(principal, annualRate, years, afterYears) {
	const r = annualRate / 12;
	const k = afterYears * 12;
	const p = monthlyPI(principal, annualRate, years);
	if (r === 0) return Math.max(0, principal - p * k);
	return principal * Math.pow(1 + r, k) - p * (Math.pow(1 + r, k) - 1) / r;
}
function irr(cashflows) {
	let lo = -.4;
	let hi = 1.6;
	for (let i = 0; i < 48; i++) {
		const mid = (lo + hi) / 2;
		if (cashflows.reduce((s, c, t) => s + c / Math.pow(1 + mid, t), 0) > 0) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}
function buildCarry(estimate, metro, state, monthlyPIAmt, flood) {
	const taxRate = STATE_TAX_RATE[state.toUpperCase()] ?? STATE_TAX_RATE.US;
	const taxAnnual = estimate * taxRate;
	let insRate = .0042 + metro.hailRisk * .0038 + metro.windRisk * .0044 + metro.floodRisk * .0028 + metro.wildfireRisk * .0022;
	if (flood?.sfha) insRate += .0045;
	const insuranceAnnual = estimate * insRate;
	const notes = [];
	if (metro.hailRisk > .7) notes.push("hail loading");
	if (metro.windRisk > .7) notes.push("wind mitigation");
	if (flood?.sfha) notes.push(`FEMA ${flood.zone}`);
	else if (metro.floodRisk > .55) notes.push("flood overlay");
	if (metro.wildfireRisk > .45) notes.push("WUI");
	return {
		taxRate,
		taxAnnual: Math.round(taxAnnual),
		insuranceAnnual: Math.round(insuranceAnnual),
		insuranceNote: notes.length ? `Loaded for ${notes.join(", ")}.` : "Baseline HO-3 style premium.",
		vacancyPct: .05,
		maintenancePct: .08,
		mgmtPct: .08,
		pitiMonthly: Math.round(monthlyPIAmt + taxAnnual / 12 + insuranceAnnual / 12)
	};
}
function buildProForma(opts) {
	const downPct = opts.downPct ?? .2;
	const rate = opts.rate ?? .0675;
	const termYears = 30;
	const price = opts.price;
	const rehab = opts.rehab;
	const downPayment = price * downPct;
	const loan = price - downPayment;
	const closingCost = price * .025;
	const cashIn = downPayment + closingCost + rehab;
	const pi = monthlyPI(loan, rate, termYears);
	const carry = buildCarry(price + rehab * .35, opts.metro, opts.state, pi, opts.flood);
	if (opts.vacancyPct != null) carry.vacancyPct = opts.vacancyPct;
	if (opts.insMult != null) carry.insuranceAnnual = Math.round(carry.insuranceAnnual * opts.insMult);
	const yieldPct = opts.rentYield ?? opts.metro.rentYield;
	const grossRentAnnual = (price + rehab * .55) * (yieldPct / 100);
	const egi = grossRentAnnual * (1 - carry.vacancyPct);
	const opex = carry.taxAnnual + carry.insuranceAnnual + egi * (carry.maintenancePct + carry.mgmtPct);
	const noi = egi - opex;
	const debtService = pi * 12;
	const cashFlow = noi - debtService;
	const capRate = noi / Math.max(1, price + rehab);
	const cashOnCash = cashFlow / Math.max(1, cashIn);
	const dscr = noi / Math.max(1, debtService);
	const appr = (opts.appr ?? opts.metro.yoyAppreciation) / 100;
	const years = [];
	const cfs = [-cashIn];
	for (let y = 1; y <= 5; y++) {
		const value = (price + rehab * .7) * Math.pow(1 + appr, y);
		const rent = grossRentAnnual * Math.pow(1.025, y - 1);
		const yNoi = rent * (1 - carry.vacancyPct) - opex * Math.pow(1.02, y - 1);
		const yCf = yNoi - debtService;
		const equity = value - remainingLoan(loan, rate, termYears, y);
		years.push({
			year: y,
			label: `Y${y}`,
			rent: Math.round(rent),
			noi: Math.round(yNoi),
			debtService: Math.round(debtService),
			cashFlow: Math.round(yCf),
			value: Math.round(value),
			equity: Math.round(equity)
		});
		cfs.push(y === 5 ? yCf + equity : yCf);
	}
	const exitValue = years[4].value;
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
		equityMultiple5: years[4].equity / Math.max(1, cashIn),
		exitValue: Math.round(exitValue),
		remainingLoan5: Math.round(remainingLoan5)
	};
}
function buildScenarios(estimate, plays, metro, state, flood) {
	const byId = (k) => plays.find((p) => p.id === k);
	const sum = (keys) => keys.reduce((s, k) => s + (byId(k)?.costMid ?? 0), 0);
	const add = (keys) => keys.reduce((s, k) => s + (byId(k)?.valueAdd ?? 0), 0);
	const curbKeys = [
		"paint",
		"landscaping",
		"garage_door"
	];
	const refreshKeys = plays.slice(0, 3).map((p) => p.id);
	const envelopeKeys = FEATURE_KEYS;
	const mk = (sid, label, blurb, features, weeks, arvBoost = 1) => {
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
			proForma: buildProForma({
				price: estimate,
				rehab,
				metro,
				state,
				flood
			})
		};
	};
	const brrrr = mk("brrrr", "BRRRR exterior", "Rehab the envelope, season rent, then refinance at 70% of ARV.", refreshKeys, 16, 1.02);
	const refiLoan = brrrr.arv * .7;
	const recovered = Math.max(0, refiLoan - brrrr.proForma.loan);
	const newCashIn = Math.max(8e3, brrrr.proForma.cashIn - recovered * .85);
	brrrr.proForma = {
		...brrrr.proForma,
		cashIn: Math.round(newCashIn),
		cashOnCash: brrrr.proForma.monthlyCashFlow * 12 / Math.max(1, newCashIn)
	};
	return [
		mk("as_is", "Hold as-is", "No rehab. Carry the basis and let rent do the work.", [], 0),
		mk("curb", "Curb-appeal reset", "Paint, landscape, garage door — cheapest photographable lift.", curbKeys, 3),
		mk("refresh", "Exterior refresh", "Top three ROI plays on this parcel, sequenced for listing photography.", refreshKeys, 8),
		mk("envelope", "Full envelope", "Roof, windows, siding, paint, door, landscape. Insurance and class story.", envelopeKeys, 14),
		brrrr
	];
}
function buildSyntheticComps(pin, estimate) {
	const rng = mulberry32(seedFromCoord(pin.lat, pin.lng) ^ 20973);
	const streets = [
		"Maple",
		"Oak",
		"Cedar",
		"Elm",
		"Pine",
		"Walnut",
		"Hickory",
		"Birch"
	];
	const comps = [];
	for (let i = 0; i < 6; i++) {
		const dLat = (rng() - .5) * .012;
		const dLng = (rng() - .5) * .012;
		const lat = pin.lat + dLat;
		const lng = pin.lng + dLng;
		const profile = buildProfile(lat, lng);
		const delta = (rng() - .48) * .18;
		const value = Math.round(estimate * (1 + delta) * (profile.sqft / 1800) * .55 + estimate * .5);
		comps.push({
			id: `comp_${i}`,
			address: `${1200 + Math.floor(rng() * 4800)} ${streets[i % streets.length]} ${rng() > .5 ? "St" : "Ave"}`,
			lat,
			lng,
			distanceM: haversineMeters(pin, {
				lat,
				lng
			}),
			estimate: value,
			beds: profile.beds,
			sqft: profile.sqft,
			yearBuilt: profile.yearBuilt,
			deltaPct: (value - estimate) / estimate * 100
		});
	}
	return comps.sort((a, b) => a.distanceM - b.distanceM);
}
function overlayComps(pin, estimate, hits) {
	if (!hits.length) return buildSyntheticComps(pin, estimate);
	return hits.slice(0, 8).map((h, i) => {
		const profile = buildProfile(h.lat, h.lng);
		const value = Math.round(estimate * (.88 + profile.sqft / 2e3 * .22));
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
			deltaPct: (value - estimate) / estimate * 100
		};
	});
}
function imageryUrl(lat, lng) {
	return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${lng - .0012},${lat - 8e-4},${lng + .0012},${lat + 8e-4}&bboxSR=4326&imageSR=4326&size=720,420&format=jpg&f=image`;
}
function percentile(sorted, p) {
	if (!sorted.length) return 0;
	const i = (sorted.length - 1) * p;
	const lo = Math.floor(i);
	const hi = Math.ceil(i);
	if (lo === hi) return sorted[lo];
	return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
function distOf(values) {
	const s = [...values].sort((a, b) => a - b);
	return {
		p10: percentile(s, .1),
		p50: percentile(s, .5),
		p90: percentile(s, .9)
	};
}
function runMonteCarlo(opts) {
	const n = opts.n ?? 400;
	const rng = mulberry32(opts.seed ?? seedFromCoord(opts.price, opts.rehab) ^ 12648430);
	const irrs = [];
	const cocs = [];
	const cfs = [];
	for (let i = 0; i < n; i++) {
		const rentYield = opts.metro.rentYield * (.85 + rng() * .3);
		const vacancyPct = .03 + rng() * .09;
		const appr = opts.metro.yoyAppreciation + (rng() - .5) * 4;
		const insMult = .8 + rng() * .5;
		const rehab = opts.rehab * (.85 + rng() * .3);
		const pf = buildProForma({
			price: opts.price,
			rehab,
			metro: opts.metro,
			state: opts.state,
			rentYield,
			vacancyPct,
			appr,
			insMult,
			flood: opts.flood
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
		flood: opts.flood
	});
	const tornado = [
		{
			driver: "Rent yield",
			lowMult: { rentYield: opts.metro.rentYield * .85 },
			highMult: { rentYield: opts.metro.rentYield * 1.15 }
		},
		{
			driver: "Vacancy",
			lowMult: { vacancyPct: .12 },
			highMult: { vacancyPct: .03 }
		},
		{
			driver: "Appreciation",
			lowMult: { appr: opts.metro.yoyAppreciation - 2 },
			highMult: { appr: opts.metro.yoyAppreciation + 2 }
		},
		{
			driver: "Insurance",
			lowMult: { insMult: 1.3 },
			highMult: { insMult: .8 }
		},
		{
			driver: "Rehab cost",
			lowMult: { rehab: opts.rehab * 1.2 },
			highMult: { rehab: opts.rehab * .85 }
		}
	].map((d) => {
		const low = buildProForma({
			price: opts.price,
			rehab: opts.rehab,
			metro: opts.metro,
			state: opts.state,
			flood: opts.flood,
			...d.lowMult
		}).irr5;
		const high = buildProForma({
			price: opts.price,
			rehab: opts.rehab,
			metro: opts.metro,
			state: opts.state,
			flood: opts.flood,
			...d.highMult
		}).irr5;
		return {
			driver: d.driver,
			low,
			high,
			base: base.irr5
		};
	});
	const histogram = [
		"<0%",
		"0–4%",
		"4–8%",
		"8–12%",
		"12–16%",
		"16%+"
	].map((bucket) => ({
		bucket,
		count: 0
	}));
	for (const v of irrs) {
		const pct = v * 100;
		const idx = pct < 0 ? 0 : pct < 4 ? 1 : pct < 8 ? 2 : pct < 12 ? 3 : pct < 16 ? 4 : 5;
		histogram[idx].count += 1;
	}
	return {
		n,
		irr: distOf(irrs),
		coc: distOf(cocs),
		monthlyCf: distOf(cfs),
		histogram,
		tornado
	};
}
function buildScorecard(opts) {
	const income = opts.census?.medianIncome ?? opts.metro.medianIncome;
	const bach = opts.census?.bachelorPlusPct ?? opts.metro.bachelorPlus;
	const owner = opts.census?.ownerOccPct ?? opts.metro.ownerOcc;
	const poverty = opts.census?.povertyPct ?? 12;
	const vacancy = opts.census?.vacancyPct ?? 6;
	const talent = clamp(income / 12e4 * 45 + bach / 60 * 40 + 15 - poverty * .4, 18, 96);
	const renoCost = clamp(100 - (opts.metro.costIndex - .8) * 90 - opts.metro.unemployment * 3, 22, 94);
	const incentive = clamp(48 + (opts.incentiveCount ?? 3) * 7 + (opts.flood?.sfha ? 4 : 0), 30, 92);
	const appr = clamp(40 + opts.metro.yoyAppreciation * 8 + (100 - vacancy) * .15, 22, 94);
	const insurance = clamp(88 - opts.metro.hailRisk * 28 - opts.metro.windRisk * 18 - (opts.flood?.sfha ? 22 : opts.metro.floodRisk * 16), 12, 94);
	const hood = clamp(((opts.walkScore ?? 55) + (opts.amenityScore ?? 50)) / 2, 18, 96);
	const photo = clamp((opts.plays[0]?.roiPct ?? 60) * .7 + (100 - opts.dps) * .15, 24, 96);
	const tenure = clamp(owner * .7 + 20, 20, 92);
	const dimensions = [
		{
			id: "talent",
			label: "Labor / talent",
			score: Math.round(talent),
			weight: .14,
			note: `Income ${usd(income)} · bachelor+ ${bach.toFixed(0)}%`
		},
		{
			id: "reno",
			label: "Rehab cost",
			score: Math.round(renoCost),
			weight: .14,
			note: `Construction index ${opts.metro.costIndex.toFixed(2)}`
		},
		{
			id: "incentive",
			label: "Incentive capture",
			score: Math.round(incentive),
			weight: .1,
			note: `${opts.incentiveCount ?? 0} stacked programs`
		},
		{
			id: "appr",
			label: "Appreciation",
			score: Math.round(appr),
			weight: .16,
			note: `${opts.metro.yoyAppreciation.toFixed(1)}% metro CAGR`
		},
		{
			id: "ins",
			label: "Insurance friction",
			score: Math.round(insurance),
			weight: .16,
			note: opts.flood?.sfha ? `SFHA ${opts.flood.zone}` : "No SFHA hit"
		},
		{
			id: "hood",
			label: "Neighborhood amenity",
			score: Math.round(hood),
			weight: .12,
			note: `Walk proxy ${opts.walkScore ?? "n/a"}`
		},
		{
			id: "photo",
			label: "Photographable lift",
			score: Math.round(photo),
			weight: .1,
			note: `Top play ${opts.plays[0]?.label ?? "—"}`
		},
		{
			id: "tenure",
			label: "Tenure stability",
			score: Math.round(tenure),
			weight: .08,
			note: `Owner-occ ${owner.toFixed(0)}%`
		}
	];
	const overall = Math.round(dimensions.reduce((s, d) => s + d.score * d.weight, 0));
	return {
		overall,
		verdict: overall >= 78 ? "Deploy capital. Cheap class-lift plus a hold; insurance is the only hard gate." : overall >= 62 ? "Workable. Buy the cheapest photographable package and do not over-improve." : overall >= 48 ? "Selective. Underwrite insurance and access before any rehab budget." : "Pass unless basis is distressed enough to absorb the carry.",
		dimensions
	};
}
function demographicsFrom(metro, census) {
	if (!census) return [
		{
			label: "Median income",
			value: usd(metro.medianIncome),
			detail: "ACS-style metro band"
		},
		{
			label: "Bachelor+",
			value: `${metro.bachelorPlus}%`,
			detail: "Educational attainment"
		},
		{
			label: "Median age",
			value: `${metro.medianAge}`,
			detail: "Household formation proxy"
		},
		{
			label: "HH size",
			value: metro.householdSize.toFixed(1),
			detail: "Occupancy pressure"
		},
		{
			label: "Owner-occ",
			value: `${metro.ownerOcc}%`,
			detail: "Tenure mix"
		},
		{
			label: "Unemployment",
			value: `${metro.unemployment.toFixed(1)}%`,
			detail: "Labor slack"
		}
	];
	return [
		{
			label: "Median income",
			value: census.medianIncome != null ? usd(census.medianIncome) : "—",
			detail: `Tract ${census.geoid}`
		},
		{
			label: "Home value",
			value: census.medianHomeValue != null ? usd(census.medianHomeValue) : "—",
			detail: "ACS B25077"
		},
		{
			label: "Gross rent",
			value: census.medianRent != null ? usd(census.medianRent) : "—",
			detail: "ACS B25064"
		},
		{
			label: "Bachelor+",
			value: census.bachelorPlusPct != null ? `${census.bachelorPlusPct.toFixed(0)}%` : "—",
			detail: "Age 25+"
		},
		{
			label: "Owner-occ",
			value: census.ownerOccPct != null ? `${census.ownerOccPct.toFixed(0)}%` : "—",
			detail: "Tenure mix"
		},
		{
			label: "Vacancy",
			value: census.vacancyPct != null ? `${census.vacancyPct.toFixed(1)}%` : "—",
			detail: "Housing units"
		},
		{
			label: "Poverty",
			value: census.povertyPct != null ? `${census.povertyPct.toFixed(1)}%` : "—",
			detail: "ACS B17001"
		},
		{
			label: "Transit commute",
			value: census.transitCommutePct != null ? `${census.transitCommutePct.toFixed(1)}%` : "—",
			detail: "Journey to work"
		},
		{
			label: "Median age",
			value: census.medianAge != null ? census.medianAge.toFixed(1) : "—",
			detail: "Household formation"
		},
		{
			label: "Population",
			value: census.population != null ? census.population.toLocaleString() : "—",
			detail: census.name
		},
		{
			label: "Year built (med)",
			value: census.medianYearBuilt != null ? String(Math.round(census.medianYearBuilt)) : "—",
			detail: "ACS B25035"
		},
		{
			label: "Households",
			value: census.households != null ? census.households.toLocaleString() : "—",
			detail: "Occupied + vacant"
		}
	];
}
function scoreHarvest(hits) {
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
			occupancy: d.profile.occupancy
		};
	}).sort((a, b) => b.dps - a.dps);
}
function buildDossier(pin, nearbyHits = [], ground) {
	const metro = metroFor(pin.city, pin.state);
	const rng = mulberry32(seedFromCoord(pin.lat, pin.lng) ^ 2654435769);
	let profile = buildProfile(pin.lat, pin.lng);
	if (ground?.building?.year) {
		const y = parseInt(ground.building.year, 10);
		if (y > 1800 && y < 2027) profile = {
			...profile,
			yearBuilt: y
		};
	}
	if (ground?.building?.levels) profile = {
		...profile,
		stories: Math.round(ground.building.levels)
	};
	const condition = conditionFor(profile, metro, rng);
	const sizeAdj = profile.sqft / 1800;
	const condAvg = FEATURE_KEYS.reduce((s, k) => s + condition[k].score, 0) / FEATURE_KEYS.length;
	let estimate = Math.round(metro.medianValue * sizeAdj * (.82 + condAvg / 100 * .36) * (.94 + rng() * .12));
	let method = "Ensemble AVM — metro median × size × condition residual";
	let confidence = clamp(.58 + condAvg / 400 + (pin.city ? .08 : 0), .45, .86);
	if (ground?.census?.medianHomeValue && ground.census.medianHomeValue > 4e4) {
		estimate = Math.round(estimate * .55 + ground.census.medianHomeValue * sizeAdj * .45);
		method = "Ensemble AVM blended with ACS tract median home value (B25077)";
		confidence = clamp(confidence + .08, .45, .9);
	}
	const band = .07 + (1 - condAvg / 100) * .05;
	const dps = dpsFor(profile, metro, condition, pin.state);
	const plays = playsFor(profile, metro, condition, estimate);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const start = estimate / Math.pow(1 + metro.yoyAppreciation / 100, 6);
	const appreciation = Array.from({ length: 7 }, (_, i) => ({
		year: String(2020 + i),
		value: Math.round(start * Math.pow(1 + metro.yoyAppreciation / 100, i) * (.98 + rng() * .04))
	}));
	const flood = ground?.flood ?? null;
	const census = ground?.census ?? null;
	const building = ground?.building ?? null;
	const asIs = buildProForma({
		price: estimate,
		rehab: 0,
		metro,
		state: pin.state,
		flood
	});
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
		incentiveCount: incentives.length
	});
	const monteCarlo = runMonteCarlo({
		price: estimate,
		rehab: scenarios.find((s) => s.id === "refresh")?.rehab ?? 0,
		metro,
		state: pin.state,
		flood,
		seed: seedFromCoord(pin.lat, pin.lng)
	});
	const thesis = `Cheapest class-lift on this parcel is ${plays[0].label.toLowerCase()} (modeled ${plays[0].roiPct.toFixed(0)}% ROI, mid cost ${usd(plays[0].costMid)}). Do not over-improve: the ${metro.name} buyer still pays for photographable curb, not a custom interior.`;
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
			psf: Math.round(estimate / Math.max(1, profile.sqft))
		},
		condition,
		dps,
		plays,
		incentives,
		risks: risksFor(metro, dps.score, profile, flood),
		thesis,
		narrative,
		occupancyNote: profile.occupancy === "owner" ? "Modeled owner-occupied. Sales conversation is equity and insurance, not rent." : profile.occupancy === "rental" ? "Modeled as rental. Access and lease terms gate any exterior work." : "Modeled vacant. Fastest path is a photographed reset and a clean close.",
		investorFit: fitFor(metro, profile, plays, estimate),
		evidence: {
			evidenceId: id("evi"),
			createdAt: now,
			sources: [
				{
					sourceType: "osm",
					sourceId: `${pin.lat.toFixed(5)},${pin.lng.toFixed(5)}`,
					timestamp: now,
					meta: { provider: "Nominatim / OSM" }
				},
				{
					sourceType: "metro_benchmarks",
					sourceId: metro.id,
					timestamp: now,
					meta: { table: "PropertyInsight knowledge 2026 Q2" }
				},
				{
					sourceType: "nar_cost_value",
					sourceId: "2024 Cost vs Value",
					timestamp: now
				},
				{
					sourceType: "imagery",
					sourceId: "esri-world-imagery",
					timestamp: now
				},
				...census ? [{
					sourceType: "census_acs",
					sourceId: census.geoid,
					timestamp: now,
					meta: { vintage: "ACS 5-year 2023" }
				}] : [],
				...flood ? [{
					sourceType: "fema_nfhl",
					sourceId: flood.zone,
					timestamp: now
				}] : []
			],
			modelVersions: {
				avm: { version: "pi-avm-1.4" },
				dps: { version: "recon-dps-1.0" },
				roi: { version: "nar-2024-local-index" },
				proforma: { version: "pi-uw-1.1" },
				montecarlo: { version: "pi-mc-400" }
			},
			confidence: {
				overall: confidence,
				byStage: {
					acquisition: .9,
					segmentation: .62,
					alignment: .7,
					blending: .7,
					roi: .74
				}
			},
			assertions: [
				{
					type: "value_estimate",
					value: String(estimate),
					explanation: method
				},
				{
					type: "dps",
					value: String(dps.score),
					explanation: dps.action
				},
				{
					type: "top_play",
					value: plays[0].id,
					explanation: plays[0].narrative
				},
				{
					type: "cap_rate",
					value: (asIs.capRate * 100).toFixed(2),
					explanation: "NOI / purchase price, as-is hold."
				},
				{
					type: "irr_p50",
					value: (monteCarlo.irr.p50 * 100).toFixed(1),
					explanation: "Monte Carlo p50 5-year IRR, refresh scenario."
				}
			]
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
		monteCarlo
	};
}
function watchFromDossier(d) {
	return {
		pin: d.pin,
		estimate: d.valuation.estimate,
		dps: d.dps.score,
		topPlay: d.plays[0]?.label ?? "—",
		roiPct: d.plays[0]?.roiPct ?? 0,
		capRate: d.scenarios[0]?.proForma.capRate ?? 0,
		irr5: d.scenarios.find((s) => s.id === "refresh")?.proForma.irr5 ?? 0
	};
}
//#endregion
export { watchFromDossier as i, overlayComps as n, scoreHarvest as r, buildDossier as t };
