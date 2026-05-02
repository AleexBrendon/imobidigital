type MetricProps = {
  name: string;
  value: string;
  color?: "green" | "cyan" | "red";
};

export function Metric({ name, value, color = "cyan" }: MetricProps) {
  const colors = {
    green: "bg-emerald-500/20 text-emerald-300",
    cyan: "bg-cyan-500/20 text-cyan-300",
    red: "bg-red-500/20 text-red-300",
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
      <span className="text-slate-200">{name}</span>

      <span className={`rounded px-2 py-1 text-xs ${colors[color]}`}>
        {value}
      </span>
    </div>
  );
}