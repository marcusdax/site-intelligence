import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as pct, i as formatMiles, n as cn, o as id, r as compactUsd, u as usd } from "./utils-BOIfZi7B.mjs";
import { a as SAMPLES, n as FEATURES$1, r as FEATURE_STYLES, t as AMENITY_COLORS } from "./knowledge-_ynDysTG.mjs";
import { i as watchFromDossier, n as overlayComps, r as scoreHarvest, t as buildDossier } from "./engine-CoB_AfSa.mjs";
import { a as number, n as any, o as object, r as array, s as string, t as _enum } from "../_libs/zod.mjs";
import { a as LoaderCircle, c as Check, i as LocateFixed, n as Search, o as Compass, r as MapPin, s as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
import { a as XAxis, c as Bar, d as PolarRadiusAxis, f as PolarGrid, i as YAxis, l as Radar, m as Tooltip, n as BarChart, o as Line, p as ResponsiveContainer, r as LineChart, s as CartesianGrid, t as RadarChart, u as PolarAngleAxis } from "../_libs/recharts+[...].mjs";
import { n as Root$1, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { t as Root$2 } from "../_libs/radix-ui__react-separator.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root$3 } from "../_libs/radix-ui__react-scroll-area.mjs";
import { n as Root2, r as Trigger, t as List } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BG3LRmM9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComparisonSlider({ before, after, loading }) {
	const [pos, setPos] = (0, import_react.useState)(56);
	const ref = (0, import_react.useRef)(null);
	const move = (clientX) => {
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		setPos(Math.max(0, Math.min(100, (clientX - r.left) / r.width * 100)));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative h-64 w-full overflow-hidden rounded-lg bg-muted md:h-80", after && "cursor-ew-resize touch-none"),
		onMouseDown: (e) => move(e.clientX),
		onMouseMove: (e) => {
			if (e.buttons === 1) move(e.clientX);
		},
		onTouchMove: (e) => {
			if (e.touches[0]) move(e.touches[0].clientX);
		},
		children: [
			!before && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center text-sm text-muted-foreground",
				children: "Upload a facade photo to run Alter"
			}),
			before && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: before,
				alt: "Before",
				className: "absolute inset-0 size-full object-cover"
			}),
			after && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 overflow-hidden",
				style: { clipPath: `inset(0 ${100 - pos}% 0 0)` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: after,
					alt: "After render",
					className: "absolute inset-0 size-full object-cover"
				})
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-background/50 text-sm text-primary",
				children: "Alter rendering…"
			}),
			before && after && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-0 bottom-0 w-px bg-foreground",
					style: { left: `${pos}%` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card",
					style: { left: `${pos}%` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 text-[11px] uppercase tracking-wider",
					children: "Before"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-3 top-3 rounded-md bg-primary/90 px-2 py-1 text-[11px] uppercase tracking-wider text-primary-foreground",
					children: "Alter"
				})
			] })
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
			outline: "border border-border bg-transparent hover:bg-accent",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-md px-3 text-xs",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-border bg-card text-card-foreground shadow-border", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 p-4 pb-2", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("font-display text-base font-medium tracking-tight", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-4 pt-2", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs font-medium uppercase tracking-wider text-muted-foreground", className),
		...props
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-11 w-full items-center justify-between rounded-md border border-input bg-card px-3 text-sm shadow-border focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })
		})]
	});
}
function SelectContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		className: cn("z-50 min-w-40 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-border", className),
		position: "popper",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: "p-1",
			children
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm outline-none data-[highlighted]:bg-accent", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute left-2 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-border placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
var SAMPLE_PINS = SAMPLES.map((s) => ({
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
		source: "sample"
	}
}));
var memoryStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
var usePropertyStore = create()(persist((set, get) => ({
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
	mapCenter: {
		lat: 32.7555,
		lng: -97.3308,
		zoom: 11
	},
	mapLayer: "streets",
	scenarioId: "curb",
	chat: [],
	chatStatus: "idle",
	scanning: false,
	tractRing: null,
	buildingRing: null,
	selectPin: (pin) => {
		set({
			selected: pin,
			history: [pin, ...get().history.filter((h) => h.id !== pin.id)].slice(0, 12),
			mapCenter: {
				lat: pin.lat,
				lng: pin.lng,
				zoom: 16
			},
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
			buildingRing: null
		});
	},
	clearSelection: () => set({
		selected: null,
		dossier: null,
		dossierStatus: "idle",
		neighborhood: null,
		zoneHits: [],
		harvest: [],
		render: null,
		chat: [],
		tractRing: null,
		buildingRing: null
	}),
	setGeofenceMode: (on) => set({ geofenceMode: on }),
	setGeofenceRadius: (m) => set({ geofenceRadiusM: m }),
	setZoneHits: (hits) => set({ zoneHits: hits }),
	setHarvest: (h) => set({ harvest: h }),
	setDossier: (d, status = d ? "ready" : "idle", error = null) => set({
		dossier: d,
		dossierStatus: status,
		dossierError: error
	}),
	setNeighborhood: (n, status = n ? "ready" : "idle") => set({
		neighborhood: n,
		neighborhoodStatus: status
	}),
	setAmenities: (a) => set({ amenities: a }),
	setPanelTab: (t) => set({ panelTab: t }),
	setRender: (r) => set({ render: r }),
	patchRender: (p) => {
		const cur = get().render;
		if (!cur) return;
		set({ render: {
			...cur,
			...p
		} });
	},
	setCampaign: (c, status = "ready") => set({
		campaign: c,
		campaignStatus: status
	}),
	setMapCenter: (c) => set({ mapCenter: c }),
	setMapLayer: (l) => set({ mapLayer: l }),
	setScenarioId: (id) => set({ scenarioId: id }),
	pushChat: (t) => set({ chat: [...get().chat, t] }),
	setChat: (c) => set({ chat: c }),
	setChatStatus: (s) => set({ chatStatus: s }),
	setScanning: (on) => set({ scanning: on }),
	toggleWatch: (item) => {
		set({ watchlist: get().watchlist.some((w) => w.pin.id === item.pin.id) ? get().watchlist.filter((w) => w.pin.id !== item.pin.id) : [item, ...get().watchlist].slice(0, 6) });
	},
	setTractRing: (r) => set({ tractRing: r }),
	setBuildingRing: (r) => set({ buildingRing: r })
}), {
	name: "propertyinsight-v3",
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : localStorage),
	partialize: (s) => ({
		history: s.history,
		watchlist: s.watchlist,
		geofenceRadiusM: s.geofenceRadiusM,
		mapCenter: s.mapCenter,
		mapLayer: s.mapLayer
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var FEATURES = [
	"garage_door",
	"roof",
	"windows",
	"siding",
	"paint",
	"landscaping"
];
var composeRender = createServerFn({ method: "POST" }).validator((input) => ({
	feature: _enum(FEATURES).parse(input.feature),
	style: string().min(1).max(80).parse(input.style),
	imageDataUrl: string().min(32).max(65e5).parse(input.imageDataUrl),
	context: string().max(400).optional().parse(input.context)
})).handler(createSsrRpc("6c31d9013620abc66d8483e7a74ad81a492d23f7d72b3b34f2f50587987fa31d"));
var composeCopy = createServerFn({ method: "POST" }).validator((input) => ({
	feature: _enum(FEATURES).parse(input.feature),
	style: string().parse(input.style),
	address: input.address ? string().max(160).parse(input.address) : void 0,
	roiPct: typeof input.roiPct === "number" ? input.roiPct : void 0
})).handler(createSsrRpc("44a84b2c3e0798b51490767dbf19d3b012f64f7b0318831056f4165a8415cd62"));
async function fileToDataUrl(file) {
	const bmp = await createImageBitmap(file);
	const scale = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
	const w = Math.round(bmp.width * scale);
	const h = Math.round(bmp.height * scale);
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	ctx.drawImage(bmp, 0, 0, w, h);
	return canvas.toDataURL("image/jpeg", .84);
}
function AlterStudio() {
	const dossier = usePropertyStore((s) => s.dossier);
	const selected = usePropertyStore((s) => s.selected);
	const render = usePropertyStore((s) => s.render);
	const setRender = usePropertyStore((s) => s.setRender);
	const patchRender = usePropertyStore((s) => s.patchRender);
	const setPanelTab = usePropertyStore((s) => s.setPanelTab);
	const [feature, setFeature] = (0, import_react.useState)("garage_door");
	const [style, setStyle] = (0, import_react.useState)(FEATURE_STYLES.garage_door[0].id);
	const [notes, setNotes] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	const styles = FEATURE_STYLES[feature];
	const play = dossier?.plays.find((p) => p.id === feature);
	const onFeature = (v) => {
		setFeature(v);
		setStyle(FEATURE_STYLES[v][0].id);
	};
	const onFile = async (file) => {
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
				status: "idle"
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
		patchRender({
			status: "running",
			error: void 0,
			feature,
			style
		});
		try {
			const [img, copy] = await Promise.all([composeRender({ data: {
				feature,
				style,
				imageDataUrl: render.beforeDataUrl,
				context: [selected?.label, notes].filter(Boolean).join(". ")
			} }), composeCopy({ data: {
				feature,
				style,
				address: selected?.address,
				roiPct: play?.roiPct
			} })]);
			if (!img.ok) {
				patchRender({
					status: "error",
					error: img.error
				});
				toast.error(img.error);
				return;
			}
			patchRender({
				status: "done",
				afterDataUrl: img.afterUrl,
				prompt: img.prompt,
				headline: copy.ok ? copy.headline : "",
				body: copy.ok ? copy.body : "",
				roiStatement: copy.ok ? copy.roiStatement : ""
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Render failed";
			patchRender({
				status: "error",
				error: msg
			});
			toast.error(msg);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Alter Rendering Engine"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Photoreal before/after on the actual elevation. Highest-ROI exteriors first — garage, roof, siding, windows, paint."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center",
				onClick: () => inputRef.current?.click(),
				onDragOver: (e) => e.preventDefault(),
				onDrop: (e) => {
					e.preventDefault();
					onFile(e.dataTransfer.files[0]);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Drop a street photo or click to upload"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "JPEG or PNG · resized on-device to 1024px"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: (e) => void onFile(e.target.files?.[0])
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Feature" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: feature,
						onValueChange: (v) => onFeature(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FEATURES$1.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: f.key,
							children: [
								f.label,
								" · ",
								f.roiPct,
								"% ROI"
							]
						}, f.key)) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Style" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: style,
						onValueChange: setStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: styles.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.id,
							children: s.label
						}, s.id)) })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Direction (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 2,
					value: notes,
					onChange: (e) => setNotes(e.target.value),
					placeholder: "e.g. keep the existing brick, darker hardware, no cars in frame"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: () => void run(),
				disabled: render?.status === "running" || !render?.beforeDataUrl,
				children: render?.status === "running" ? "Rendering…" : "Generate Alter render"
			}),
			render?.status === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid grid-cols-5 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground",
				children: [
					"Acquire",
					"Segment",
					"Align",
					"Blend",
					"ROI"
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-md border border-border bg-card py-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: i < 3 ? "text-primary" : "",
						children: s
					})
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparisonSlider, {
				before: render?.beforeDataUrl ?? null,
				after: render?.afterDataUrl ?? null,
				loading: render?.status === "running"
			}),
			play && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Mid cost",
						value: usd(play.costMid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Modeled ROI",
						value: `${play.roiPct.toFixed(1)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Value add",
						value: usd(play.valueAdd)
					})
				]
			}),
			(render?.headline || render?.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: render.error ? "Render note" : render.headline }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2 text-sm",
				children: render.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-destructive",
					children: render.error
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: render.body }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: render.roiStatement
				})] })
			})] }),
			render?.afterDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				onClick: () => setPanelTab("campaign"),
				children: "Push into a campaign one-pager"
			})
		]
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 tabular text-sm",
			children: value
		})]
	});
}
function pinSchema(p) {
	return object({
		id: string(),
		label: string(),
		address: string(),
		city: string(),
		state: string(),
		postcode: string(),
		lat: number(),
		lng: number(),
		neighborhood: string().optional(),
		county: string().optional(),
		source: _enum([
			"search",
			"map",
			"geofence",
			"sample",
			"locate"
		])
	}).parse(p);
}
var analyzeProperty = createServerFn({ method: "POST" }).validator((input) => ({
	pin: pinSchema(input.pin),
	amenities: (input.amenities ?? []).slice(0, 24),
	nearby: (input.nearby ?? []).slice(0, 12),
	ground: input.ground ?? null
})).handler(createSsrRpc("cb60ffc417e2f673aac2abf8539118c94ba583d8fa3828887a8028ba38648258"));
var analyzeNeighborhood = createServerFn({ method: "POST" }).validator((input) => ({
	pin: pinSchema(input.pin),
	amenities: (input.amenities ?? []).slice(0, 40),
	ground: input.ground ?? null
})).handler(createSsrRpc("f1968ec9ed2448ddbc30f2267e08ba6473adc249a6a7f57593229511d6b085dc"));
var generateCampaign = createServerFn({ method: "POST" }).validator((input) => ({
	pins: array(any()).max(12).parse(input.pins),
	industry: string().max(80).parse(input.industry || "Garage Doors"),
	neighborhood: string().max(80).parse(input.neighborhood || "the target zone")
})).handler(createSsrRpc("ea17c7b19480b7b20f8e9acb28c21eb16498146191b7e49388a282048c4b0ec5"));
var askAnalyst = createServerFn({ method: "POST" }).validator((input) => ({
	question: string().trim().min(4).max(600).parse(input.question),
	context: string().max(8e3).parse(input.context)
})).handler(createSsrRpc("b9e2a7d9b54e536476a3788c5f7a1c30e5dd66333cd9fc179f5272b1068690a4"));
var PROMPTS = [
	"What is the cheapest package that photographs and when does it pay back?",
	"Should I BRRRR this or hold as-is?",
	"What insurance and tax carry should I underwrite?",
	"Write a one-paragraph investment thesis for a partner memo."
];
function AnalystPanel() {
	const dossier = usePropertyStore((s) => s.dossier);
	const chat = usePropertyStore((s) => s.chat);
	const pushChat = usePropertyStore((s) => s.pushChat);
	const chatStatus = usePropertyStore((s) => s.chatStatus);
	const setChatStatus = usePropertyStore((s) => s.setChatStatus);
	const [q, setQ] = (0, import_react.useState)("");
	const send = async (text) => {
		const question = text.trim();
		if (!question) return;
		if (!dossier) {
			toast.error("Scout a parcel first");
			return;
		}
		pushChat({
			id: id("u"),
			role: "user",
			text: question
		});
		setQ("");
		setChatStatus("loading");
		const context = JSON.stringify({
			address: dossier.pin.label,
			valuation: dossier.valuation,
			profile: dossier.profile,
			dps: dossier.dps,
			plays: dossier.plays.slice(0, 4),
			carry: dossier.carry,
			scenarios: dossier.scenarios.map((s) => ({
				id: s.id,
				label: s.label,
				rehab: s.rehab,
				arv: s.arv,
				irr: s.proForma.irr5,
				coc: s.proForma.cashOnCash,
				cap: s.proForma.capRate
			})),
			thesis: dossier.thesis,
			risks: dossier.risks,
			census: dossier.census ? {
				geoid: dossier.census.geoid,
				income: dossier.census.medianIncome,
				value: dossier.census.medianHomeValue,
				rent: dossier.census.medianRent,
				vacancy: dossier.census.vacancyPct
			} : null,
			flood: dossier.flood,
			scorecard: dossier.scorecard,
			monteCarlo: dossier.monteCarlo.irr
		});
		try {
			const res = await askAnalyst({ data: {
				question,
				context
			} });
			pushChat({
				id: id("a"),
				role: "assistant",
				text: res.text
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Analyst unavailable");
			pushChat({
				id: id("a"),
				role: "assistant",
				text: "The live model did not answer. Use the Underwrite tab for cap rate, cash-on-cash, and scenario IRR from the local engine."
			});
		} finally {
			setChatStatus("idle");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Analyst"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Ask against the modeled dossier. Numbers stay grounded in the AVM, DPS, and pro-forma — no invented sold comps."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
					onClick: () => void send(p),
					disabled: chatStatus === "loading" || !dossier,
					children: p
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-48 flex-col gap-3",
				children: [
					chat.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground",
						children: "No questions yet. The analyst reads the current parcel, not the open web."
					}),
					chat.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-xl border px-3 py-2.5 text-sm leading-relaxed ${t.role === "user" ? "ml-8 border-primary/30 bg-primary/10" : "mr-4 border-border bg-card"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-[10px] uppercase tracking-wider text-muted-foreground",
							children: t.role === "user" ? "You" : "PropertyInsight"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap",
							children: t.text
						})]
					}, t.id)),
					chatStatus === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-primary",
						children: "Underwriting a reply…"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-2",
				onSubmit: (e) => {
					e.preventDefault();
					send(q);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Ask about carry, rehab sequencing, or hold vs. flip…",
					disabled: !dossier || chatStatus === "loading"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: !dossier || chatStatus === "loading" || q.trim().length < 4,
					children: chatStatus === "loading" ? "Thinking…" : "Ask analyst"
				})]
			})
		]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full border border-primary bg-foreground shadow-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" })]
	});
}
var searchAddress = createServerFn({ method: "POST" }).validator((input) => {
	return { q: string().trim().min(2).max(180).parse(input.q) };
}).handler(createSsrRpc("b3efc04aff8c4069056ac148ae822f19c19c0cc0728b8876fe34f1aa056b9a21"));
var reverseGeocode = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().min(-90).max(90).parse(input.lat),
	lng: number().min(-180).max(180).parse(input.lng)
})).handler(createSsrRpc("6aca30eeffc03e3b8e7fa2fde75f248da391620a2d5de592a10406a13c4305dc"));
var fetchAmenities = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().parse(input.lat),
	lng: number().parse(input.lng),
	radiusM: number().min(80).max(4e3).parse(input.radiusM)
})).handler(createSsrRpc("b7bcf0e48cdb6783cd5366ceb0a6db6de6fe672fff6009aa4400afbe69232141"));
var scanGeofence = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().parse(input.lat),
	lng: number().parse(input.lng),
	radiusM: number().min(120).max(3200).parse(input.radiusM)
})).handler(createSsrRpc("d74fa70d7d149500ae13ad308c37cebb78104aa55f623595be00c7a799f1cb78"));
function CampaignPanel({ onZoneSelect }) {
	const selected = usePropertyStore((s) => s.selected);
	const radius = usePropertyStore((s) => s.geofenceRadiusM);
	const setRadius = usePropertyStore((s) => s.setGeofenceRadius);
	const geofenceMode = usePropertyStore((s) => s.geofenceMode);
	const setGeofenceMode = usePropertyStore((s) => s.setGeofenceMode);
	const zoneHits = usePropertyStore((s) => s.zoneHits);
	const setZoneHits = usePropertyStore((s) => s.setZoneHits);
	const harvest = usePropertyStore((s) => s.harvest);
	const setHarvest = usePropertyStore((s) => s.setHarvest);
	const campaign = usePropertyStore((s) => s.campaign);
	const setCampaign = usePropertyStore((s) => s.setCampaign);
	const campaignStatus = usePropertyStore((s) => s.campaignStatus);
	const dossier = usePropertyStore((s) => s.dossier);
	const [industry, setIndustry] = (0, import_react.useState)("Garage Doors");
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const scan = async () => {
		if (!selected) {
			toast.error("Drop a pin first");
			return;
		}
		setGeofenceMode(true);
		setScanning(true);
		setCampaign([], "loading");
		try {
			const res = await scanGeofence({ data: {
				lat: selected.lat,
				lng: selected.lng,
				radiusM: radius
			} });
			if (!res.ok) toast.error(res.error);
			setZoneHits(res.hits);
			setHarvest(scoreHarvest(res.hits));
			if (res.hits.length === 0) toast.message("No addressed buildings in this radius — widen the fence.");
		} catch {
			toast.error("Geofence scan failed");
		} finally {
			setScanning(false);
		}
	};
	const generate = async () => {
		const pins = harvest.length ? harvest.slice(0, 10).map((h) => h.pin) : zoneHits.length ? zoneHits.slice(0, 10) : selected ? [selected] : [];
		if (pins.length === 0) {
			toast.error("Scan a geofence or select a parcel");
			return;
		}
		setCampaign([], "loading");
		try {
			const res = await generateCampaign({ data: {
				pins,
				industry,
				neighborhood: selected?.neighborhood || selected?.city || "the zone"
			} });
			if (res.ok) {
				const pages = res.pages.map((p, i) => ({
					...p,
					dps: harvest[i]?.dps ?? dossier?.dps.score,
					estimate: harvest[i]?.estimate ?? dossier?.valuation.estimate,
					topPlay: harvest[i]?.topPlay,
					id: p.id || pins[i]?.id || `pg_${i}`
				}));
				setCampaign(pages, "ready");
			}
		} catch {
			toast.error("Campaign generation failed");
			setCampaign([], "idle");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Campaign geofence"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Draw a radius around the pin, harvest addressed buildings from OpenStreetMap, and mint one-pagers for the vertical."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Radius · ", formatMiles(radius)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: geofenceMode ? "visible on map" : "hidden"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 200,
						max: 2400,
						step: 50,
						value: [radius],
						onValueChange: (v) => setRadius(v[0] ?? 800)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setGeofenceMode(!geofenceMode),
							children: geofenceMode ? "Hide fence" : "Show fence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void scan(),
							disabled: scanning || !selected,
							children: scanning ? "Scanning…" : "Scan zone"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: [zoneHits.length, " addressed buildings in the current result set."]
					})
				]
			}),
			harvest.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Harvest ranked by DPS" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-64 space-y-1 overflow-y-auto text-sm",
				children: harvest.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center justify-between gap-3 rounded-md px-1 py-1.5 text-left hover:bg-accent",
					onClick: () => onZoneSelect?.(h.pin),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 truncate",
						children: [h.pin.address, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								" ",
								"· ",
								h.yearBuilt,
								" · ",
								h.topPlay
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 tabular text-xs text-muted-foreground",
						children: [
							compactUsd(h.estimate),
							" · DPS ",
							h.dps,
							" · ",
							pct(h.roiPct, 0)
						]
					})]
				}) }, h.pin.id))
			}) })] }),
			zoneHits.length > 0 && harvest.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Harvest" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-48 space-y-1 overflow-y-auto text-sm",
				children: zoneHits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "truncate text-muted-foreground",
					children: [h.address, h.city ? ` · ${h.city}` : ""]
				}, h.id))
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vertical" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: industry,
					onValueChange: setIndustry,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FEATURES$1.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: f.label,
						children: f.label
					}, f.key)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: () => void generate(),
				disabled: campaignStatus === "loading",
				children: campaignStatus === "loading" ? "Writing one-pagers…" : "Generate one-pagers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: campaign.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: p.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-lg tracking-tight",
							children: p.headline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: p.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-primary",
							children: p.cta
						}),
						(p.dps != null || p.estimate != null) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs tabular text-muted-foreground",
							children: [
								p.estimate != null ? compactUsd(p.estimate) : "",
								" ",
								p.dps != null ? `· DPS ${p.dps}` : "",
								" ",
								p.topPlay ? `· ${p.topPlay}` : ""
							]
						})
					]
				}, p.id))
			})
		]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-border placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
function CommandSearch({ onSelect }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [hits, setHits] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const box = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const locateMe = async () => {
		if (!navigator.geolocation) {
			toast.error("Location is not available in this browser");
			return;
		}
		setLocating(true);
		navigator.geolocation.getCurrentPosition(async (pos) => {
			try {
				const res = await reverseGeocode({ data: {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude
				} });
				if (res.ok) {
					onSelect(res.hit);
					setQ(res.hit.address);
					setOpen(false);
				} else toast.error("Could not reverse-geocode this location");
			} catch {
				toast.error("Locate failed");
			} finally {
				setLocating(false);
			}
		}, () => {
			toast.error("Location permission denied");
			setLocating(false);
		}, {
			enableHighAccuracy: true,
			timeout: 8e3
		});
	};
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		const onDoc = (e) => {
			if (!box.current?.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	(0, import_react.useEffect)(() => {
		const t = q.trim();
		if (t.length < 3) {
			setHits([]);
			return;
		}
		const handle = window.setTimeout(async () => {
			setLoading(true);
			try {
				const res = await searchAddress({ data: { q: t } });
				if (res.ok) setHits(res.hits);
				else toast.error(res.error);
			} catch {
				toast.error("Address search failed");
			} finally {
				setLoading(false);
			}
		}, 380);
		return () => window.clearTimeout(handle);
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: box,
		className: "relative w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				ref: inputRef,
				value: q,
				onChange: (e) => {
					setQ(e.target.value);
					setOpen(true);
				},
				onFocus: () => setOpen(true),
				placeholder: "Search an address — street, city, ZIP",
				className: "h-12 rounded-lg border-border bg-background/80 pl-10 pr-20 backdrop-blur-sm",
				"aria-label": "Search address"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void locateMe(),
					disabled: locating,
					className: "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
					"aria-label": "Use my location",
					title: "Use my location",
					children: locating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "size-4" })
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
					className: "hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block",
					children: "/"
				})]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-border",
				children: hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "max-h-72 overflow-y-auto py-1",
					children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-accent",
						onClick: () => {
							onSelect(h);
							setQ(h.address);
							setOpen(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm text-foreground",
								children: h.address
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted-foreground",
								children: [
									h.city,
									h.state,
									h.postcode
								].filter(Boolean).join(", ")
							})]
						})]
					}) }, h.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
						children: "Sample parcels"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-1",
						children: SAMPLE_PINS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("flex items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-accent"),
							onClick: () => {
								onSelect(s.pin);
								setQ(s.pin.address);
								setOpen(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: s.blurb
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5 text-muted-foreground" })]
						}, s.pin.id))
					})]
				})
			})
		]
	});
}
function BrandMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-8 items-center justify-center rounded-md border border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
				className: "size-4 text-primary",
				strokeWidth: 1.6
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-[15px] tracking-tight",
				children: "PropertyInsight"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
				children: "VIVELLA · Alter"
			})]
		})]
	});
}
function GeofenceToggle() {
	const on = usePropertyStore((s) => s.geofenceMode);
	const set = usePropertyStore((s) => s.setGeofenceMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: on ? "default" : "outline",
		size: "sm",
		onClick: () => set(!on),
		className: "shrink-0",
		children: ["Geofence ", on ? "on" : "off"]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-transparent bg-primary/15 text-primary",
		outline: "border-border text-muted-foreground",
		warn: "border-transparent bg-warn/15 text-warn",
		danger: "border-transparent bg-destructive/15 text-destructive",
		ok: "border-transparent bg-ok/15 text-ok",
		muted: "border-transparent bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Progress({ className, value, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
		className: cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
			className: "h-full bg-primary transition-transform duration-300 ease-out",
			style: { transform: `translateX(-${100 - (value ?? 0)}%)` }
		})
	});
}
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$2, {
		decorative,
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
function dpsVariant(tier) {
	if (tier === "CRITICAL" || tier === "HIGH") return "danger";
	if (tier === "MODERATE") return "warn";
	return "ok";
}
function severityVariant(s) {
	if (s === "critical" || s === "high") return "danger";
	if (s === "moderate") return "warn";
	return "ok";
}
function downloadJson(dossier) {
	const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `propertyinsight-${dossier.pin.address.replace(/\s+/g, "-").toLowerCase()}.json`;
	a.click();
	URL.revokeObjectURL(url);
}
function DossierPanel({ dossier, loading, neighborhood, onSample }) {
	if (loading && !dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierSkeleton, {});
	if (!dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-start justify-center gap-4 p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl tracking-tight",
				children: "Scout a parcel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: "Search any US address, drop a pin, or scan a geofence. The dossier blends Census ACS, FEMA flood, OSM buildings, storm DPS, and a renovation ROI matrix with a five-year underwrite."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid w-full gap-2",
				children: SAMPLE_PINS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					className: "h-auto justify-start px-3 py-3 text-left",
					onClick: () => onSample?.(s.pin),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm text-foreground",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-normal normal-case tracking-normal text-muted-foreground",
						children: s.blurb
					})] })
				}, s.pin.id))
			})
		]
	});
	const { valuation, profile, dps, plays, condition } = dossier;
	const condEntries = Object.entries(condition);
	const asIs = dossier.scenarios[0]?.proForma;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: dpsVariant(dps.tier),
								children: [
									"DPS ",
									dps.score,
									" · ",
									dps.tier
								]
							}),
							dossier.enriched ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "ok",
								children: "Grok overlay"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "muted",
								children: "Local model"
							}),
							profile.occupancy !== "owner" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: profile.occupancy
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl leading-tight tracking-tight md:text-3xl",
						children: dossier.pin.address
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							dossier.pin.neighborhood,
							dossier.pin.city,
							dossier.pin.state,
							dossier.pin.postcode
						].filter(Boolean).join(" · ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-foreground/90",
						children: dossier.thesis
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							dossier.flood && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: dossier.flood.sfha ? "danger" : "muted",
								children: ["FEMA ", dossier.flood.zone]
							}),
							dossier.census && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: ["ACS ", dossier.census.geoid]
							}),
							dossier.building && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: dossier.building.use
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: ["Score ", dossier.scorecard.overall]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: () => window.print(),
							children: "Print brief"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: () => downloadJson(dossier),
							children: "Export evidence"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: dossier.imageryUrl,
					alt: `Aerial of ${dossier.pin.address}`,
					className: "h-40 w-full object-cover md:h-52",
					crossOrigin: "anonymous"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground",
					children: [
						"Esri World Imagery · ",
						dossier.pin.lat.toFixed(5),
						", ",
						dossier.pin.lng.toFixed(5)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Modeled value",
						value: compactUsd(valuation.estimate),
						hint: `${compactUsd(valuation.low)}–${compactUsd(valuation.high)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "90% band",
						value: pct(valuation.confidence * 100),
						hint: `${usd(valuation.psf)} / sf`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Year / area",
						value: `${profile.yearBuilt}`,
						hint: `${profile.sqft.toLocaleString()} sf · ${profile.beds} bd`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Top play ROI",
						value: pct(plays[0]?.roiPct ?? 0),
						hint: plays[0]?.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "As-is cap",
						value: pct((asIs?.capRate ?? 0) * 100, 1),
						hint: "NOI / purchase"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Gross rent",
						value: compactUsd(asIs?.grossRentAnnual ?? 0),
						hint: `${dossier.metro.rentYield.toFixed(1)}% yield`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "PITI / mo",
						value: usd(dossier.carry.pitiMonthly),
						hint: "P&I + tax + ins"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Roof age",
						value: `${profile.roofAge}y`,
						hint: profile.roofMaterial
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Site score",
						value: String(dossier.scorecard.overall),
						hint: dossier.scorecard.verdict.split(".")[0]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "IRR p50",
						value: pct(dossier.monteCarlo.irr.p50 * 100, 1),
						hint: `${pct(dossier.monteCarlo.irr.p10 * 100, 1)}–${pct(dossier.monteCarlo.irr.p90 * 100, 1)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Flood",
						value: dossier.flood?.zone ?? "—",
						hint: dossier.flood?.sfha ? "SFHA — insurance gate" : dossier.flood?.note.slice(0, 42)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Tract value",
						value: dossier.census?.medianHomeValue ? compactUsd(dossier.census.medianHomeValue) : "—",
						hint: dossier.census ? `ACS ${dossier.census.geoid}` : "Pending Census overlay"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Condition" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: condEntries.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize text-muted-foreground",
								children: k.replace("_", " ")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-foreground",
								children: [v.score, v.ageYears != null ? ` · ${v.ageYears}y` : ""]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: v.score }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: v.note
						})
					]
				}, k))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ground truth" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm",
				children: [
					dossier.flood && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dossier.flood.note }),
					dossier.census && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: [
							"Census tract ",
							dossier.census.geoid,
							" · ",
							dossier.census.name,
							". Population",
							" ",
							dossier.census.population?.toLocaleString() ?? "—",
							", median income",
							" ",
							dossier.census.medianIncome ? compactUsd(dossier.census.medianIncome) : "—",
							", vacancy",
							" ",
							dossier.census.vacancyPct != null ? `${dossier.census.vacancyPct.toFixed(1)}%` : "—",
							"."
						]
					}),
					dossier.building && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: [
							"OSM building tagged ",
							dossier.building.use,
							dossier.building.levels ? ` · ${dossier.building.levels} levels` : "",
							dossier.building.year ? ` · start ${dossier.building.year}` : "",
							dossier.building.roof ? ` · roof ${dossier.building.roof}` : "",
							"."
						]
					}),
					!dossier.flood && !dossier.census && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Census and FEMA overlays did not return for this pin."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Renovation ROI matrix" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: plays,
							margin: {
								top: 4,
								right: 4,
								left: -18,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "rgb(236 234 228 / 8%)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: {
										fill: "#9c9a92",
										fontSize: 10
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fill: "#9c9a92",
										fontSize: 10
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "#151613",
										border: "1px solid rgb(236 234 228 / 10%)",
										borderRadius: 8
									},
									formatter: (v) => [`${Number(v).toFixed(1)}%`, "ROI"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "roiPct",
									fill: "#8aa07a",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 font-medium",
									children: "Play"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 font-medium",
									children: "Mid cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 font-medium",
									children: "ROI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 font-medium",
									children: "Value add"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: plays.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.rank, "."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.label }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: p.demand === "hot" ? "ok" : p.demand === "steady" ? "outline" : "muted",
												children: p.demand
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "tabular py-2",
									children: usd(p.costMid)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "tabular py-2",
									children: [p.roiPct.toFixed(1), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "tabular py-2",
									children: usd(p.valueAdd)
								})
							]
						}, p.id)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: [
						"Costs scaled by ",
						dossier.metro.name,
						" construction index ",
						dossier.metro.costIndex.toFixed(2),
						". ROI priors from NAR Cost vs. Value, residualized by condition."
					]
				})
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Storm intelligence · Recon DPS" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: dps.action
				}), dps.factors.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									f.name,
									" · ",
									f.weight,
									"%"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular",
								children: f.points
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: f.points }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: f.note
						})
					]
				}, f.name))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Metro path" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: dossier.appreciation,
						margin: {
							top: 8,
							right: 8,
							left: -12,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "rgb(236 234 228 / 8%)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "year",
								tick: {
									fill: "#9c9a92",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fill: "#9c9a92",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: (v) => compactUsd(Number(v))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "#151613",
									border: "1px solid rgb(236 234 228 / 10%)",
									borderRadius: 8
								},
								formatter: (v) => [usd(Number(v)), "Modeled"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "value",
								stroke: "#8aa07a",
								strokeWidth: 2,
								dot: false
							})
						]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					dossier.metro.name,
					" · ",
					dossier.metro.yoyAppreciation.toFixed(1),
					"% modeled CAGR · rent yield ",
					dossier.metro.rentYield.toFixed(1),
					"%"
				]
			})] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Demographics" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "grid grid-cols-2 gap-3",
					children: dossier.demographics.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: d.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular text-sm",
							children: d.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: d.detail
						})
					] }, d.label))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Parcel facts" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid grid-cols-2 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							k: "Beds / baths",
							v: `${profile.beds} / ${profile.baths}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							k: "Stories",
							v: String(profile.stories)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							k: "Lot",
							v: `${profile.lotSqft.toLocaleString()} sf`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							k: "Garage",
							v: profile.garage
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							k: "Construction",
							v: profile.construction
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							k: "Occupancy",
							v: profile.occupancy
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Risks" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: dossier.risks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: severityVariant(r.severity),
						children: r.severity
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: r.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: r.detail
					})] })]
				}, r.label))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Incentives" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: dossier.incentives.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: i.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: i.kind
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: i.valueNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: i.eligibility
					})
				] }, i.name))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Underwriting narrative" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dossier.narrative }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: dossier.occupancyNote
					}),
					neighborhood && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: neighborhood.summary }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: neighborhood.trend
						})
					] })
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Evidence chain" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						dossier.evidence.evidenceId,
						" · overall confidence ",
						pct(dossier.evidence.confidence.overall * 100)
					] }),
					dossier.evidence.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						s.sourceType,
						" · ",
						s.sourceId,
						" · ",
						s.timestamp.slice(0, 16).replace("T", " ")
					] }, s.sourceId + s.sourceType)),
					dossier.evidence.assertions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						a.type,
						": ",
						a.value,
						" — ",
						a.explanation
					] }, a.type))
				]
			})] })
		]
	});
}
function Fact({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] uppercase tracking-wider text-muted-foreground",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "capitalize",
		children: v
	})] });
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-xl tabular tracking-tight",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 truncate text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function DossierSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 p-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-2/3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })
		]
	});
}
function NeighborhoodPanel({ intel, loading }) {
	if (loading && !intel) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40" })]
	});
	if (!intel) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Select a parcel to load neighborhood intelligence."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Neighborhood"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: intel.pin.neighborhood || intel.pin.city
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Walk proxy",
						value: intel.walkScore
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Transit",
						value: intel.transitScore
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Amenity",
						value: intel.amenityScore
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed",
				children: intel.summary
			}),
			intel.flood && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: "FEMA NFHL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: intel.flood.sfha ? "text-destructive" : "",
						children: [
							"Zone ",
							intel.flood.zone,
							intel.flood.subtype ? ` · ${intel.flood.subtype}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: intel.flood.note
					})
				]
			}),
			intel.census && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: [
					["Income", intel.census.medianIncome != null ? compactUsd(intel.census.medianIncome) : "—"],
					["Home value", intel.census.medianHomeValue != null ? compactUsd(intel.census.medianHomeValue) : "—"],
					["Rent", intel.census.medianRent != null ? compactUsd(intel.census.medianRent) : "—"],
					["Owner-occ", intel.census.ownerOccPct != null ? `${intel.census.ownerOccPct.toFixed(0)}%` : "—"],
					["Vacancy", intel.census.vacancyPct != null ? `${intel.census.vacancyPct.toFixed(1)}%` : "—"],
					["Poverty", intel.census.povertyPct != null ? `${intel.census.povertyPct.toFixed(1)}%` : "—"],
					["Bachelor+", intel.census.bachelorPlusPct != null ? `${intel.census.bachelorPlusPct.toFixed(0)}%` : "—"],
					["Age", intel.census.medianAge != null ? intel.census.medianAge.toFixed(1) : "—"],
					["Pop", intel.census.population != null ? intel.census.population.toLocaleString() : "—"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular text-sm",
						children: v
					})]
				}, k))
			}),
			intel.nearest.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: intel.nearest.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: n.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm",
							children: n.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular text-xs text-muted-foreground",
							children: formatMiles(n.distanceM)
						})
					]
				}, n.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: intel.clusters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: c.kind.replace("_", " ")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular text-lg",
						children: c.count
					})]
				}, c.kind))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 pt-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: intel.schoolsNote }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: intel.laborNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: intel.zoningNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: intel.trend })
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Mapped amenities" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm",
				children: [intel.amenities.slice(0, 18).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate",
						children: [
							a.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["· ", a.kind]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 tabular text-muted-foreground",
						children: formatMiles(a.distanceM)
					})]
				}, a.id)), intel.amenities.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted-foreground",
					children: "No POIs returned for this radius."
				})]
			}) })] })
		]
	});
}
function Score({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl tabular",
			children: value
		})]
	});
}
function amenityColor(kind) {
	return AMENITY_COLORS[kind] ?? "#9c9a92";
}
function PropertyMap({ onMapClick, onZoneSelect }) {
	const host = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const streetsRef = (0, import_react.useRef)(null);
	const satRef = (0, import_react.useRef)(null);
	const pinRef = (0, import_react.useRef)(null);
	const circleRef = (0, import_react.useRef)(null);
	const zoneRef = (0, import_react.useRef)(null);
	const amenityRef = (0, import_react.useRef)(null);
	const tractRef = (0, import_react.useRef)(null);
	const bldgRef = (0, import_react.useRef)(null);
	const onClickRef = (0, import_react.useRef)(onMapClick);
	const onZoneRef = (0, import_react.useRef)(onZoneSelect);
	onClickRef.current = onMapClick;
	onZoneRef.current = onZoneSelect;
	const selected = usePropertyStore((s) => s.selected);
	const geofenceMode = usePropertyStore((s) => s.geofenceMode);
	const radius = usePropertyStore((s) => s.geofenceRadiusM);
	const zoneHits = usePropertyStore((s) => s.zoneHits);
	const amenities = usePropertyStore((s) => s.amenities);
	const mapCenter = usePropertyStore((s) => s.mapCenter);
	const mapLayer = usePropertyStore((s) => s.mapLayer);
	const tractRing = usePropertyStore((s) => s.tractRing);
	const buildingRing = usePropertyStore((s) => s.buildingRing);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		if (!host.current) return;
		let ro;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			await Promise.resolve({});
			if (cancelled || !host.current) return;
			const map = L.map(host.current, {
				zoomControl: true,
				attributionControl: true,
				minZoom: 3
			}).setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);
			streetsRef.current = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
				attribution: "&copy; OpenStreetMap &copy; CARTO",
				subdomains: "abcd",
				maxZoom: 20
			}).addTo(map);
			satRef.current = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
				attribution: "Tiles &copy; Esri",
				maxZoom: 19
			});
			map.on("click", (e) => {
				onClickRef.current(e.latlng.lat, e.latlng.lng);
			});
			zoneRef.current = L.layerGroup().addTo(map);
			amenityRef.current = L.layerGroup().addTo(map);
			mapRef.current = map;
			const invalidate = () => map.invalidateSize();
			requestAnimationFrame(invalidate);
			window.setTimeout(invalidate, 120);
			window.setTimeout(invalidate, 480);
			ro = new ResizeObserver(invalidate);
			ro.observe(host.current);
		})();
		return () => {
			cancelled = true;
			ro?.disconnect();
			mapRef.current?.remove();
			mapRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map || !streetsRef.current || !satRef.current) return;
		if (mapLayer === "satellite") {
			map.removeLayer(streetsRef.current);
			satRef.current.addTo(map);
		} else {
			map.removeLayer(satRef.current);
			streetsRef.current.addTo(map);
		}
	}, [mapLayer]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		map.flyTo([mapCenter.lat, mapCenter.lng], mapCenter.zoom, { duration: .8 });
		window.setTimeout(() => map.invalidateSize(), 200);
	}, [
		mapCenter.lat,
		mapCenter.lng,
		mapCenter.zoom
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			pinRef.current?.remove();
			pinRef.current = null;
			if (!selected) return;
			const icon = L.divIcon({
				className: "pi-pin",
				html: `<div style="width:22px;height:22px;border-radius:999px;background:#8aa07a;border:2px solid #eceae4;box-shadow:0 0 0 6px rgb(138 160 122 / 25%)"></div>`,
				iconSize: [22, 22],
				iconAnchor: [11, 11]
			});
			pinRef.current = L.marker([selected.lat, selected.lng], { icon }).addTo(map);
		})();
	}, [selected]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			circleRef.current?.remove();
			circleRef.current = null;
			if (!geofenceMode || !selected) return;
			circleRef.current = L.circle([selected.lat, selected.lng], {
				radius,
				color: "#8aa07a",
				weight: 1.5,
				fillColor: "#8aa07a",
				fillOpacity: .12
			}).addTo(map);
			circleRef.current.bindTooltip(`${formatMiles(radius)} radius`, { permanent: false });
			const b = circleRef.current.getBounds();
			map.fitBounds(b, {
				padding: [28, 28],
				maxZoom: 16,
				animate: true
			});
		})();
	}, [
		geofenceMode,
		radius,
		selected
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		const group = zoneRef.current;
		if (!map || !group) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			group.clearLayers();
			const icon = L.divIcon({
				className: "pi-pin",
				html: `<div class="pi-zone-dot"></div>`,
				iconSize: [12, 12],
				iconAnchor: [6, 6]
			});
			for (const h of zoneHits) {
				const m = L.marker([h.lat, h.lng], { icon }).bindTooltip(h.address);
				m.on("click", (e) => {
					e.originalEvent?.stopPropagation?.();
					onZoneRef.current(h);
				});
				m.addTo(group);
			}
		})();
	}, [zoneHits]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		const group = amenityRef.current;
		if (!map || !group) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			group.clearLayers();
			for (const a of amenities.slice(0, 40)) {
				const color = amenityColor(a.kind);
				const icon = L.divIcon({
					className: "pi-pin",
					html: `<div style="width:8px;height:8px;border-radius:999px;background:${color};border:1px solid #eceae4;opacity:.9"></div>`,
					iconSize: [8, 8],
					iconAnchor: [4, 4]
				});
				L.marker([a.lat, a.lng], { icon }).bindTooltip(`${a.name} · ${a.kind}`).addTo(group);
			}
		})();
	}, [amenities]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			tractRef.current?.remove();
			tractRef.current = null;
			if (!tractRing || tractRing.length < 3) return;
			tractRef.current = L.polygon(tractRing, {
				color: "#c4b49a",
				weight: 1.25,
				fillColor: "#c4b49a",
				fillOpacity: .08,
				dashArray: "4 6"
			}).bindTooltip("ACS census tract").addTo(map);
		})();
	}, [tractRing]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			bldgRef.current?.remove();
			bldgRef.current = null;
			if (!buildingRing || buildingRing.length < 3) return;
			bldgRef.current = L.polygon(buildingRing, {
				color: "#8aa07a",
				weight: 2,
				fillColor: "#8aa07a",
				fillOpacity: .18
			}).bindTooltip("OSM building").addTo(map);
		})();
	}, [buildingRing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: host,
		className: "absolute inset-0 h-full w-full"
	});
}
function MapHost({ onMapClick, onZoneSelect }) {
	const selected = usePropertyStore((s) => s.selected);
	const mapLayer = usePropertyStore((s) => s.mapLayer);
	const setMapLayer = usePropertyStore((s) => s.setMapLayer);
	const amenities = usePropertyStore((s) => s.amenities);
	const dossier = usePropertyStore((s) => s.dossier);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full min-h-[280px] w-full overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyMap, {
				onMapClick,
				onZoneSelect
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 top-3 z-[400] flex flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-wider ${mapLayer === "streets" ? "border-primary bg-background text-foreground" : "border-border bg-background/80 text-muted-foreground"}`,
					onClick: () => setMapLayer("streets"),
					children: "Streets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-wider ${mapLayer === "satellite" ? "border-primary bg-background text-foreground" : "border-border bg-background/80 text-muted-foreground"}`,
					onClick: () => setMapLayer("satellite"),
					children: "Satellite"
				})]
			}),
			dossier?.flood && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-3 top-24 z-[400] rounded-md border border-border bg-background/85 px-2.5 py-1.5 text-[11px] uppercase tracking-wider backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: dossier.flood.sfha ? "text-destructive" : "text-muted-foreground",
					children: ["FEMA ", dossier.flood.zone]
				})
			}),
			amenities.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute bottom-10 left-3 z-[400] rounded-lg border border-border bg-background/80 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-2 inline-block size-1.5 rounded-full bg-chart-2" }),
					" Schools",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-3 mr-2 inline-block size-1.5 rounded-full bg-primary" }),
					" Parks",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-3 mr-2 inline-block size-1.5 rounded-full bg-chart-3" }),
					" Shops",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-3 mr-2 inline-block size-1.5 rounded-full bg-chart-5" }),
					" Transit"
				]
			}),
			!selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-8 flex justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-full border border-border bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm",
					children: "Search an address, drop a pin, or scan a geofence"
				})
			})
		]
	});
}
function ScorecardPanel() {
	const dossier = usePropertyStore((s) => s.dossier);
	const watchlist = usePropertyStore((s) => s.watchlist);
	if (usePropertyStore((s) => s.dossierStatus === "loading") && !dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" })]
	});
	if (!dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Scout a parcel to score talent, rehab cost, insurance friction, and appreciation on one card."
	});
	const { scorecard, census, flood, metro } = dossier;
	const radar = scorecard.dimensions.map((d) => ({
		subject: d.label,
		score: d.score,
		full: 100
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: scorecard.overall >= 70 ? "ok" : scorecard.overall >= 50 ? "warn" : "danger",
								children: ["Site score ", scorecard.overall]
							}),
							census && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: ["ACS ", census.geoid]
							}),
							flood && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: flood.sfha ? "danger" : "muted",
								children: ["FEMA ", flood.zone]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Site selection scorecard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: scorecard.verdict
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadarChart, {
						data: radar,
						cx: "50%",
						cy: "50%",
						outerRadius: "72%",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarGrid, { stroke: "rgb(236 234 228 / 12%)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
								dataKey: "subject",
								tick: {
									fill: "#9c9a92",
									fontSize: 10
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarRadiusAxis, {
								domain: [0, 100],
								tick: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
								dataKey: "score",
								stroke: "#8aa07a",
								fill: "#8aa07a",
								fillOpacity: .28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "#151613",
								border: "1px solid rgb(236 234 228 / 10%)",
								borderRadius: 8
							} })
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Weighted dimensions" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: scorecard.dimensions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									d.label,
									" · ",
									(d.weight * 100).toFixed(0),
									"%"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular",
								children: d.score
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: d.score }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: d.note
						})
					]
				}, d.id))
			})] }),
			census && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tract vs metro" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-[11px] uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 text-left font-medium",
							children: "Signal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 text-right font-medium",
							children: "Tract"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 text-right font-medium",
							children: "Metro"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
					[
						"Median income",
						census.medianIncome != null ? compactUsd(census.medianIncome) : "—",
						compactUsd(metro.medianIncome)
					],
					[
						"Home value",
						census.medianHomeValue != null ? compactUsd(census.medianHomeValue) : "—",
						compactUsd(metro.medianValue)
					],
					[
						"Owner-occ",
						census.ownerOccPct != null ? pct(census.ownerOccPct, 0) : "—",
						pct(metro.ownerOcc, 0)
					],
					[
						"Bachelor+",
						census.bachelorPlusPct != null ? pct(census.bachelorPlusPct, 0) : "—",
						pct(metro.bachelorPlus, 0)
					],
					[
						"Median age",
						census.medianAge != null ? census.medianAge.toFixed(1) : "—",
						String(metro.medianAge)
					]
				].map(([k, a, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 text-muted-foreground",
							children: k
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 text-right tabular",
							children: a
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 text-right tabular text-muted-foreground",
							children: b
						})
					]
				}, k)) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [
					"ACS 5-year 2023 · ",
					census.name,
					". Margins of error not shown; treat small tracts as noisy."
				]
			})] })] }),
			watchlist.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Watchlist compare" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Parcel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "DPS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Cap"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "IRR"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Play"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: watchlist.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2",
								children: w.pin.address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular py-2",
								children: compactUsd(w.estimate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular py-2",
								children: w.dps
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular py-2",
								children: pct(w.capRate * 100, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular py-2",
								children: pct(w.irr5 * 100, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-muted-foreground",
								children: w.topPlay
							})
						]
					}, w.pin.id)) })]
				})
			}) })] })
		]
	});
}
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root$3, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex touch-none select-none p-0.5 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
		})]
	});
}
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-10 items-center gap-1 rounded-lg bg-muted p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-8 shrink-0 items-center justify-center rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-border sm:px-3", className),
		...props
	});
}
function Metric({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-xl tabular tracking-tight",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 truncate text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
function UnderwritePanel({ dossier, loading }) {
	const scenarioId = usePropertyStore((s) => s.scenarioId);
	const setScenarioId = usePropertyStore((s) => s.setScenarioId);
	if (loading && !dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48" })]
	});
	if (!dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Select a parcel to underwrite purchase, rehab, and five-year hold."
	});
	const scenario = dossier.scenarios.find((s) => s.id === scenarioId) ?? dossier.scenarios[0];
	const pf = scenario.proForma;
	const { carry } = dossier;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Underwrite"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"20% down · 6.75% 30-year · ",
					dossier.metro.name,
					" rent yield ",
					dossier.metro.rentYield.toFixed(1),
					"%. Toggle a scenario to re-cut cash-in and IRR."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: dossier.scenarios.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setScenarioId(s.id),
					className: `rounded-xl border px-3 py-3 text-left transition-colors ${s.id === scenario.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular text-xs text-muted-foreground",
							children: [
								s.rehab ? usd(s.rehab) : "No rehab",
								" · ",
								s.timelineWeeks ? `${s.timelineWeeks} wk` : "Day-1"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: s.blurb
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Cash in",
						value: compactUsd(pf.cashIn),
						hint: `${pct(pf.downPct * 100)} down + close + rehab`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Cap rate",
						value: pct(pf.capRate * 100, 1),
						hint: `NOI ${usd(pf.noi)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Cash-on-cash",
						value: pct(pf.cashOnCash * 100, 1),
						hint: `${usd(pf.monthlyCashFlow)} / mo`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "5-yr IRR",
						value: pct(pf.irr5 * 100, 1),
						hint: `${pf.equityMultiple5.toFixed(2)}x equity`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Sources and uses" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
				className: "w-full text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
					["Purchase", usd(pf.price)],
					["Rehab", usd(pf.rehab)],
					["Closing (2.5%)", usd(pf.closingCost)],
					["Down payment", usd(pf.downPayment)],
					["Loan", usd(pf.loan)],
					["Monthly P&I", usd(pf.monthlyPI)],
					["DSCR", pf.dscr.toFixed(2)],
					["ARV / exit Y5", usd(scenario.arv) + " / " + usd(pf.exitValue)]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2 text-muted-foreground",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2 text-right tabular",
						children: v
					})]
				}, k)) })
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Carry" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Tax",
							value: usd(carry.taxAnnual),
							hint: `${pct(carry.taxRate * 100, 2)} effective`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Insurance",
							value: usd(carry.insuranceAnnual),
							hint: carry.insuranceNote
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "PITI / mo",
							value: usd(carry.pitiMonthly),
							hint: "P&I + tax + ins"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Vacancy",
							value: pct(carry.vacancyPct * 100),
							hint: `Mgmt ${pct(carry.mgmtPct * 100)}`
						})
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Five-year hold" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 h-44",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: pf.years,
						margin: {
							top: 8,
							right: 8,
							left: -12,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "rgb(236 234 228 / 8%)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								tick: {
									fill: "#9c9a92",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fill: "#9c9a92",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: (v) => compactUsd(Number(v))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "#151613",
									border: "1px solid rgb(236 234 228 / 10%)",
									borderRadius: 8
								},
								formatter: (v, n) => [usd(Number(v)), String(n)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "equity",
								stroke: "#8aa07a",
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "value",
								stroke: "#c4b49a",
								strokeWidth: 1.5,
								dot: false
							})
						]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Yr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Rent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "NOI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "CF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Equity"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: pf.years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-1.5",
								children: y.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular py-1.5",
								children: compactUsd(y.rent)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular py-1.5",
								children: compactUsd(y.noi)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular py-1.5",
								children: compactUsd(y.cashFlow)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular py-1.5",
								children: compactUsd(y.equity)
							})
						]
					}, y.year)) })]
				})
			})] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Monte Carlo · 400 runs" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Rent ±15%, vacancy 3–12%, appreciation ±2pp, insurance ±25%, rehab ±15%. Refresh-scenario cash-in. Not a forecast — a sensitivity envelope."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "IRR p10 / p50 / p90",
								value: pct(dossier.monteCarlo.irr.p50 * 100, 1),
								hint: `${pct(dossier.monteCarlo.irr.p10 * 100, 1)} → ${pct(dossier.monteCarlo.irr.p90 * 100, 1)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "CoC p50",
								value: pct(dossier.monteCarlo.coc.p50 * 100, 1),
								hint: `${pct(dossier.monteCarlo.coc.p10 * 100, 1)}–${pct(dossier.monteCarlo.coc.p90 * 100, 1)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "CF / mo p50",
								value: usd(dossier.monteCarlo.monthlyCf.p50),
								hint: `${usd(dossier.monteCarlo.monthlyCf.p10)}–${usd(dossier.monteCarlo.monthlyCf.p90)}`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: dossier.monteCarlo.histogram,
								margin: {
									top: 4,
									right: 4,
									left: -18,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "rgb(236 234 228 / 8%)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "bucket",
										tick: {
											fill: "#9c9a92",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fill: "#9c9a92",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "#151613",
										border: "1px solid rgb(236 234 228 / 10%)",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										fill: "#8aa07a",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: dossier.monteCarlo.tornado,
								layout: "vertical",
								margin: {
									top: 4,
									right: 12,
									left: 8,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "rgb(236 234 228 / 8%)",
										horizontal: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										tickFormatter: (v) => pct(Number(v) * 100, 0),
										tick: {
											fill: "#9c9a92",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "driver",
										width: 88,
										tick: {
											fill: "#9c9a92",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "#151613",
											border: "1px solid rgb(236 234 228 / 10%)",
											borderRadius: 8
										},
										formatter: (v) => [pct(Number(v) * 100, 1), "IRR"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "low",
										fill: "#c45c4a",
										radius: [
											4,
											0,
											0,
											4
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "high",
										fill: "#8aa07a",
										radius: [
											0,
											4,
											4,
											0
										]
									})
								]
							})
						})
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Investor fit" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: dossier.investorFit.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f.strategy }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular text-primary",
							children: f.score
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: f.score,
						className: "mt-1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: f.why
					})
				] }, f.strategy))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Modeled comps" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs text-muted-foreground",
					children: "Nearby OSM harvest when a geofence has been scanned; otherwise synthetic street-offset peers. Not sold comps."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 h-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: dossier.comps,
							margin: {
								top: 4,
								right: 4,
								left: -18,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "rgb(236 234 228 / 8%)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "address",
									hide: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fill: "#9c9a92",
										fontSize: 10
									},
									axisLine: false,
									tickLine: false,
									tickFormatter: (v) => compactUsd(Number(v))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "#151613",
										border: "1px solid rgb(236 234 228 / 10%)",
										borderRadius: 8
									},
									formatter: (v) => [usd(Number(v)), "Modeled"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "estimate",
									fill: "#8aa07a",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: dossier.comps.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: [c.address, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									" ",
									"· ",
									c.beds,
									" bd · ",
									c.sqft.toLocaleString(),
									" sf"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 tabular",
							children: [
								compactUsd(c.estimate),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: c.deltaPct >= 0 ? "ok" : "warn",
									children: [
										c.deltaPct >= 0 ? "+" : "",
										c.deltaPct.toFixed(0),
										"%"
									]
								})
							]
						})]
					}, c.id))
				})
			] })] })
		]
	});
}
var fetchGroundTruth = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().min(-90).max(90).parse(input.lat),
	lng: number().min(-180).max(180).parse(input.lng)
})).handler(createSsrRpc("375506b8e52966b03089b36d301e71aeeac5258e8a92540c9d6eb4ca20979e19"));
var STAGES = [
	"Geocoding parcel",
	"Census + FEMA",
	"Overlaying amenities",
	"Scoring condition",
	"Modeling ROI",
	"Writing evidence"
];
function tractToRing(geom) {
	if (!geom?.[0]?.length) return null;
	return geom[0].map((pt) => [pt[1], pt[0]]);
}
function ScoutWorkspace() {
	const selected = usePropertyStore((s) => s.selected);
	const selectPin = usePropertyStore((s) => s.selectPin);
	const dossier = usePropertyStore((s) => s.dossier);
	const dossierStatus = usePropertyStore((s) => s.dossierStatus);
	const setDossier = usePropertyStore((s) => s.setDossier);
	const neighborhood = usePropertyStore((s) => s.neighborhood);
	const neighborhoodStatus = usePropertyStore((s) => s.neighborhoodStatus);
	const setNeighborhood = usePropertyStore((s) => s.setNeighborhood);
	const setAmenities = usePropertyStore((s) => s.setAmenities);
	const panelTab = usePropertyStore((s) => s.panelTab);
	const setPanelTab = usePropertyStore((s) => s.setPanelTab);
	const geofenceMode = usePropertyStore((s) => s.geofenceMode);
	const radius = usePropertyStore((s) => s.geofenceRadiusM);
	const setRadius = usePropertyStore((s) => s.setGeofenceRadius);
	const history = usePropertyStore((s) => s.history);
	const zoneHits = usePropertyStore((s) => s.zoneHits);
	const setZoneHits = usePropertyStore((s) => s.setZoneHits);
	const setHarvest = usePropertyStore((s) => s.setHarvest);
	const scanning = usePropertyStore((s) => s.scanning);
	const setScanning = usePropertyStore((s) => s.setScanning);
	const setGeofenceMode = usePropertyStore((s) => s.setGeofenceMode);
	const watchlist = usePropertyStore((s) => s.watchlist);
	const toggleWatch = usePropertyStore((s) => s.toggleWatch);
	const setTractRing = usePropertyStore((s) => s.setTractRing);
	const setBuildingRing = usePropertyStore((s) => s.setBuildingRing);
	const [stage, setStage] = (0, import_react.useState)(0);
	const [mapReady, setMapReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMapReady(true);
	}, []);
	const runIntel = async (pin, nearby = []) => {
		setDossier(buildDossier(pin, nearby), "loading");
		setNeighborhood(null, "loading");
		setStage(0);
		try {
			setStage(1);
			const [am, gt] = await Promise.all([fetchAmenities({ data: {
				lat: pin.lat,
				lng: pin.lng,
				radiusM: 1200
			} }), fetchGroundTruth({ data: {
				lat: pin.lat,
				lng: pin.lng
			} })]);
			const amenities = am.ok ? am.amenities : [];
			const ground = gt.ok ? gt.ground : null;
			setAmenities(amenities);
			setTractRing(tractToRing(ground?.census?.geometry ?? null));
			setBuildingRing(ground?.building?.footprint ?? null);
			setStage(2);
			const seed = buildDossier(pin, nearby, ground);
			setDossier(seed, "loading");
			setStage(3);
			const [prop, hood] = await Promise.all([analyzeProperty({ data: {
				pin,
				amenities,
				nearby,
				ground
			} }), analyzeNeighborhood({ data: {
				pin,
				amenities,
				ground
			} })]);
			setStage(5);
			if (prop.ok) {
				const d = nearby.length ? {
					...prop.dossier,
					comps: overlayComps(pin, prop.dossier.valuation.estimate, nearby)
				} : prop.dossier;
				setDossier(d, "ready");
			} else setDossier(seed, "ready");
			if (hood.ok) setNeighborhood(hood.intel, "ready");
			else setNeighborhood(null, "idle");
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Analysis failed";
			toast.error(msg);
			setDossier(buildDossier(pin, nearby), "ready", msg);
			setNeighborhood(null, "idle");
		}
	};
	const onHit = (hit, source = "search") => {
		const pin = {
			...hit,
			source: hit.id.startsWith("sample_") ? "sample" : source
		};
		selectPin(pin);
		runIntel(pin, zoneHits);
	};
	const onMapClick = async (lat, lng) => {
		try {
			const res = await reverseGeocode({ data: {
				lat,
				lng
			} });
			const pin = {
				...res.ok ? res.hit : {
					id: `pin_${lat}`,
					label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
					address: "Dropped pin",
					city: "",
					state: "",
					postcode: "",
					lat,
					lng
				},
				lat,
				lng,
				source: "map"
			};
			selectPin(pin);
			runIntel(pin, zoneHits);
		} catch {
			toast.error("Reverse geocode failed");
		}
	};
	const onZoneSelect = (pin) => {
		selectPin(pin);
		runIntel(pin, zoneHits);
	};
	const scan = async () => {
		if (!selected) {
			toast.error("Drop a pin first");
			return;
		}
		setGeofenceMode(true);
		setScanning(true);
		try {
			const res = await scanGeofence({ data: {
				lat: selected.lat,
				lng: selected.lng,
				radiusM: radius
			} });
			if (!res.ok) toast.error(res.error);
			setZoneHits(res.hits);
			const scored = scoreHarvest(res.hits);
			setHarvest(scored);
			if (res.hits.length === 0) toast.message("No addressed buildings in this radius — widen the fence.");
			else {
				toast.message(`${res.hits.length} addressed buildings · ranked by DPS`);
				if (dossier) setDossier({
					...dossier,
					comps: overlayComps(selected, dossier.valuation.estimate, res.hits)
				}, "ready");
			}
		} catch {
			toast.error("Geofence scan failed");
		} finally {
			setScanning(false);
		}
	};
	const watched = dossier ? watchlist.some((w) => w.pin.id === dossier.pin.id) : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "z-20 flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSearch, { onSelect: (h) => onHit(h) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeofenceToggle, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col lg:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative h-[42vh] min-h-[240px] w-full shrink-0 lg:h-auto lg:w-[46%]",
					children: [
						mapReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapHost, {
							onMapClick,
							onZoneSelect
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-muted" }),
						geofenceMode && selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute left-3 right-3 top-3 z-[500] rounded-lg border border-border bg-background/85 p-3 backdrop-blur-sm lg:right-auto lg:w-80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Geofence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular",
										children: formatMiles(radius)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 200,
									max: 2400,
									step: 50,
									value: [radius],
									onValueChange: (v) => setRadius(v[0] ?? 800)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										onClick: () => void scan(),
										disabled: scanning,
										children: scanning ? "Scanning…" : "Scan zone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [zoneHits.length, " harvest"]
									})]
								})
							]
						}),
						dossierStatus === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-3 left-3 right-3 z-[500] rounded-lg border border-border bg-background/85 px-3 py-2 text-xs backdrop-blur-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-primary",
								children: STAGES[Math.min(stage, STAGES.length - 1)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-1",
								children: STAGES.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1 flex-1 rounded-full ${i <= stage ? "bg-primary" : "bg-muted"}` }, i))
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "flex min-h-0 flex-1 flex-col border-t border-border lg:border-l lg:border-t-0",
					children: [
						dossier && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2 sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm",
									children: dossier.pin.address
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] uppercase tracking-wider text-muted-foreground",
									children: [
										compactUsd(dossier.valuation.estimate),
										" · DPS ",
										dossier.dps.score,
										" · score ",
										dossier.scorecard.overall,
										dossier.census ? ` · tract ${dossier.census.geoid}` : ""
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-2",
								children: [
									dossier.flood?.sfha && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "danger",
										children: ["SFHA ", dossier.flood.zone]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: dossier.metro.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: watched ? "default" : "outline",
										onClick: () => toggleWatch(watchFromDossier(dossier)),
										children: watched ? "Watched" : "Watch"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between gap-3 border-b border-border px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
								value: panelTab,
								onValueChange: (v) => setPanelTab(v),
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "w-full justify-start overflow-x-auto",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "dossier",
											children: "Dossier"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "underwrite",
											children: "Underwrite"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "neighborhood",
											children: "Neighborhood"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "scorecard",
											children: "Scorecard"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "alter",
											children: "Alter"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "campaign",
											children: "Campaign"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "analyst",
											children: "Analyst"
										})
									]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
							className: "min-h-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [
									panelTab === "dossier" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierPanel, {
										dossier,
										loading: dossierStatus === "loading",
										neighborhood,
										onSample: (p) => onHit(p)
									}),
									panelTab === "underwrite" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnderwritePanel, {
										dossier,
										loading: dossierStatus === "loading"
									}),
									panelTab === "neighborhood" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeighborhoodPanel, {
										intel: neighborhood,
										loading: neighborhoodStatus === "loading"
									}),
									panelTab === "scorecard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScorecardPanel, {}),
									panelTab === "alter" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlterStudio, {}),
									panelTab === "campaign" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignPanel, { onZoneSelect }),
									panelTab === "analyst" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalystPanel, {})
								]
							})
						})
					]
				})]
			}),
			history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "hidden shrink-0 items-center gap-2 overflow-x-auto border-t border-border px-4 py-2 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: "Recent"
					}),
					history.slice(0, 6).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "ghost",
						className: "h-8 shrink-0",
						onClick: () => {
							selectPin(h);
							runIntel(h, zoneHits);
						},
						children: h.address
					}, h.id)),
					watchlist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-[11px] uppercase tracking-wider text-muted-foreground",
						children: "Watch"
					}), watchlist.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						className: "h-8 shrink-0",
						onClick: () => {
							selectPin(w.pin);
							runIntel(w.pin, zoneHits);
						},
						children: [
							w.pin.address,
							" · DPS ",
							w.dps
						]
					}, w.pin.id))] })
				]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoutWorkspace, {});
}
//#endregion
export { Home as component };
