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
  const [offset, setOffset] = useState(0);

  const formatDay = (dateString: string) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const chartDataInfo = useMemo(() => {
    if (!activityData || activityData.length === 0) {
      return { data: [], averageBpm: 0, dateRange: "", hasMorePast: false };
    }

    const sortedData = [...activityData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const globalLatest = new Date(sortedData[sortedData.length - 1].date);
    globalLatest.setHours(23, 59, 59, 999);

    const endDate = new Date(globalLatest.getTime() - (offset * 7 * 24 * 60 * 60 * 1000));
    const startDate = new Date(endDate.getTime() - (6 * 24 * 60 * 60 * 1000));

    const fullWeekData = [];
    let totalBpm = 0;
    let validSessionsCount = 0;

    for (let i = 0; i <= 6; i++) {
      const currentDay = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const currentDayStr = currentDay.toISOString().split('T')[0];

      const matchingSession = sortedData.find(session => {
        const sessionDateStr = new Date(session.date).toISOString().split('T')[0];
        return sessionDateStr === currentDayStr;
      });

      if (matchingSession) {
        fullWeekData.push(matchingSession);
        if (matchingSession.heartRate && matchingSession.heartRate.average) {
          totalBpm += matchingSession.heartRate.average;
          validSessionsCount++;
        }
      } else {
        fullWeekData.push({
          date: currentDayStr,
          heartRate: { min: null, max: null, average: null }
        });
      }
    }

    const averageBpm = validSessionsCount > 0 ? Math.round(totalBpm / validSessionsCount) : 0;

    const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startStr = startDate.toLocaleDateString('fr-FR', formatOptions);
    const endStr = endDate.toLocaleDateString('fr-FR', formatOptions);

    return {
      data: fullWeekData, 
      averageBpm: averageBpm || 163, 
      dateRange: `${startStr} - ${endStr}`,
      hasMorePast: sortedData[0] && new Date(sortedData[0].date) < startDate
    };
  }, [activityData, offset]);

  const handlePrev = () => {
    if (chartDataInfo.hasMorePast) setOffset(prev => prev + 1);
  };

  const handleNext = () => {
    if (offset > 0) setOffset(prev => prev - 1);
  };

  // Custom legend render strictly using CSS modules
const renderLegend = (props: any) => {
    const { payload } = props;
    const desiredOrder = ['Min', 'Max BPM', 'Max BPM (Suivi)'];

    const sortedPayload = payload ? [...payload].sort((a, b) => {
      return desiredOrder.indexOf(a.value) - desiredOrder.indexOf(b.value);
    }) : [];

    return (
      <div className={styles.legendContainer}>
        {sortedPayload.map((entry: any, index: number) => {
          return (
            <div key={`item-${index}`} className={styles.legendItem}>
              <div 
                className={styles.legendIcon} 
                style={{ backgroundColor: entry.color }} 
              />
              {/* Le texte n'a plus de style en ligne, tout est géré par la classe CSS */}
              <span className={styles.legendText}>
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
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
            
            <Legend verticalAlign="bottom" align="left" content={renderLegend} />
            
            <Bar name="Min" dataKey="heartRate.min" fill="#FFD5CC" barSize={12} radius={[10, 10, 10, 10]} />
            <Bar name="Max BPM" dataKey="heartRate.max" fill="#FF2D00" barSize={12} radius={[10, 10, 10, 10]} />
            <Line name="Max BPM (Suivi)" type="natural" dataKey="heartRate.average" stroke="#0038FF" strokeWidth={2} dot={{ fill: "#0038FF", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} connectNulls={true} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}