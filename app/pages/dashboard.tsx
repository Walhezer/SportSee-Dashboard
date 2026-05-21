import { useUser } from "~/context/UserContext";
import DailyActivity from "~/components/DailyActivity";
import KmAverage from "~/components/KmAverage";
import ScoreProgress from "~/components/ScoreProgress";
import styles from "./dashboard.module.css";

/**
 * Dashboard page component for the SportSee application.
 * Displays user analytics and performance charts.
 * Aligned to desktop layout constraints (min-width: 1024px).
 */
export default function Dashboard() {
  const { user } = useUser();

  // Route guarding: redirect or block access if user session context is missing
  if (!user) {
    return (
      <main style={{ padding: "40px", textAlign: "center" }}>
        <p>Veuillez d'abord vous connecter sur la page d'accueil.</p>
      </main>
    );
  }

  // TODO: Replace with dynamic API/Mock data fetching service (Step 6 implementation)
  // Temporary dataset formatted specifically to meet Recharts component expectations
  const tempActivityData = [
    { day: "Lun", minBpm: 138, maxBpm: 163, avgBpm: 163 },
    { day: "Mar", minBpm: 140, maxBpm: 165, avgBpm: 165 },
    { day: "Mer", minBpm: 145, maxBpm: 168, avgBpm: 166 },
    { day: "Jeu", minBpm: 140, maxBpm: 166, avgBpm: 164 },
    { day: "Ven", minBpm: 135, maxBpm: 165, avgBpm: 165 },
    { day: "Sam", minBpm: 142, maxBpm: 162, avgBpm: 161 },
    { day: "Dim", minBpm: 135, maxBpm: 165, avgBpm: 164 },
  ];

  // TODO: Replace with structured domain model mapped from user history endpoint
  const tempKmData = [
    { session: "S1", kilometers: 20 },
    { session: "S2", kilometers: 24 },
    { session: "S3", kilometers: 15 },
    { session: "S4", kilometers: 28 },
  ];

  return (
    <div className={styles.mainContainer}>
      {/* Width constrained container to fulfill Product Owner specification for 1024px desktop layout */}
      <div className={styles.contentWrapper}>

        {/* Top Header: Branding Logo & Profile Navigation Capsule */}
        <div className={styles.headerTop}>
          <div className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <div className={styles.logoBarRed1}></div>
              <div className={styles.logoBarRed2}></div>
              <div className={styles.logoBarBlue1}></div>
              <div className={styles.logoBarBlue2}></div>
            </div>
            <span className={styles.logoText}>
              SPORT<span className={styles.logoTextSpan}>SEE</span>
            </span>
          </div>

          <nav className={styles.navBubble}>
            <a href="#dashboard" className={styles.navLinkActive}>Dashboard</a>
            <a href="#profil" className={styles.navLink}>Mon profil</a>
            <span className={styles.navSeparator}>|</span>
            <button className={styles.logoutButton}>Se déconnecter</button>
          </nav>
        </div>

        {/* User Profile Summary Panel */}
        <section className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            {user.userInfos.firstName[0]}
          </div>
          <div>
            <h1 className={styles.profileName}>
              {user.userInfos.firstName} {user.userInfos.lastName}
            </h1>
            <div className={styles.profileStatsGroup}>
              <div>
                <span className={styles.profileStatLabel}>Distance totale : </span>
                <span className={styles.profileStatValueBlue}>87,4 km</span>
              </div>
              <div>
                <span className={styles.profileStatLabel}>Cette semaine : </span>
                <span className={styles.profileStatValueRed}>21,7 km</span>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section - Row 1: Activity & Heart Rate Metrics (40% / 60% fluid layout split) */}
        <h2 className={styles.sectionTitle}>Vos dernières performances</h2>
        <div className={`${styles.rowContainer} ${styles.mb32}`}>
          <div className={styles.cardLeft}>
            <div>
              <h3 className={styles.cardLeftTitle}>18km en moyenne</h3>
              <p className={styles.cardLeftSubtitle}>Total des kilomètres 4 dernières semaines</p>
            </div>
            <KmAverage kmData={tempKmData} />
          </div>

          <div className={styles.cardRight}>
            <DailyActivity activityData={tempActivityData} />
          </div>
        </div>

        {/* Analytics Section - Row 2: Weekly Goals Progress & Time/Distance KPI blocks */}
        <h2 className={styles.sectionTitle}>Cette semaine</h2>
        <div className={styles.rowContainer}>
          <div className={styles.cardLeftBottom}>
            <div>
              <h3 className={styles.cardLeftBottomTitle}>
                <span className={styles.profileStatValueBlue} style={{ fontSize: "20px" }}>x4</span> sur objectif de 6
              </h3>
              <p className={styles.cardLeftBottomSubtitle}>Courses hebdomadaires réalisées</p>
            </div>
            <ScoreProgress score={4} total={6} />
          </div>

          <div className={styles.statsRightContainer}>
            <div className={styles.textStatCard}>
              <p className={styles.textStatLabel}>Durée d'activité</p>
              <p className={styles.textStatValue}>
                140 <span className={styles.textStatUnitBlue}>minutes</span>
              </p>
            </div>
            <div className={styles.textStatCard}>
              <p className={styles.textStatLabel}>Distance</p>
              <p className={styles.textStatValue}>
                21.7 <span className={styles.textStatUnitRed}>kilomètres</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}