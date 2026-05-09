import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TopPropertyItem } from "../../types/reports";

export function TopPropertiesChart({
  data = [],
}: {
  data?: TopPropertyItem[];
}) {
  return (
    <div className="h-[220px] min-w-0">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" stroke="#64748b" allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#64748b"
            width={120}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}