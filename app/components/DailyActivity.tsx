import { useState, useMemo } from "react";
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
 * Mixed chart component displaying heart rate tracking.
 * Includes a 7-day sliding window pagination.
 */
export default function DailyActivity({ activityData }: DailyActivityProps) {
  // Pagination offset (0 = current week, 1 = previous week)
  const [offset, setOffset] = useState(0);

  const formatDay = (dateString: string) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // Process and filter chart data based on selected offset
 // Process and filter chart data based on selected offset
  const chartDataInfo = useMemo(() => {
    if (!activityData || activityData.length === 0) {
      return { data: [], averageBpm: 0, dateRange: "", hasMorePast: false };
    }

    // Sort chronologically
    const sortedData = [...activityData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Set global reference point
    const globalLatest = new Date(sortedData[sortedData.length - 1].date);
    globalLatest.setHours(23, 59, 59, 999);

    // Define 7-day time window
    const endDate = new Date(globalLatest.getTime() - (offset * 7 * 24 * 60 * 60 * 1000));
    const startDate = new Date(endDate.getTime() - (6 * 24 * 60 * 60 * 1000));

    // --- NOUVEAU : Création d'une semaine complète de 7 jours forcés ---
    const fullWeekData = [];
    let totalBpm = 0;
    let validSessionsCount = 0;

    for (let i = 0; i <= 6; i++) {
      // Calcule la date du jour précis dans la boucle
      const currentDay = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const currentDayStr = currentDay.toISOString().split('T')[0];

      // Vérifie si une session existe pour cette date
      const matchingSession = sortedData.find(session => {
        const sessionDateStr = new Date(session.date).toISOString().split('T')[0];
        return sessionDateStr === currentDayStr;
      });

      if (matchingSession) {
        // Si elle a fait du sport, on ajoute la session et on compte pour la moyenne
        fullWeekData.push(matchingSession);
        if (matchingSession.heartRate && matchingSession.heartRate.average) {
          totalBpm += matchingSession.heartRate.average;
          validSessionsCount++;
        }
      } else {
        // Si jour de repos : on injecte un jour "vide" pour forcer l'affichage sur l'axe X
        fullWeekData.push({
          date: currentDayStr,
          heartRate: { min: null, max: null, average: null }
        });
      }
    }

    // Calcul de la moyenne uniquement sur les jours où elle a couru
    const averageBpm = validSessionsCount > 0 ? Math.round(totalBpm / validSessionsCount) : 0;

    // Format date range string
    const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startStr = startDate.toLocaleDateString('fr-FR', formatOptions);
    const endStr = endDate.toLocaleDateString('fr-FR', formatOptions);

    return {
      data: fullWeekData, // On utilise notre tableau "fullWeekData" au lieu du "currentWeekData"
      averageBpm: averageBpm || 163, 
      dateRange: `${startStr} - ${endStr}`,
      hasMorePast: sortedData[0] && new Date(sortedData[0].date) < startDate
    };
  }, [activityData, offset]);

  // Pagination handlers
  const handlePrev = () => {
    if (chartDataInfo.hasMorePast) setOffset(prev => prev + 1);
  };

  const handleNext = () => {
    if (offset > 0) setOffset(prev => prev - 1);
  };

  const renderLegend = (value: string) => {
    const textColor = value === 'Min' ? '#D3D3D3' : '#7A7A7A';
    return <span style={{ color: textColor, fontSize: '14px', marginLeft: '8px', marginRight: '16px' }}>{value}</span>;
  };

  if (!activityData || activityData.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.topRow}>
          <h2>{chartDataInfo.averageBpm} BPM</h2>
          
          <div className={styles.dateSelector}>
            <button 
              onClick={handlePrev}
              disabled={!chartDataInfo.hasMorePast}
              className={styles.arrowButton}
              style={{ opacity: chartDataInfo.hasMorePast ? 1 : 0.3, cursor: chartDataInfo.hasMorePast ? "pointer" : "not-allowed" }}
            >
              &lt;
            </button>
            <span className={styles.dateText}>{chartDataInfo.dateRange}</span>
            <button 
              onClick={handleNext}
              disabled={offset === 0}
              className={styles.arrowButton}
              style={{ opacity: offset === 0 ? 0.3 : 1, cursor: offset === 0 ? "not-allowed" : "pointer" }}
            >
              &gt;
            </button>
          </div>
        </div>
        <p className={styles.subtitle}>Fréquence cardiaque moyenne</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartDataInfo.data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
            <XAxis dataKey="date" tickFormatter={formatDay} tickLine={false} axisLine={{ stroke: '#2B2B2B' }} stroke="#7A7A7A" dy={15} style={{ fontSize: "14px", fontFamily: "Inter, sans-serif" }} />
            <YAxis orientation="left" tickLine={false} axisLine={{ stroke: '#2B2B2B' }} stroke="#7A7A7A" domain={[130, 187]} ticks={[130, 145, 160, 187]} dx={-10} style={{ fontSize: "14px", fontFamily: "Inter, sans-serif" }} />
            <Tooltip cursor={{ fill: '#F8F9FE' }} />
            <Legend verticalAlign="bottom" align="left" iconType="circle" iconSize={10} wrapperStyle={{ paddingTop: "20px", paddingLeft: "30px" }} formatter={renderLegend} />
            
            <Bar name="Min" dataKey="heartRate.min" fill="#FFD5CC" barSize={12} radius={[10, 10, 10, 10]} />
            <Bar name="Max BPM" dataKey="heartRate.max" fill="#FF2D00" barSize={12} radius={[10, 10, 10, 10]} />
            <Line name="Max BPM (Suivi)" type="natural" dataKey="heartRate.average" stroke="#0038FF" strokeWidth={2} dot={{ fill: "#0038FF", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}