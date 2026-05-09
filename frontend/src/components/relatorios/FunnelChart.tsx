import type { FunnelChartItem } from "../../types/reports";

const COLORS = [
  "#6366f1", "#06b6d4", "#facc15", "#ef4444"
];

const SEGMENTS = [
  "M0 0H300L270 55H30L0 0Z",
  "M30 55H270L240 110H60L30 55Z",
  "M60 110H240L210 165H90L60 110Z",
  "M90 165H210L185 220H115L90 165Z",
];

export function FunnelChart({ data = [] }: { data?: FunnelChartItem[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const normalized = data.map((item) => ({
    ...item,
    percentage: total > 0 ? Number(((item.value / total) * 100).toFixed(1)) : 0,
  }));

  return (
    <div className="grid h-[245px] grid-cols-[minmax(210px,300px)_1fr] items-center gap-8">
      <div className="flex justify-center">
        <svg
          viewBox="0 0 300 220"
          className="h-[220px] w-[300px] drop-shadow-[0_18px_35px_rgba(0,0,0,0.35)]"
        >
          {normalized.map((item, index) => (
            <g key={item.label}>
              <path
                d={SEGMENTS[index]}
                fill={COLORS[index]}
                opacity="0.97"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              <text
                x="150"
                y={index * 55 + 24}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="15"
                fontWeight="800"
              >
                {item.label}
              </text>

              <text
                x="150"
                y={index * 55 + 43}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="15"
                fontWeight="800"
              >
                {item.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="space-y-0">
        {normalized.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[1fr_50px_70px] items-center border-b border-white/10 py-3 text-sm"
          >
            <span className="truncate text-slate-300">{item.label}</span>

            <span className="text-right font-semibold text-slate-100">
              {item.value}
            </span>

            <span className="text-right font-semibold text-slate-100">
              {item.percentage.toLocaleString("pt-BR", {
                maximumFractionDigits: 1,
              })}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}