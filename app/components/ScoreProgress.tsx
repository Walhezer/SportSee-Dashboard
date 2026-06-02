import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./scoreProgress.module.css";

interface ScoreProgressProps {
  current?: number;
  target?: number;
}

/**
 * Donut chart component displaying the user's weekly goal progress.
 */
export default function ScoreProgress({ current = 4, target = 6 }: ScoreProgressProps) {
  // Prevents negative remaining values if the user exceeds the target
  const remaining = Math.max(0, target - current);

  const data = [
    { name: "réalisées", value: current, color: "#0038FF" },
    { name: "restants", value: remaining, color: "#C4CEFF" }
  ];

  /**
   * Custom render function for Recharts pie labels.
   * Positions text and colored dots outside the donut chart.
   */
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, value, name, fill }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? "start" : "end";

    return (
      <g>
        <circle cx={x + (textAnchor === "start" ? -10 : 10)} cy={y - 4} r={4} fill={fill} />
        <text x={x} y={y} fill="#7A7A7A" textAnchor={textAnchor} fontSize={13} fontWeight={500}>
          {value} {name}
        </text>
      </g>
    );
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.cardHeader}>
        <div className={styles.titleWrapper}>
          <span className={styles.mainValue}>x{current}</span>
          <span className={styles.targetValue}> sur objectif de {target}</span>
        </div>
        <p className={styles.subtitle}>Courses hebdomadaires réalisées</p>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              label={renderCustomLabel}
              labelLine={false}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
}