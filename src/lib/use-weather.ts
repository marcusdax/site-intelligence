import { useEffect } from "react";
import { fetchRadarCatalog, fetchStormAlerts } from "@/lib/server/radar";
import { useWeatherStore } from "@/lib/weather-store";

export function useWeatherBootstrap() {
  const setCatalog = useWeatherStore((s) => s.setCatalog);
  const setAlerts = useWeatherStore((s) => s.setAlerts);
  const setCatalogStatus = useWeatherStore((s) => s.setCatalogStatus);
  const setAlertsStatus = useWeatherStore((s) => s.setAlertsStatus);
  const playing = useWeatherStore((s) => s.playing);
  const frames = useWeatherStore((s) => s.frames);
  const step = useWeatherStore((s) => s.step);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogStatus("loading");
      setAlertsStatus("loading");
      try {
        const cat = await fetchRadarCatalog();
        if (cancelled) return;
        if (cat.ok) setCatalog(cat.host, cat.frames, cat.infrared);
        else setCatalogStatus("error");
      } catch {
        if (!cancelled) setCatalogStatus("error");
      }
      try {
        const al = await fetchStormAlerts();
        if (cancelled) return;
        if (al.ok) setAlerts(al.alerts, al.source);
        else setAlertsStatus("error");
      } catch {
        if (!cancelled) setAlertsStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setAlerts, setAlertsStatus, setCatalog, setCatalogStatus]);

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const t = window.setInterval(() => step(1), 750);
    return () => window.clearInterval(t);
  }, [playing, frames.length, step]);
}
