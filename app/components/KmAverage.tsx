import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import styles from './kmAverage.module.css';

interface ActivityDetail {
  date: string;
  distance: number;
}

interface KmAverageProps {
  kmData: ActivityDetail[];
}

/**
 * Standard BarChart component tracking average distance per session.
 * Includes built-in pagination (4-week blocks) and dynamic stats header.
 */
export default function KmAverage({ kmData }: KmAverageProps) {
  // Offset : 0 = les 4 dernières semaines, 1 = les 4 précédentes, etc.
  const [offset, setOffset] = useState(0);

  // Transformation des données et calcul des statistiques (Logique inchangée)
  const chartData = useMemo(() => {
    if (!kmData || kmData.length === 0) return { weeks: [], average: 0, dateRange: "" };

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

  // Fonctions pour les boutons
  const handlePrev = () => {
    if (chartData.hasMorePast) setOffset(prev => prev + 1);
  };

  const handleNext = () => {
    if (offset > 0) setOffset(prev => prev - 1);
  };

  // Formateur personnalisé pour la légende Recharts
  const renderLegend = (value: string) => {
    return <span style={{ color: '#7A7A7A', fontSize: '14px', marginLeft: '8px' }}>{value}</span>;
  };

  return (
    <div className={styles.container}>

      {/* ─── NOUVELLE STRUCTURE DE L'EN-TÊTE ─── */}
      <div className={styles.header}>
        <div className={styles.topRow}>
          <h2>{chartData.average}km en moyenne</h2>

          <div className={styles.dateSelector}>
            <button
              onClick={handlePrev}
              disabled={!chartData.hasMorePast}
              className={styles.arrowButton}
              style={{ opacity: chartData.hasMorePast ? 1 : 0.3 }}
            >
              &lt;
            </button>
            <span className={styles.dateText}>
              {chartData.dateRange}
            </span>
            <button
              onClick={handleNext}
              disabled={offset === 0}
              className={styles.arrowButton}
              style={{ opacity: offset === 0 ? 0.3 : 1 }}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Le sous-titre est maintenant positionné en dessous de la ligne principale */}
        <p className={styles.subtitle}>Total des kilomètres 4 dernières semaines</p>
      </div>

      {/* Graphique Recharts aligné sur la maquette */}
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