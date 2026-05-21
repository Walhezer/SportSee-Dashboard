import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ScoreProgressProps {
  /** Number of sessions completed by the user */
  score: number;
  /** Total targeted target session count */
  total: number;
}

/**
 * Radial Donut/Gauge Progress chart built using Recharts Pie system.
 * Employs absolute center-positioning for the text node overlay.
 */
export default function ScoreProgress({ score, total }: ScoreProgressProps) {
  const percentage = Math.round((score / total) * 100);
  const remaining = total - score;

  // PieChart structural modeling data
  const data = [
    { name: "Réalisé", value: score, color: "#0038FF" },
    { name: "Restant", value: remaining, color: "#F2F4FA" },
  ];

  return (
    <div style={{ position: "relative", width: "100%", height: "200px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={85}
            startAngle={90}   // Math rotation anchor: starts at 12 o'clock position
            endAngle={-270}  // Forces clockwise layout progression
            cornerRadius={10} // Applies modern rounded edges to ring slices
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Absolutely centered absolute layer mapping the structural progress percentage label */}
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