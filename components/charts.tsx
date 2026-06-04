"use client";

// Dependency-free, interactive infographics (custom SVG + CSS) — editorial theme.
import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

const ACCENTS: Record<string, string> = {
  accent: "bg-accent-600",
  brass: "bg-brass-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  ink: "bg-ink/40",
};

export function StatCard({
  label,
  value,
  sub,
  accent = "accent",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: keyof typeof ACCENTS;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)]">
      <div className="label-caps flex items-center gap-2 text-ink-soft">
        <span className={`h-1.5 w-1.5 rounded-full ${ACCENTS[accent]}`} />
        {label}
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
export function AreaChart({ data, label, color = "#6366f1" }: { data: Point[]; label: string; color?: string }) {
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

/** Donut via conic-gradient; segments with a legend. */
export function Donut({
  title,
  segments,
}: {
  title: string;
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const stops = segments
    .map((s) => {
      const start = total ? (acc / total) * 360 : 0;
      acc += s.value;
      const end = total ? (acc / total) * 360 : 0;
      return `${s.color} ${start}deg ${end}deg`;
    })
    .join(", ");
  const bg = total ? `conic-gradient(${stops})` : "conic-gradient(var(--line) 0deg 360deg)";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)]">
      <h3 className="mb-4 font-display text-sm font-semibold tracking-tight text-ink">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <div className="h-32 w-32 rounded-full" style={{ background: bg }} />
          <div className="absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-full bg-surface text-center">
            <div>
              <div className="font-display text-xl font-semibold tabular-nums text-ink">{total.toLocaleString()}</div>
              <div className="label-caps text-ink-soft/70">total</div>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
              <span className="text-ink-soft">{s.label}</span>
              <span className="ml-auto font-mono font-medium tabular-nums text-ink">{s.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Horizontal bar list (e.g. by file type). */
export function BarList({ title, items }: { title: string; items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(10,23,51,0.04)]">
      <h3 className="mb-4 font-display text-sm font-semibold tracking-tight text-ink">{title}</h3>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-mono text-ink-soft">{i.label}</span>
                <span className="font-mono font-medium tabular-nums text-ink">{i.value.toLocaleString()}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                <div className="h-full rounded-full bg-accent-600" style={{ width: `${(i.value / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Empty() {
  return <div className="grid h-32 place-items-center text-sm text-ink-soft/70">No data yet</div>;
}
