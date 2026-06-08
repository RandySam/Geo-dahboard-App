import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import { CHART_COLORS } from "../constants/chartColors";

import type {
  BarChartData,
} from "../types/chart";

type Props = {
  data: BarChartData[];
};

export default function ChartBar({
  data,
}: Props) {
  return (
    <div className="chart-bar">
      <div className="chart-header">
        <h3>Bar Chart</h3>

        <p>
          Visualisasi jumlah
          fasilitas per kategori.
        </p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer
          width="100%"
          height={260}
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
              }}
            />

            <YAxis
              tick={{
                fontSize: 12,
              }}
            />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
            >
              {data.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      CHART_COLORS[
                        index %
                          CHART_COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}