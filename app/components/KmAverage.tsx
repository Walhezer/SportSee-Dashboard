import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Legend
} from "recharts";
import type { ActivityDetail } from "../models/types";
import styles from './kmAverage.module.css';

interface KmAverageProps {
  kmData: ActivityDetail[];
}

/**
 * Standard BarChart component tracking average distance per session.
 * Includes built-in pagination (4-week blocks) and dynamic stats header.
 */
export default function KmAverage({ kmData }: KmAverageProps) {
  const [offset, setOffset] = useState(0);

  /**
   * Processes activity data to group distances into 4-week blocks.
   * Calculates the average distance and manages the pagination offset.
   */
  const chartData = useMemo(() => {
    if (!kmData?.length) return { weeks: [], average: 0, dateRange: "", hasMorePast: false };

    const sortedData = [...kmData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const globalLatest = new Date(sortedData[sortedData.length - 1].date);
    globalLatest.setHours(23, 59, 59, 999);

    const endDate = new Date(globalLatest.getTime() - (offset * 28 * 24 * 60 * 60 * 1000));
    const startDate = new Date(endDate.getTime() - (28 * 24 * 60 * 60 * 1000) + 1);

    const weeks = [
      { weekLabel: "S1", distance: 0 },
      { weekLabel: "S2", distance: 0 },
      { weekLabel: "S3", distance: 0 },
      { weekLabel: "S4", distance: 0 },
    ];

    let totalDistance = 0;

    sortedData.forEach((session) => {
      const sessionDate = new Date(session.date).getTime();

      if (sessionDate >= startDate.getTime() && sessionDate <= endDate.getTime()) {
        const diffTime = endDate.getTime() - sessionDate;
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

        totalDistance += session.distance;

        if (diffDays <= 7) weeks[3].distance += session.distance;
        else if (diffDays <= 14) weeks[2].distance += session.distance;
        else if (diffDays <= 21) weeks[1].distance += session.distance;
        else if (diffDays <= 28) weeks[0].distance += session.distance;
      }
    });

    weeks.forEach(w => w.distance = Number(w.distance.toFixed(2)));

    const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startStr = startDate.toLocaleDateString('fr-FR', formatOptions);
    const endStr = endDate.toLocaleDateString('fr-FR', formatOptions);

    const average = Math.round(totalDistance / 4);

    return {
      weeks,
      average,
      dateRange: `${startStr} - ${endStr}`,
      hasMorePast: sortedData[0] && new Date(sortedData[0].date) < startDate
    };
  }, [kmData, offset]);

  const renderLegend = (value: string) => (
    <span className={styles.legendText}>{value}</span>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.topRow}>
          <h2>{chartData.average}km en moyenne</h2>

          <div className={styles.dateSelector}>
            <button
              onClick={() => { if (chartData.hasMorePast) setOffset(prev => prev + 1); }}
              disabled={!chartData.hasMorePast}
              className={`${styles.arrowButton} ${!chartData.hasMorePast ? styles.disabled : ''}`}
            >
              &lt;
            </button>
            
            <span className={styles.dateText}>
              {chartData.dateRange}
            </span>
            
            <button
              onClick={() => { if (offset > 0) setOffset(prev => prev - 1); }}
              disabled={offset === 0}
              className={`${styles.arrowButton} ${offset === 0 ? styles.disabled : ''}`}
            >
              &gt;
            </button>
          </div>
        </div>
        <p className={styles.subtitle}>Total des kilomètres 4 dernières semaines</p>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.weeks} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
            <XAxis
              dataKey="weekLabel"
              axisLine={{ stroke: '#2B2B2B' }}
              tickLine={false}
              tick={{ fill: '#7A7A7A', fontSize: 14 }}
              dy={15}
            />
            <YAxis
              axisLine={{ stroke: '#2B2B2B' }}
              tickLine={false}
              tick={{ fill: '#7A7A7A', fontSize: 14 }}
              tickCount={4}
              dx={-10}
            />
            <Tooltip cursor={{ fill: '#F8F9FE' }} />
            <Legend
              verticalAlign="bottom"
              align="left"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: '20px', paddingLeft: '30px' }}
              formatter={renderLegend}
            />
            <Bar
              name="Km"
              dataKey="distance"
              fill="#9B9EFE"
              barSize={16}
              radius={[10, 10, 10, 10]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}