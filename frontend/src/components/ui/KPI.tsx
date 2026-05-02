type KPIProps = {
  title: string;
  value: string;
  trend?: "up" | "down";
};

export function KPI({ title, value, trend }: KPIProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#101c2d] p-4">
      <p className="text-sm text-slate-400">{title}</p>

      <div className="mt-2 flex items-center justify-between">
        <span
          className={`text-xl font-semibold ${
            trend === "down"
              ? "text-red-400"
              : "text-emerald-400"
          }`}
        >
          {value}
        </span>

        {/* mini gráfico fake */}
        <div
          className={`h-8 w-16 rounded 
          ${trend === "down"
            ? "bg-gradient-to-r from-red-400/30 to-red-600/30"
            : "bg-gradient-to-r from-cyan-400/30 to-indigo-500/30"
          }`}
        />
      </div>
    </div>
  );
}