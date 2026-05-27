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

interface HeartRateData {
  min: number;
  max: number;
  average: number;
}

interface ActivityDetail {
  date: string;
  distance: number;
  duration: number;
  heartRate: HeartRateData;
  caloriesBurned: number;
}

interface DailyActivityProps {
  activityData: ActivityDetail[];
}

/**
 * Mixed ComposedChart component displaying heart rate tracking.
 * Combines min/max bars with an average line overlay.
 */
export default function DailyActivity({ activityData }: DailyActivityProps) {
  const formatDay = (dateString: string) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  if (!activityData || activityData.length === 0) return null;

  const chartData = activityData.slice(-7);

  return (
    <div style={{ backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "16px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "0", color: "#FF2D00" }}>163 BPM</h2>
          <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "#7A7A7A" }}>Fréquence cardiaque moyenne</p>
        </div>
        <div style={{ fontSize: "12px", color: "#7A7A7A", border: "1px solid #E0E0E0", padding: "4px 12px", borderRadius: "20px" }}>
          ‹ 28 mai - 04 juin ›
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
          
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDay}
            tickLine={false} 
            axisLine={false}
            stroke="#7A7A7A" 
            dy={10}
            style={{ fontSize: "12px" }}
          />
          
          <YAxis 
            orientation="left" 
            tickLine={false} 
            axisLine={false} 
            stroke="#7A7A7A" 
            domain={[130, 187]}
            ticks={[130, 145, 160, 187]}
            dx={-10}
            style={{ fontSize: "12px" }}
          />
          
          <Tooltip />
          
          <Legend verticalAlign="bottom" align="left" iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
          
          <Bar name="Min" dataKey="heartRate.min" fill="#FFE5E0" radius={[10, 10, 10, 10]} />
          <Bar name="Max BPM" dataKey="heartRate.max" fill="#FF2D00" radius={[10, 10, 10, 10]} />
          
          <Line name="Max BPM (Suivi)" type="monotone" dataKey="heartRate.average" stroke="#0038FF" strokeWidth={2} dot={{ fill: "#0038FF", r: 4 }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}