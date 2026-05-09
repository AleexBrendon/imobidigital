type Props = {
  title: string;
  value: string;
  trend?: "up" | "down";
  compact?: boolean;
};

export function KPI({ title, value, trend }: Props) {
  const isDown = trend === "down";

  const points = isDown
    ? [
        [8, 30],
        [35, 30],
        [62, 30],
        [89, 29],
        [116, 29],
        [148, 28],
      ]
    : [
        [8, 31],
        [32, 29],
        [56, 24],
        [80, 30],
        [104, 22],
        [128, 27],
        [152, 18],
      ];

  const path = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  return (
    <div
      className="
        relative h-[185px] overflow-hidden rounded-2xl border border-slate-700/70
        bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_35%),linear-gradient(180deg,rgba(15,28,46,0.98),rgba(12,24,39,0.98))]
        p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">{title}</p>

          <h3
            className={`
              mt-3 text-4xl font-black tracking-tight
              ${isDown ? "text-red-400" : "text-emerald-400"}
            `}
          >
            {value}
          </h3>
        </div>

        <div
          className={`
            mt-5 h-9 w-24 rounded-lg
            ${
              isDown
                ? "bg-gradient-to-r from-cyan-500/35 to-red-500/35"
                : "bg-gradient-to-r from-cyan-500/45 to-indigo-500/45"
            }
          `}
        />
      </div>

      <div className="mt-6 h-[42px]">
        <svg viewBox="0 0 160 42" className="h-full w-full" fill="none">
          <path
            d={path}
            stroke={isDown ? "#ef4444" : "#22c55e"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="3"
              fill="#0f172a"
              stroke={isDown ? "#ef4444" : "#22c55e"}
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}