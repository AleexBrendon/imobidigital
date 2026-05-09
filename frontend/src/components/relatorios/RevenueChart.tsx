import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

import type { RevenueChartItem } from "../../types/reports";

export function RevenueChart({ data = [] }: { data?: RevenueChartItem[] }) {
  return (
    <div className="h-[300px] w-full min-w-0">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fontSize: 13 }}
            axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
            tickLine={false}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 13 }}
            axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />

          <Legend
            verticalAlign="top"
            align="left"
            iconType="circle"
            wrapperStyle={{
              paddingBottom: 16,
              color: "#e2e8f0",
              fontSize: 13,
              fontWeight: 600,
            }}
          />

          <Line
            name="Vendas"
            type="monotone"
            dataKey="vendas"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: "#0f172a",
              stroke: "#22c55e",
            }}
            activeDot={{ r: 7 }}
          >
            <LabelList
              dataKey="vendas"
              position="top"
              fill="#e2e8f0"
              fontSize={12}
              fontWeight={700}
            />
          </Line>

          <Line
            name="Locação"
            type="monotone"
            dataKey="locacao"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: "#0f172a",
              stroke: "#ef4444",
            }}
            activeDot={{ r: 7 }}
          >
            <LabelList
              dataKey="locacao"
              position="bottom"
              fill="#e2e8f0"
              fontSize={12}
              fontWeight={700}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}