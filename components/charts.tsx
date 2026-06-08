"use client";

// Dependency-free, interactive infographics (custom SVG + CSS) — editorial theme.
import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

// Accent → solid hex (icon/segment color). Soft tints are derived with an alpha
// suffix so we never depend on Tailwind shade classes that may not be generated.
const COLORS: Record<string, string> = {
  accent: "#1d4ed8",
  brass: "#a87a2c",
  amber: "#d97706",
  rose: "#e11d48",
  ink: "#475569",
};

export function StatCard({
  label,
  value,
  sub,
  accent = "accent",
  icon,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: keyof typeof COLORS;
  icon?: ReactNode;
}) {
  const c = COLORS[accent];
  return (
    <div className="group rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)] transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-[0_18px_40px_-30px_rgba(10,23,51,0.4)]">
      <div className="flex items-center justify-between">
        <div className="label-caps flex items-center gap-2 text-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
          {label}
        </div>
        {icon && (
          <span
            className="grid h-9 w-9 place-items-center rounded-xl transition-transform group-hover:scale-105"
            style={{ background: `${c}14`, color: c, boxShadow: `inset 0 0 0 1px ${c}26` }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tabular-nums tracking-tight text-ink">{value}</div>
      {sub && <div className="mt-1 text-xs text-ink-soft">{sub}</div>}
    </div>
  );
}

interface Point {
  date: string;
  value: number;
}

/** Interactive area chart with hover guide + tooltip. */
export function AreaChart({ data, label, color = "#1d4ed8" }: { data: Point[]; label: string; color?: string }) {
  const gid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const W = 640;
  const H = 200;
  const PAD = 8;
  const n = data.length;
  const max = Math.max(1, ...data.map((d) => d.value));
  const x = (i: number) => (n <= 1 ? W / 2 : PAD + (i * (W - 2 * PAD)) / (n - 1));
  const y = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(" ");
  const area = n ? `${line} L ${x(n - 1).toFixed(1)} ${H - PAD} L ${x(0).toFixed(1)} ${H - PAD} Z` : "";

  function onMove(e: React.MouseEvent) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return;
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold tracking-tight text-ink">{label}</h3>
        {hover !== null && data[hover] && (
          <span className="font-mono text-xs text-ink-soft">
            {data[hover].date} · <b className="text-ink">{data[hover].value.toLocaleString()}</b>
          </span>
        )}
      </div>
      {n === 0 ? (
        <Empty />
      ) : (
        <div ref={wrapRef} className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`g-${gid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#g-${gid})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {hover !== null && (
              <>
                <line x1={x(hover)} y1={PAD} x2={x(hover)} y2={H - PAD} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" vectorEffect="non-scaling-stroke" />
                <circle cx={x(hover)} cy={y(data[hover].value)} r="4" fill={color} stroke="var(--surface)" strokeWidth="1.5" />
              </>
            )}
          </svg>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-soft/70">
            <span>{data[0]?.date}</span>
            <span>{data[n - 1]?.date}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Interactive donut — hover a segment or legend row to highlight it; the center
 *  shows the focused slice's share, or the total when nothing is hovered. */
export function Donut({
  title,
  segments,
}: {
  title: string;
  segments: { label: string; value: number; color: string }[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);

  const r = 54;
  const C = 2 * Math.PI * r;
  const arcs = segments.map((s, i) => {
    const frac = total ? s.value / total : 0;
    // Cumulative length of all preceding segments — computed functionally (no
    // outer-variable mutation, which the React compiler lint forbids). n is tiny.
    const start = segments.slice(0, i).reduce((sum, p) => sum + (total ? p.value / total : 0) * C, 0);
    return { ...s, dash: frac * C, start, frac };
  });

  const focused = active !== null ? arcs[active] : null;
  const centerValue = focused ? focused.value : total;
  const centerLabel = focused ? `${Math.round(focused.frac * 100)}%` : "total";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)]">
      <h3 className="mb-4 font-display text-sm font-semibold tracking-tight text-ink">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 132 132" className="h-32 w-32 -rotate-90">
            <circle cx="66" cy="66" r={r} fill="none" stroke="var(--color-line, #e5e7eb)" strokeWidth="15" />
            {total > 0 &&
              arcs.map((a, i) => (
                <circle
                  key={a.label}
                  cx="66"
                  cy="66"
                  r={r}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={active === i ? 18 : 15}
                  strokeDasharray={`${a.dash} ${C - a.dash}`}
                  strokeDashoffset={C - a.start}
                  strokeLinecap="butt"
                  className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                  opacity={active === null || active === i ? 1 : 0.3}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                />
              ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-full text-center">
            <div>
              <div className="font-display text-xl font-semibold tabular-nums text-ink">{centerValue.toLocaleString()}</div>
              <div className="label-caps text-ink-soft/70" style={focused ? { color: focused.color } : undefined}>
                {centerLabel}
              </div>
            </div>
          </div>
        </div>
        <ul className="flex-1 space-y-1.5 text-sm">
          {arcs.map((s, i) => (
            <li
              key={s.label}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={
                "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors " +
                (active === i ? "bg-black/[0.04]" : "")
              }
            >
              <span className="h-2.5 w-2.5 rounded-sm transition-transform" style={{ background: s.color, transform: active === i ? "scale(1.25)" : undefined }} />
              <span className="text-ink-soft">{s.label}</span>
              <span className="ml-auto font-mono font-medium tabular-nums text-ink">{s.value.toLocaleString()}</span>
              <span className="w-9 text-right font-mono text-xs text-ink-soft/70">{Math.round(s.frac * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Interactive horizontal bar list — hover a row to highlight its bar and reveal
 *  its share of the total. */
export function BarList({ title, items }: { title: string; items: { label: string; value: number }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((s, i) => s + i.value, 0);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)]">
      <h3 className="mb-4 font-display text-sm font-semibold tracking-tight text-ink">{title}</h3>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <ul className="space-y-3">
          {items.map((i, idx) => {
            const pct = total ? Math.round((i.value / total) * 100) : 0;
            const on = active === idx;
            return (
              <li
                key={i.label}
                onMouseEnter={() => setActive(idx)}
                onMouseLeave={() => setActive(null)}
                className="cursor-default rounded-lg px-1 py-0.5 transition-colors"
              >
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-mono text-ink-soft">{i.label}</span>
                  <span className="flex items-center gap-2">
                    <span
                      className="font-mono text-[11px] text-ink-soft/70 transition-opacity"
                      style={{ opacity: on ? 1 : 0 }}
                    >
                      {pct}%
                    </span>
                    <span className="font-mono font-medium tabular-nums text-ink">{i.value.toLocaleString()}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full transition-[width,background-color] duration-300"
                    style={{ width: `${(i.value / max) * 100}%`, background: on ? "#1e40af" : "#1d4ed8" }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Empty() {
  return <div className="grid h-32 place-items-center text-sm text-ink-soft/70">No data yet</div>;
}
