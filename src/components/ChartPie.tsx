import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { CHART_COLORS } from "../constants/chartColors";

import type {
  PieChartData,
} from "../types/chart";

type Props = {
  data: PieChartData[];
};

export default function ChartPie({
  data,
}: Props) {
  return (
    <div className="chart-pie">
      <div className="chart-header">
        <h3>Pie Chart</h3>

        <p>
          Persentase distribusi
          kategori fasilitas.
        </p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={4}
            >
              {data.map(
  (
                  _,
                  index
                ) => (
                  <Cell
                    key={index}
                    fill={
                      CHART_COLORS[
                        index % CHART_COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}