import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ScoreProgressProps {
  score: number;
  total: number;
}

/**
 * Radial Donut/Gauge Progress chart built using Recharts Pie system.
 * Employs absolute center-positioning for the text node overlay.
 */
export default function ScoreProgress({ score, total }: ScoreProgressProps) {
  // Ensuring percentage calculation handles the new data structure
  const percentage = Math.round(score * 100);
  const remaining = 1 - score;

  const data = [
    { name: "Réalisé", value: score, color: "#0038FF" },
    { name: "Restant", value: remaining, color: "#F2F4FA" },
  ];

  return (
   <div style={{ position: "relative", width: "100%", height: "200px", minHeight: "200px", minWidth: "200px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={85}
            startAngle={90}
            endAngle={450} // Fixed angle for full circle logic
            cornerRadius={10}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "32px", fontWeight: "bold", color: "#2B2B2B" }}>
          {percentage}%
        </span>
        <p style={{ fontSize: "12px", color: "#7A7A7A", margin: "4px 0 0 0" }}>
          de votre<br />objectif
        </p>
      </div>
    </div>
  );
}