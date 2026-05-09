import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { DocumentsByStatusItem } from "../../types/reports";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

export function DocumentsStatusChart({
  data = [],
}: {
  data?: DocumentsByStatusItem[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid min-w-0 grid-cols-[160px_1fr] items-center gap-4">
      <div className="h-[180px] min-w-0">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 text-sm">
        <p className="text-slate-400">
          Total: <span className="font-semibold text-white">{total}</span>
        </p>

        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-slate-200">{item.name}</span>
            </div>

            <span className="text-slate-300">
              {item.value} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}