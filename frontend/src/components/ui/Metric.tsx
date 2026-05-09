type MetricProps = {
  name: string;
  value: string;
  color?: "green" | "cyan" | "red";
};

export function Metric({ name, value, color = "cyan" }: MetricProps) {
  const colors = {
    green: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    cyan: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/20",
    red: "bg-red-500/15 text-red-300 ring-red-400/20",
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/5">
      <span className="text-sm font-medium text-slate-100">{name}</span>

      <span
        className={`rounded-md px-2 py-1 text-xs font-bold ring-1 ${colors[color]}`}
      >
        {value}
      </span>
    </div>
  );
}