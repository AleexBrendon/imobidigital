import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { contractsData } from "../data/reports";

export function ContractsChart() {
  return (
    <div className="h-[220px]">
      <ResponsiveContainer>
        <BarChart data={contractsData}>
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}