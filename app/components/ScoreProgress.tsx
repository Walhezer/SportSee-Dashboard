import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./scoreProgress.module.css";

// On passe les valeurs actuelles et l'objectif en propriétés
export default function ScoreProgress({ current = 4, target = 6 }) {
  // On calcule automatiquement ce qu'il reste à faire
  const remaining = target - current;

  // Les données formatées pour Recharts
  const data = [
    { name: "réalisées", value: current, color: "#0038FF" }, // Bleu foncé
    { name: "restants", value: remaining, color: "#C4CEFF" } // Bleu clair
  ];

  // Fonction sur-mesure pour créer les étiquettes avec le petit point de couleur
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, value, name, fill }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25; // Décale le texte à l'extérieur du cercle
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? "start" : "end";

    return (
      <g>
        {/* Le petit point de couleur */}
        <circle cx={x + (textAnchor === "start" ? -10 : 10)} cy={y - 4} r={4} fill={fill} />
        {/* Le texte */}
        <text x={x} y={y} fill="#7A7A7A" textAnchor={textAnchor} fontSize={13} fontWeight={500}>
          {value} {name}
        </text>
      </g>
    );
  };

  return (
    <div className={styles.container}>
      
      {/* L'en-tête textuel personnalisé */}
      <div className={styles.cardHeader}>
        <div className={styles.titleWrapper}>
          <span className={styles.mainValue}>x{current}</span>
          <span className={styles.targetValue}> sur objectif de {target}</span>
        </div>
        <p className={styles.subtitle}>Courses hebdomadaire réalisées</p>
      </div>

      {/* Le graphique Recharts */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55} // L'épaisseur intérieure (fait l'effet "Donut")
              outerRadius={85} // La taille totale
              dataKey="value"
              startAngle={90}  // Fait démarrer le cercle par le haut
              endAngle={-270}
              label={renderCustomLabel} // Appelle notre fonction pour les textes
              labelLine={false} // Cache la ligne noire par défaut
              stroke="none" // Enlève la bordure blanche entre les parts
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}