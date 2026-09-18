export type NexradSite = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  belt: "hail" | "coast" | "inland";
};

/** Curated WSR-88D sites — hail belt first, then coastal / inland coverage. */
export const NEXRAD_SITES: NexradSite[] = [
  { id: "KFWS", name: "Dallas/Fort Worth", lat: 32.573, lng: -97.303, belt: "hail" },
  { id: "KGRK", name: "Fort Hood", lat: 30.722, lng: -97.383, belt: "hail" },
  { id: "KEWX", name: "Austin/San Antonio", lat: 29.704, lng: -98.029, belt: "hail" },
  { id: "KAMA", name: "Amarillo", lat: 35.233, lng: -101.709, belt: "hail" },
  { id: "KLBB", name: "Lubbock", lat: 33.654, lng: -101.814, belt: "hail" },
  { id: "KDYX", name: "Dyess AFB", lat: 32.538, lng: -99.254, belt: "hail" },
  { id: "KFDR", name: "Frederick", lat: 34.362, lng: -98.977, belt: "hail" },
  { id: "KTLX", name: "Oklahoma City", lat: 35.333, lng: -97.278, belt: "hail" },
  { id: "KINX", name: "Tulsa", lat: 36.175, lng: -95.564, belt: "hail" },
  { id: "KVNX", name: "Vance AFB", lat: 36.741, lng: -98.128, belt: "hail" },
  { id: "KICT", name: "Wichita", lat: 37.655, lng: -97.443, belt: "hail" },
  { id: "KTWX", name: "Topeka", lat: 38.997, lng: -96.232, belt: "hail" },
  { id: "KUEX", name: "Hastings", lat: 40.321, lng: -98.442, belt: "hail" },
  { id: "KOAX", name: "Omaha", lat: 41.32, lng: -96.367, belt: "hail" },
  { id: "KDDC", name: "Dodge City", lat: 37.761, lng: -99.969, belt: "hail" },
  { id: "KPUX", name: "Pueblo", lat: 38.46, lng: -104.181, belt: "hail" },
  { id: "KFTG", name: "Denver", lat: 39.786, lng: -104.546, belt: "hail" },
  { id: "KLSX", name: "St. Louis", lat: 38.699, lng: -90.683, belt: "hail" },
  { id: "KSGF", name: "Springfield MO", lat: 37.235, lng: -93.4, belt: "hail" },
  { id: "KLZK", name: "Little Rock", lat: 34.836, lng: -92.262, belt: "hail" },
  { id: "KMLB", name: "Melbourne", lat: 28.113, lng: -80.654, belt: "coast" },
  { id: "KTBW", name: "Tampa", lat: 27.706, lng: -82.402, belt: "coast" },
  { id: "KAMX", name: "Miami", lat: 25.611, lng: -80.413, belt: "coast" },
  { id: "KJAX", name: "Jacksonville", lat: 30.485, lng: -81.702, belt: "coast" },
  { id: "KTLH", name: "Tallahassee", lat: 30.398, lng: -84.329, belt: "coast" },
  { id: "KMOB", name: "Mobile", lat: 30.679, lng: -88.24, belt: "coast" },
  { id: "KLIX", name: "New Orleans", lat: 30.337, lng: -89.826, belt: "coast" },
  { id: "KHGX", name: "Houston", lat: 29.472, lng: -95.079, belt: "coast" },
  { id: "KCRP", name: "Corpus Christi", lat: 27.784, lng: -97.511, belt: "coast" },
  { id: "KBRO", name: "Brownsville", lat: 25.916, lng: -97.419, belt: "coast" },
  { id: "KMHX", name: "Morehead City", lat: 34.776, lng: -76.876, belt: "coast" },
  { id: "KLTX", name: "Wilmington NC", lat: 33.989, lng: -78.429, belt: "coast" },
  { id: "KAKQ", name: "Wakefield", lat: 36.984, lng: -77.008, belt: "coast" },
  { id: "KOKX", name: "Upton NY", lat: 40.866, lng: -72.864, belt: "coast" },
  { id: "KBOX", name: "Boston", lat: 41.956, lng: -71.137, belt: "inland" },
  { id: "KDIX", name: "Philadelphia", lat: 39.947, lng: -74.411, belt: "inland" },
  { id: "KLWX", name: "Sterling VA", lat: 38.975, lng: -77.478, belt: "inland" },
  { id: "KLOT", name: "Chicago", lat: 41.604, lng: -88.085, belt: "inland" },
  { id: "KDTX", name: "Detroit", lat: 42.7, lng: -83.472, belt: "inland" },
  { id: "KIND", name: "Indianapolis", lat: 39.708, lng: -86.28, belt: "inland" },
  { id: "KFFC", name: "Atlanta", lat: 33.364, lng: -84.566, belt: "inland" },
  { id: "KHTX", name: "Huntsville", lat: 34.931, lng: -86.084, belt: "inland" },
  { id: "KBMX", name: "Birmingham", lat: 33.172, lng: -86.77, belt: "inland" },
  { id: "KOHX", name: "Nashville", lat: 36.247, lng: -86.563, belt: "inland" },
  { id: "KMRX", name: "Knoxville", lat: 36.168, lng: -83.402, belt: "inland" },
  { id: "KRAX", name: "Raleigh", lat: 35.665, lng: -78.49, belt: "inland" },
  { id: "KGSP", name: "Greer SC", lat: 34.883, lng: -82.22, belt: "inland" },
  { id: "KCLX", name: "Charleston SC", lat: 32.655, lng: -81.042, belt: "coast" },
  { id: "KABR", name: "Aberdeen", lat: 45.456, lng: -98.413, belt: "hail" },
  { id: "KFSD", name: "Sioux Falls", lat: 43.588, lng: -96.729, belt: "hail" },
  { id: "KDMX", name: "Des Moines", lat: 41.731, lng: -93.723, belt: "hail" },
  { id: "KARX", name: "La Crosse", lat: 43.823, lng: -91.191, belt: "inland" },
  { id: "KMPX", name: "Minneapolis", lat: 44.849, lng: -93.565, belt: "inland" },
  { id: "KABQ", name: "Albuquerque", lat: 35.15, lng: -106.824, belt: "hail" },
  { id: "KEMX", name: "Tucson", lat: 31.894, lng: -110.63, belt: "inland" },
  { id: "KIWA", name: "Phoenix", lat: 33.289, lng: -111.67, belt: "inland" },
  { id: "KNKX", name: "San Diego", lat: 32.919, lng: -117.041, belt: "coast" },
  { id: "KSOX", name: "Santa Ana", lat: 33.818, lng: -117.636, belt: "coast" },
  { id: "KVTX", name: "Los Angeles", lat: 34.412, lng: -119.18, belt: "coast" },
  { id: "KMUX", name: "San Francisco", lat: 37.155, lng: -121.898, belt: "coast" },
  { id: "KMAX", name: "Medford", lat: 42.081, lng: -122.717, belt: "inland" },
  { id: "KRTX", name: "Portland", lat: 45.715, lng: -122.965, belt: "inland" },
  { id: "KATX", name: "Seattle", lat: 48.195, lng: -122.496, belt: "coast" },
  { id: "KOTX", name: "Spokane", lat: 47.68, lng: -117.627, belt: "inland" },
  { id: "KMSX", name: "Missoula", lat: 47.041, lng: -113.986, belt: "inland" },
  { id: "KBLX", name: "Billings", lat: 45.854, lng: -108.607, belt: "inland" },
  { id: "KRIW", name: "Riverton", lat: 43.066, lng: -108.477, belt: "hail" },
  { id: "KCYS", name: "Cheyenne", lat: 41.152, lng: -104.806, belt: "hail" },
];

export function nearestNexrad(lat: number, lng: number, n = 4): (NexradSite & { km: number })[] {
  const R = 6371;
  const scored = NEXRAD_SITES.map((s) => {
    const dLat = ((s.lat - lat) * Math.PI) / 180;
    const dLng = ((s.lng - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat * Math.PI) / 180) * Math.cos((s.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    const km = 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
    return { ...s, km };
  });
  scored.sort((a, b) => a.km - b.km);
  return scored.slice(0, n);
}
