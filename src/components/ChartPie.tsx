import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
};

type Props = {
  data: ChartData[];
};

const COLORS = [
  "var(--deep-sky-blue)",
  "var(--bright-gold)",
  "var(--vivid-tangerine)",
  "var(--neon-pink)",
  "var(--slime-lime)",
  "var(--violet-ray)",
];

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
              outerRadius={95}
              innerRadius={55}
              paddingAngle={4}
            >
              {data.map(
  (
                  entry,
                  index
                ) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
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