import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ActivityDetail {
  day: string;
  minBpm: number;
  maxBpm: number;
  avgBpm: number;
}

interface DailyActivityProps {
  /** Array of daily heart rate metrics mapped from API or mock services */
  activityData: ActivityDetail[];
}

/**
 * Mixed ComposedChart component displaying heart rate tracking.
 * Combines min/max bars with an average line overlay.
 */
export default function DailyActivity({ activityData }: DailyActivityProps) {
  return (
    <div style={{ backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "16px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "0", color: "#FF2D00" }}>163 BPM</h2>
          <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "#7A7A7A" }}>Fréquence cardiaque moyenne</p>
        </div>
        <div style={{ fontSize: "12px", color: "#7A7A7A", border: "1px solid #E0E0E0", padding: "4px 12px", borderRadius: "20px" }}>
          ‹ 23 mai - 04 juin ›
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={activityData} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
          
          <XAxis 
            dataKey="day" 
            tickLine={false} 
            axisLine={false}
            stroke="#7A7A7A" 
            dy={10}
            style={{ fontSize: "12px" }}
          />
          
          {/* Custom domain constraints to avoid squashing bars and zoom in on heart rate range */}
          <YAxis 
            orientation="left" 
            tickLine={false} 
            axisLine={false} 
            stroke="#7A7A7A" 
            domain={[130, 170]}
            ticks={[130, 145, 160, 167]}
            dx={-10}
            style={{ fontSize: "12px" }}
          />
          
          <Tooltip />
          
          <Legend verticalAlign="bottom" align="left" iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
          
          {/* Layered bars using custom border-radius matching Figma capsule design */}
          <Bar name="Min" dataKey="minBpm" fill="#FFE5E0" radius={[10, 10, 10, 10]} />
          <Bar name="Max BPM" dataKey="maxBpm" fill="#FF2D00" radius={[10, 10, 10, 10]} />
          
          {/* Superimposed monotone curve line for average tracking */}
          <Line name="Max BPM (Suivi)" type="monotone" dataKey="avgBpm" stroke="#0038FF" strokeWidth={2} dot={{ fill: "#0038FF", r: 4 }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}