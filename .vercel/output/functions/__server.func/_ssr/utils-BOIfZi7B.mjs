import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-BOIfZi7B.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function usd(n, digits = 0) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: digits
	}).format(n);
}
function pct(n, digits = 0) {
	return `${n.toFixed(digits)}%`;
}
function compactUsd(n) {
	if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
	if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k`;
	return usd(n);
}
function milesFromMeters(m) {
	return m / 1609.344;
}
function formatMiles(m) {
	const mi = milesFromMeters(m);
	return mi < .1 ? `${Math.round(m)} m` : `${mi.toFixed(mi < 1 ? 2 : 1)} mi`;
}
function haversineMeters(a, b) {
	const R = 6371e3;
	const dLat = (b.lat - a.lat) * Math.PI / 180;
	const dLng = (b.lng - a.lng) * Math.PI / 180;
	const s1 = Math.sin(dLat / 2);
	const s2 = Math.sin(dLng / 2);
	const h = s1 * s1 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * s2 * s2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function seedFromCoord(lat, lng) {
	const x = Math.round(lat * 1e4);
	const y = Math.round(lng * 1e4);
	return (Math.imul(x, 374761393) ^ Math.imul(y, 668265263)) >>> 0;
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function id(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
//#endregion
export { haversineMeters as a, pct as c, formatMiles as i, seedFromCoord as l, cn as n, id as o, compactUsd as r, mulberry32 as s, clamp as t, usd as u };
