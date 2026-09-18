//#region node_modules/.nitro/vite/services/ssr/assets/knowledge-_ynDysTG.js
var FEATURES = [
	{
		key: "garage_door",
		label: "Garage door",
		roiPct: 93.8,
		costLow: 1400,
		costHigh: 4200,
		market: "$2.8B"
	},
	{
		key: "siding",
		label: "Siding",
		roiPct: 80.1,
		costLow: 1e4,
		costHigh: 25e3,
		market: "$9.7B"
	},
	{
		key: "roof",
		label: "Roofing",
		roiPct: 68.2,
		costLow: 8e3,
		costHigh: 25e3,
		market: "$28.5B"
	},
	{
		key: "windows",
		label: "Windows",
		roiPct: 67.4,
		costLow: 5e3,
		costHigh: 15e3,
		market: "$12.4B"
	},
	{
		key: "paint",
		label: "Exterior paint",
		roiPct: 55.2,
		costLow: 3e3,
		costHigh: 7200,
		market: "$6.2B"
	},
	{
		key: "landscaping",
		label: "Curb landscape",
		roiPct: 48,
		costLow: 1800,
		costHigh: 8500,
		market: "$4.1B"
	}
];
var FEATURE_STYLES = {
	garage_door: [
		{
			id: "carriage",
			label: "Carriage black",
			prompt: "a modern matte black carriage-style garage door with decorative hardware and frosted glass lites"
		},
		{
			id: "glass",
			label: "Full-view glass",
			prompt: "a contemporary full-view aluminum and frosted-glass garage door, slim black frames"
		},
		{
			id: "wood",
			label: "Warm cedar",
			prompt: "a horizontal cedar-plank garage door with a warm natural stain and black handles"
		},
		{
			id: "white",
			label: "Classic raised panel",
			prompt: "a crisp white raised-panel steel garage door, clean and well-proportioned"
		}
	],
	roof: [
		{
			id: "arch",
			label: "Architectural shingle",
			prompt: "a new architectural asphalt-shingle roof in charcoal gray, clean ridges and even courses"
		},
		{
			id: "metal",
			label: "Standing-seam metal",
			prompt: "a standing-seam metal roof in dark bronze, precise seams, no rust"
		},
		{
			id: "slate",
			label: "Synthetic slate",
			prompt: "a synthetic slate roof in deep graphite with crisp edges"
		}
	],
	windows: [{
		id: "black",
		label: "Black framed",
		prompt: "new black-framed vinyl windows with crisp grids, replacing old frames in the same openings"
	}, {
		id: "white",
		label: "White energy",
		prompt: "new white energy-efficient windows with low-E glass, same openings and trim"
	}],
	siding: [
		{
			id: "board",
			label: "Board and batten",
			prompt: "fresh vertical board-and-batten siding in warm greige, replacing worn siding"
		},
		{
			id: "lap",
			label: "James Hardie lap",
			prompt: "new fiber-cement lap siding in a muted sage, tight joints, no peeling"
		},
		{
			id: "brick",
			label: "Painted brick",
			prompt: "the brick facade freshly limewashed in a warm off-white, mortar intact"
		}
	],
	paint: [
		{
			id: "ink",
			label: "Ink body / cream trim",
			prompt: "the house freshly painted: deep ink body, cream trim, and a sage front door, no peeling"
		},
		{
			id: "sand",
			label: "Warm sand",
			prompt: "the house freshly painted in a warm sand color with white trim and black accents"
		},
		{
			id: "olive",
			label: "Olive contemporary",
			prompt: "the house freshly painted in a muted olive with black window frames and a natural wood door"
		}
	],
	landscaping: [{
		id: "native",
		label: "Native drought",
		prompt: "a freshly landscaped front yard with native drought-tolerant plantings, gravel paths, and a tidy lawn edge"
	}, {
		id: "lush",
		label: "Lush traditional",
		prompt: "a lush, freshly edged lawn, boxwoods, and seasonal flowers framing the facade"
	}]
};
var HAIL_BELT = /* @__PURE__ */ new Set([
	"TX",
	"OK",
	"KS",
	"NE",
	"CO",
	"MO",
	"AR",
	"IA",
	"SD",
	"WY",
	"NM",
	"IL"
]);
/** Effective residential property-tax rates (approx. 2024–26). */
var STATE_TAX_RATE = {
	TX: .0181,
	OK: .0087,
	FL: .0089,
	AZ: .0062,
	CO: .0051,
	GA: .0092,
	IL: .0216,
	CA: .0076,
	NY: .0173,
	OH: .0156,
	PA: .0153,
	MI: .0149,
	NC: .0084,
	SC: .0057,
	VA: .0082,
	WA: .0092,
	OR: .0097,
	NV: .006,
	TN: .0067,
	MO: .0097,
	KS: .0141,
	NE: .0163,
	LA: .0055,
	AL: .0041,
	MS: .0081,
	AR: .0062,
	MN: .0111,
	WI: .0168,
	IN: .0085,
	KY: .0086,
	MD: .0109,
	MA: .0114,
	NJ: .0223,
	UT: .0058,
	NM: .008,
	IA: .0153,
	CT: .0205,
	US: .011
};
var METROS = [
	{
		id: "dfw",
		name: "Dallas–Fort Worth",
		state: "TX",
		medianValue: 412e3,
		yoyAppreciation: 3.4,
		rentYield: 5.1,
		costIndex: .96,
		hailRisk: .86,
		windRisk: .62,
		floodRisk: .28,
		wildfireRisk: .18,
		unemployment: 3.8,
		medianIncome: 82500,
		bachelorPlus: 37,
		medianAge: 35,
		householdSize: 2.8,
		ownerOcc: 62,
		narrative: "Hail-belt growth metro with strong in-migration, contractor density, and a deep rental book. Exterior resets (garage, roof, siding) convert unusually well because curb appeal is the primary listing filter."
	},
	{
		id: "hou",
		name: "Houston",
		state: "TX",
		medianValue: 318e3,
		yoyAppreciation: 2.1,
		rentYield: 6.2,
		costIndex: .94,
		hailRisk: .54,
		windRisk: .78,
		floodRisk: .72,
		wildfireRisk: .12,
		unemployment: 4.3,
		medianIncome: 70800,
		bachelorPlus: 34,
		medianAge: 34,
		householdSize: 2.9,
		ownerOcc: 59,
		narrative: "Energy-tied, flood-aware market. Wind and moisture drive roofing and window demand; insurance friction is a real underwriting input."
	},
	{
		id: "mia",
		name: "Miami–Fort Lauderdale",
		state: "FL",
		medianValue: 545e3,
		yoyAppreciation: 4.8,
		rentYield: 4.4,
		costIndex: 1.18,
		hailRisk: .12,
		windRisk: .91,
		floodRisk: .81,
		wildfireRisk: .08,
		unemployment: 3.1,
		medianIncome: 68400,
		bachelorPlus: 36,
		medianAge: 41,
		householdSize: 2.6,
		ownerOcc: 55,
		narrative: "Insurance and wind mitigation dominate. Impact windows, roof straps, and elevation narratives price into both value and carry."
	},
	{
		id: "tpa",
		name: "Tampa–St. Petersburg",
		state: "FL",
		medianValue: 389e3,
		yoyAppreciation: 3.9,
		rentYield: 5,
		costIndex: 1.04,
		hailRisk: .16,
		windRisk: .84,
		floodRisk: .66,
		wildfireRisk: .1,
		unemployment: 3.4,
		medianIncome: 69200,
		bachelorPlus: 33,
		medianAge: 42,
		householdSize: 2.5,
		ownerOcc: 64,
		narrative: "In-migration plus aging housing stock. Roof and window packages with wind-mitigation certificates are the high-velocity play."
	},
	{
		id: "okc",
		name: "Oklahoma City",
		state: "OK",
		medianValue: 228e3,
		yoyAppreciation: 4.1,
		rentYield: 6.8,
		costIndex: .82,
		hailRisk: .92,
		windRisk: .74,
		floodRisk: .22,
		wildfireRisk: .2,
		unemployment: 3.2,
		medianIncome: 61200,
		bachelorPlus: 32,
		medianAge: 35,
		householdSize: 2.6,
		ownerOcc: 63,
		narrative: "Core hail alley. Composition roofs age fast; DPS-led contractor dispatch is the commercial wedge."
	},
	{
		id: "phx",
		name: "Phoenix–Mesa",
		state: "AZ",
		medianValue: 448e3,
		yoyAppreciation: 1.6,
		rentYield: 4.8,
		costIndex: 1.02,
		hailRisk: .22,
		windRisk: .34,
		floodRisk: .18,
		wildfireRisk: .48,
		unemployment: 3.6,
		medianIncome: 77800,
		bachelorPlus: 34,
		medianAge: 38,
		householdSize: 2.7,
		ownerOcc: 65,
		narrative: "Sun-faded exteriors and tile roofs. Paint, landscape, and garage-door packages punch above cost because listings photograph so harshly."
	},
	{
		id: "den",
		name: "Denver–Aurora",
		state: "CO",
		medianValue: 568e3,
		yoyAppreciation: 1.2,
		rentYield: 4.1,
		costIndex: 1.16,
		hailRisk: .81,
		windRisk: .48,
		floodRisk: .2,
		wildfireRisk: .52,
		unemployment: 3.9,
		medianIncome: 93400,
		bachelorPlus: 46,
		medianAge: 37,
		householdSize: 2.5,
		ownerOcc: 64,
		narrative: "Hail plus wildfire interface. Class 4 roofs and ember-resistant landscaping are both insurance and appraisal stories."
	},
	{
		id: "atl",
		name: "Atlanta",
		state: "GA",
		medianValue: 392e3,
		yoyAppreciation: 3,
		rentYield: 5.3,
		costIndex: .98,
		hailRisk: .28,
		windRisk: .44,
		floodRisk: .32,
		wildfireRisk: .14,
		unemployment: 3.5,
		medianIncome: 76800,
		bachelorPlus: 42,
		medianAge: 36,
		householdSize: 2.7,
		ownerOcc: 61,
		narrative: "Deep suburban inventory. Cosmetic resets and kitchen-light packages still move lease-up; siding/paint are the cheapest class-lift."
	},
	{
		id: "chi",
		name: "Chicago",
		state: "IL",
		medianValue: 312e3,
		yoyAppreciation: 2.4,
		rentYield: 5.6,
		costIndex: 1.12,
		hailRisk: .36,
		windRisk: .4,
		floodRisk: .34,
		wildfireRisk: .06,
		unemployment: 4.8,
		medianIncome: 74200,
		bachelorPlus: 41,
		medianAge: 37,
		householdSize: 2.5,
		ownerOcc: 64,
		narrative: "Older stock, winter envelope issues. Windows, masonry, and garage doors are the visible ROI; energy rebates stack in Illinois."
	},
	{
		id: "lax",
		name: "Los Angeles",
		state: "CA",
		medianValue: 915e3,
		yoyAppreciation: 1.8,
		rentYield: 3.2,
		costIndex: 1.42,
		hailRisk: .04,
		windRisk: .22,
		floodRisk: .24,
		wildfireRisk: .58,
		unemployment: 5.1,
		medianIncome: 83200,
		bachelorPlus: 36,
		medianAge: 37,
		householdSize: 2.9,
		ownerOcc: 46,
		narrative: "High basis, thin cap rates. Curb-appeal photography and ADU-aware renovations matter more than cheap cosmetic packages."
	},
	{
		id: "aus",
		name: "Austin",
		state: "TX",
		medianValue: 498e3,
		yoyAppreciation: .4,
		rentYield: 4.6,
		costIndex: 1.08,
		hailRisk: .48,
		windRisk: .4,
		floodRisk: .3,
		wildfireRisk: .26,
		unemployment: 3.7,
		medianIncome: 91400,
		bachelorPlus: 51,
		medianAge: 34,
		householdSize: 2.5,
		ownerOcc: 54,
		narrative: "Post-boom reset. Buyers are picky; well-photographed exterior upgrades still separate listings in a slower bid environment."
	}
];
var FALLBACK_METRO = {
	id: "us",
	name: "United States",
	state: "US",
	medianValue: 362e3,
	yoyAppreciation: 2.8,
	rentYield: 5,
	costIndex: 1,
	hailRisk: .35,
	windRisk: .4,
	floodRisk: .3,
	wildfireRisk: .22,
	unemployment: 4.1,
	medianIncome: 74800,
	bachelorPlus: 36,
	medianAge: 39,
	householdSize: 2.5,
	ownerOcc: 66,
	narrative: "National baseline. Local hail, wind, flood, and labor markets will swing both cost and conversion — overlay the parcel before committing capital."
};
var STATE_METRO = {
	TX: "dfw",
	OK: "okc",
	FL: "mia",
	AZ: "phx",
	CO: "den",
	GA: "atl",
	IL: "chi",
	CA: "lax"
};
function metroFor(city, state) {
	const c = city.toLowerCase();
	const hit = METROS.find((m) => {
		const n = m.name.toLowerCase();
		return n.includes(c) || c.includes(n.split("–")[0].toLowerCase());
	});
	if (hit) return hit;
	if (c.includes("houston")) return METROS.find((m) => m.id === "hou");
	if (c.includes("dallas") || c.includes("fort worth") || c.includes("arlington") || c.includes("plano") || c.includes("burleson")) return METROS.find((m) => m.id === "dfw");
	if (c.includes("austin")) return METROS.find((m) => m.id === "aus");
	if (c.includes("tampa") || c.includes("st. pete") || c.includes("st petersburg") || c.includes("clearwater")) return METROS.find((m) => m.id === "tpa");
	if (c.includes("denver") || c.includes("aurora") || c.includes("boulder")) return METROS.find((m) => m.id === "den");
	if (c.includes("phoenix") || c.includes("scottsdale") || c.includes("mesa") || c.includes("tempe")) return METROS.find((m) => m.id === "phx");
	if (c.includes("miami") || c.includes("fort lauderdale") || c.includes("boca")) return METROS.find((m) => m.id === "mia");
	if (c.includes("chicago")) return METROS.find((m) => m.id === "chi");
	if (c.includes("los angeles") || c.includes("long beach") || c.includes("pasadena")) return METROS.find((m) => m.id === "lax");
	if (c.includes("atlanta")) return METROS.find((m) => m.id === "atl");
	if (c.includes("oklahoma")) return METROS.find((m) => m.id === "okc");
	const sid = STATE_METRO[state.toUpperCase()];
	if (sid) return METROS.find((m) => m.id === sid) ?? FALLBACK_METRO;
	return {
		...FALLBACK_METRO,
		state: state || "US",
		name: city ? `${city} metro` : FALLBACK_METRO.name
	};
}
function incentivesFor(state, metro) {
	const s = state.toUpperCase();
	const list = [{
		name: "25C energy-efficient home improvement credit",
		kind: "federal",
		valueNote: "Up to 30% of qualified envelope costs, annual cap applies",
		eligibility: "Owner-occupied; windows, doors, insulation, certain HVAC"
	}, {
		name: "25D residential clean energy credit",
		kind: "federal",
		valueNote: "30% of solar / battery basis",
		eligibility: "Dwelling used as residence; placed-in-service rules"
	}];
	if (s === "TX") {
		list.push({
			name: "Texas property tax homestead + optional local abatements",
			kind: "state",
			valueNote: "Homestead exemption; city/county abatements in TIRZ / enterprise zones",
			eligibility: "Owner-occupied or designated reinvestment zone parcels"
		});
		list.push({
			name: "Oncor / CenterPoint weatherization & HVAC rebates",
			kind: "utility",
			valueNote: "$200–$1,500 typical depending on measure",
			eligibility: "Service territory; pre-approval on some measures"
		});
	}
	if (s === "FL") list.push({
		name: "My Safe Florida Home",
		kind: "state",
		valueNote: "Inspection + matching grant for wind mitigation",
		eligibility: "Homestead; grant stacking with insurance discounts"
	});
	if (s === "OK") list.push({
		name: "OG&E / PSO efficiency rebates",
		kind: "utility",
		valueNote: "HVAC SEER and envelope rebates",
		eligibility: "Residential account in territory"
	});
	if (s === "CA") list.push({
		name: "California ADU streamlining + local fee waivers",
		kind: "state",
		valueNote: "Ministerial ADU permits; some cities waive impact fees",
		eligibility: "Single-family lots meeting setback/parking rules"
	});
	if (metro.hailRisk > .7) list.push({
		name: "Class 4 impact-resistant roof insurance credit",
		kind: "local",
		valueNote: "Carrier credits commonly 5–25% of premium",
		eligibility: "IBHS FORTIFIED or UL 2218 Class 4 product"
	});
	return list;
}
var SAMPLES = [
	{
		label: "Fort Worth bungalow",
		blurb: "Hail-belt curb-appeal reset near TCU",
		address: "3128 Waits Avenue",
		city: "Fort Worth",
		state: "TX",
		postcode: "76109",
		lat: 32.7254,
		lng: -97.3689,
		neighborhood: "TCU / Westcliff"
	},
	{
		label: "East Dallas ranch",
		blurb: "Lakewood-adjacent ranch with a tired roof",
		address: "3819 Maplewood Avenue",
		city: "Dallas",
		state: "TX",
		postcode: "75205",
		lat: 32.8211,
		lng: -96.7864,
		neighborhood: "Lakewood"
	},
	{
		label: "Austin cottage",
		blurb: "Central Austin cottage, picky-buyer market",
		address: "1606 Virginia Avenue",
		city: "Austin",
		state: "TX",
		postcode: "78704",
		lat: 30.2508,
		lng: -97.7621,
		neighborhood: "South Congress"
	},
	{
		label: "OKC hail alley",
		blurb: "Composition roof in the core hail corridor",
		address: "1812 NW 21st Street",
		city: "Oklahoma City",
		state: "OK",
		postcode: "73106",
		lat: 35.4916,
		lng: -97.5418,
		neighborhood: "Gatewood"
	},
	{
		label: "Tampa bungalow",
		blurb: "Wind-mitigation window and roof package",
		address: "3415 W Morrison Avenue",
		city: "Tampa",
		state: "FL",
		postcode: "33629",
		lat: 27.9352,
		lng: -82.4964,
		neighborhood: "South Tampa"
	}
];
var AMENITY_COLORS = {
	school: "#c4b49a",
	kindergarten: "#c4b49a",
	university: "#c4b49a",
	library: "#c4b49a",
	park: "#8aa07a",
	playground: "#8aa07a",
	recreation_ground: "#8aa07a",
	supermarket: "#6e8ea3",
	convenience: "#6e8ea3",
	cafe: "#6e8ea3",
	restaurant: "#6e8ea3",
	station: "#d4a574",
	bus_stop: "#d4a574",
	tram_stop: "#d4a574",
	hospital: "#c45c4a",
	clinic: "#c45c4a",
	pharmacy: "#c45c4a"
};
//#endregion
export { SAMPLES as a, metroFor as c, HAIL_BELT as i, FEATURES as n, STATE_TAX_RATE as o, FEATURE_STYLES as r, incentivesFor as s, AMENITY_COLORS as t };
