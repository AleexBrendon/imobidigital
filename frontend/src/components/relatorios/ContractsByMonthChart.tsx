import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  type DotProps,
} from "recharts";

import type { ContractsByMonthItem } from "../../types/reports";

function CustomDot(props: DotProps) {
  const { cx, cy } = props;

  if (cx == null || cy == null) return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#101c2d"
      stroke="#818cf8"
      strokeWidth={2}
    />
  );
}

export function ContractsByMonthChart({
  data = [],
}: {
  data?: ContractsByMonthItem[];
}) {
  return (
    <div className="h-[245px] w-full min-w-0">
      <ResponsiveContainer width="100%" height={245}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="contractsArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(148,163,184,0.12)"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fontSize: 13 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 13 }}
            allowDecimals={false}
            tickLine={false}
            axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#818cf8"
            strokeWidth={3}
            fill="url(#contractsArea)"
            dot={<CustomDot />}
            activeDot={{
              r: 7,
              fill: "#101c2d",
              stroke: "#818cf8",
              strokeWidth: 2,
            }}
          >
            <LabelList
              dataKey="value"
              position="top"
              fill="#e2e8f0"
              fontSize={12}
              fontWeight={700}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}