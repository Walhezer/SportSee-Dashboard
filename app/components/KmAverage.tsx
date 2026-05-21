import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface KmDetail {
  session: string;
  kilometers: number;
}

interface KmAverageProps {
  /** Aggregated distance data segmented by workout sessions (S1, S2...) */
  kmData: KmDetail[];
}

/**
 * Standard BarChart component tracking average distance per session.
 * Features custom padding and simplified grid lines for modern minimal design.
 */
export default function KmAverage({ kmData }: KmAverageProps) {
  return (
    <div style={{ backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "16px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)", width: "100%" }}>
      
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={kmData} barSize={16}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
          
          <XAxis 
            dataKey="session" 
            tickLine={false} 
            axisLine={false}
            stroke="#9B9B9B" 
            dy={10}
            style={{ fontSize: "12px" }}
          />
          
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            stroke="#9B9B9B"
            domain={[0, 30]}
            ticks={[0, 10, 20, 30]}
            dx={-10}
            style={{ fontSize: "12px" }}
          />
          
          <Bar dataKey="kilometers" fill="#B2C0FF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}