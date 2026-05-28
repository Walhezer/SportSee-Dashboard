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
import type { ActivityDetail } from "../models/types";
import styles from './dailyActivity.module.css';

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

  // On prend les 7 derniers jours
  const chartData = activityData.slice(-7);

  // Fonction pour formater la légende avec les bonnes couleurs de texte (selon la maquette)
  const renderLegend = (value: string) => {
    let textColor = '#7A7A7A'; // Par défaut gris foncé
    if (value === 'Min') {
      textColor = '#D3D3D3'; // Le 'Min' est très pâle sur la maquette
    }
    return <span style={{ color: textColor, fontSize: '14px', marginLeft: '8px', marginRight: '16px' }}>{value}</span>;
  };

  return (
    <div className={styles.container}>
      
      {/* ─── EN-TÊTE HOMOGÈNE ─── */}
      <div className={styles.header}>
        <div className={styles.topRow}>
          <h2>163 BPM</h2>
          
          {/* Sélecteur de date interactif (visuel) */}
          <div className={styles.dateSelector}>
            <button className={styles.arrowButton}>&lt;</button>
            <span className={styles.dateText}>28 mai - 04 juin</span>
            <button className={styles.arrowButton}>&gt;</button>
          </div>
        </div>
        <p className={styles.subtitle}>Fréquence cardiaque moyenne</p>
      </div>
      
      {/* ─── GRAPHIQUE ─── */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
            
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDay}
              tickLine={false} 
              axisLine={{ stroke: '#2B2B2B' }} /* Ligne solide noire comme la maquette */
              stroke="#7A7A7A" 
              dy={15}
              style={{ fontSize: "14px", fontFamily: "Inter, sans-serif" }}
            />
            
            <YAxis 
              orientation="left" 
              tickLine={false} 
              axisLine={{ stroke: '#2B2B2B' }} /* Ligne solide noire comme la maquette */
              stroke="#7A7A7A" 
              domain={[130, 187]}
              ticks={[130, 145, 160, 187]}
              dx={-10}
              style={{ fontSize: "14px", fontFamily: "Inter, sans-serif" }}
            />
            
            <Tooltip cursor={{ fill: '#F8F9FE' }} />
            
            {/* Légende décalée vers la droite pour compenser le left: -20 du margin global */}
            <Legend 
              verticalAlign="bottom" 
              align="left" 
              iconType="circle" 
              iconSize={10} 
              wrapperStyle={{ paddingTop: "20px", paddingLeft: "30px" }} 
              formatter={renderLegend}
            />
            
            {/* L'ordre des balises définit l'ordre d'affichage dans la légende (Min d'abord !) */}
            <Bar name="Min" dataKey="heartRate.min" fill="#FFD5CC" barSize={12} radius={[10, 10, 10, 10]} />
            <Bar name="Max BPM" dataKey="heartRate.max" fill="#FF2D00" barSize={12} radius={[10, 10, 10, 10]} />
            
            {/* La ligne superposée avec type="natural" pour des courbes plus fluides */}
            <Line 
              name="Max BPM (Suivi)" 
              type="natural" 
              dataKey="heartRate.average" 
              stroke="#0038FF" 
              strokeWidth={2} 
              dot={{ fill: "#0038FF", r: 4, strokeWidth: 0 }} 
              activeDot={{ r: 6 }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}