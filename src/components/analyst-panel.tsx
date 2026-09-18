import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePropertyStore } from "@/lib/property-store";
import { askAnalyst } from "@/lib/server/analyze";
import { id } from "@/lib/utils";

const PROMPTS = [
  "What is the cheapest package that photographs and when does it pay back?",
  "Should I BRRRR this or hold as-is?",
  "What insurance and tax carry should I underwrite?",
  "Write a one-paragraph investment thesis for a partner memo.",
];

export function AnalystPanel() {
  const dossier = usePropertyStore((s) => s.dossier);
  const chat = usePropertyStore((s) => s.chat);
  const pushChat = usePropertyStore((s) => s.pushChat);
  const chatStatus = usePropertyStore((s) => s.chatStatus);
  const setChatStatus = usePropertyStore((s) => s.setChatStatus);
  const [q, setQ] = useState("");

  const send = async (text: string) => {
    const question = text.trim();
    if (!question) return;
    if (!dossier) {
      toast.error("Scout a parcel first");
      return;
    }
    pushChat({ id: id("u"), role: "user", text: question });
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
        cap: s.proForma.capRate,
      })),
      thesis: dossier.thesis,
      risks: dossier.risks,
      census: dossier.census
        ? {
            geoid: dossier.census.geoid,
            income: dossier.census.medianIncome,
            value: dossier.census.medianHomeValue,
            rent: dossier.census.medianRent,
            vacancy: dossier.census.vacancyPct,
          }
        : null,
      flood: dossier.flood,
      scorecard: dossier.scorecard,
      monteCarlo: dossier.monteCarlo.irr,
    });
    try {
      const res = await askAnalyst({ data: { question, context } });
      pushChat({ id: id("a"), role: "assistant", text: res.text });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analyst unavailable");
      pushChat({
        id: id("a"),
        role: "assistant",
        text: "The live model did not answer. Use the Underwrite tab for cap rate, cash-on-cash, and scenario IRR from the local engine.",
      });
    } finally {
      setChatStatus("idle");
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      <header>
        <h2 className="font-display text-2xl tracking-tight">Analyst</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask against the modeled dossier. Numbers stay grounded in the AVM, DPS, and pro-forma — no invented sold comps.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => void send(p)}
            disabled={chatStatus === "loading" || !dossier}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex min-h-48 flex-col gap-3">
        {chat.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            No questions yet. The analyst reads the current parcel, not the open web.
          </p>
        )}
        {chat.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-3 py-2.5 text-sm leading-relaxed ${
              t.role === "user" ? "ml-8 border-primary/30 bg-primary/10" : "mr-4 border-border bg-card"
            }`}
          >
            <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {t.role === "user" ? "You" : "PropertyInsight"}
            </p>
            <p className="whitespace-pre-wrap">{t.text}</p>
          </div>
        ))}
        {chatStatus === "loading" && (
          <p className="text-xs text-primary">Underwriting a reply…</p>
        )}
      </div>

      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(q);
        }}
      >
        <Textarea
          rows={3}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about carry, rehab sequencing, or hold vs. flip…"
          disabled={!dossier || chatStatus === "loading"}
        />
        <Button type="submit" disabled={!dossier || chatStatus === "loading" || q.trim().length < 4}>
          {chatStatus === "loading" ? "Thinking…" : "Ask analyst"}
        </Button>
      </form>
    </div>
  );
}
