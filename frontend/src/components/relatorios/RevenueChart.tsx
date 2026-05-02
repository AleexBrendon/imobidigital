import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueData } from "../data/reports";

export function RevenueChart() {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer>
        <LineChart data={revenueData}>
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          <Line type="monotone" dataKey="green" stroke="#22c55e" strokeWidth={3} />
          <Line type="monotone" dataKey="red" stroke="#ef4444" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}