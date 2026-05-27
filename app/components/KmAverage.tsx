import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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

  // Transformation des données et calcul des statistiques
  const chartData = useMemo(() => {
    if (!kmData || kmData.length === 0) return { weeks: [], average: 0, dateRange: "" };

    // 1. Trier chronologiquement
    const sortedData = [...kmData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 2. Définir le point de référence (la date la plus récente globale du tableau)
    const globalLatest = new Date(sortedData[sortedData.length - 1].date);
    globalLatest.setHours(23, 59, 59, 999); 

    // 3. Calculer la fenêtre de temps active selon l'offset (28 jours = 4 semaines)
    const endDate = new Date(globalLatest.getTime() - (offset * 28 * 24 * 60 * 60 * 1000));
    const startDate = new Date(endDate.getTime() - (28 * 24 * 60 * 60 * 1000) + 1);

    // 4. Préparer nos 4 boîtes fixes
    const weeks = [
      { weekLabel: "S1", distance: 0 },
      { weekLabel: "S2", distance: 0 },
      { weekLabel: "S3", distance: 0 },
      { weekLabel: "S4", distance: 0 },
    ];

    let totalDistance = 0;

    // 5. Répartir les sessions dans la bonne semaine
    sortedData.forEach((session) => {
      const sessionDate = new Date(session.date).getTime();
      
      // Si la session est dans notre fenêtre de 4 semaines active
      if (sessionDate >= startDate.getTime() && sessionDate <= endDate.getTime()) {
        const diffTime = endDate.getTime() - sessionDate;
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

        totalDistance += session.distance;

        // Tri dans la bonne barre (S4 est la plus récente, S1 la plus ancienne)
        if (diffDays <= 7) weeks[3].distance += session.distance;
        else if (diffDays <= 14) weeks[2].distance += session.distance;
        else if (diffDays <= 21) weeks[1].distance += session.distance;
        else if (diffDays <= 28) weeks[0].distance += session.distance;
      }
    });

    // Arrondi pour l'affichage des graphiques
    weeks.forEach(w => w.distance = Number(w.distance.toFixed(2)));

    // 6. Formatage des dates en français (ex: "28 mai")
    const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startStr = startDate.toLocaleDateString('fr-FR', formatOptions);
    const endStr = endDate.toLocaleDateString('fr-FR', formatOptions);

    // 7. Calcul de la moyenne par semaine (arrondi à l'entier)
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

  // Styles CSS en ligne pour s'accorder rapidement avec la maquette
  const buttonStyle = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "32px", height: "32px", borderRadius: "50%",
    border: "1px solid #DEDEDE", backgroundColor: "transparent",
    cursor: "pointer", color: "#000", fontSize: "16px"
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "16px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)", width: "100%", boxSizing: "border-box" }}>
      
      {/* En-tête autonome intégré au composant */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h3 style={{ color: "#2B39FF", fontSize: "22px", margin: "0 0 4px 0" }}>
            {chartData.average}km en moyenne
          </h3>
          <p style={{ color: "#9B9B9B", fontSize: "14px", margin: 0 }}>
            Total des kilomètres 4 dernières semaines
          </p>
        </div>
        
        {/* Contrôles de pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            onClick={handlePrev} 
            disabled={!chartData.hasMorePast} 
            style={{ ...buttonStyle, opacity: chartData.hasMorePast ? 1 : 0.3, cursor: chartData.hasMorePast ? "pointer" : "not-allowed" }}
          >
            &lt;
          </button>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
            {chartData.dateRange}
          </span>
          <button 
            onClick={handleNext} 
            disabled={offset === 0} 
            style={{ ...buttonStyle, opacity: offset === 0 ? 0.3 : 1, cursor: offset === 0 ? "not-allowed" : "pointer" }}
          >
            &gt;
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData.weeks} barSize={16} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
          
          <XAxis 
            dataKey="weekLabel" 
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
            domain={['auto', 'auto']}
            dx={-10}
            style={{ fontSize: "12px" }}
          />
          
          <Tooltip cursor={{ fill: '#F5F5F5' }} />
          
          <Bar dataKey="distance" fill="#B2C0FF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}