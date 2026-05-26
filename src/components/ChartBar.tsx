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

type ChartData = {
  name: string;
  total: number;
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
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}