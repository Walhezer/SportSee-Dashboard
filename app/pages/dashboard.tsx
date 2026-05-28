import { Link, useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import { useFetch } from "~/hooks/useFetch";
import { USE_MOCK } from '../services/config';
import { getUserActivity, getUserMainData } from '../services/api';
import { getUserActivityMock, getUserMainDataMock } from '../services/mockApi';
import Header from "../components/header"; 
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
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // Route guarding: redirect or block access if user session context is missing
  if (!user) {
    return (
      <main className={styles.errorMain}>
        <div className={styles.errorModal}>
          <h2 className={styles.errorTitle}>
            Session expirée
          </h2>
          <p className={styles.errorText}>
            Votre session a expiré suite à une période d'inactivité, ou vous n'êtes pas connecté. Veuillez vous reconnecter pour accéder à votre tableau de bord.
          </p>

          <Link to="/" className={styles.errorButton}>
            Retour à la connexion
          </Link>
        </div>
      </main>
    );
  }

  // Switch
  const fetchDashboardData = async () => {
    if (USE_MOCK) {
      const main = await getUserMainDataMock();
      const activity = await getUserActivityMock();
      return { main, activity };
    } else {
      const main = await getUserMainData();
      const activity = await getUserActivity();
      return { main, activity };
    }
  };

  // Fetch all user metrics using our switch function
  const { data, isLoading, error } = useFetch(fetchDashboardData, []);

  // Handle API loading and error states
  if (isLoading) return <div style={{ padding: "40px", textAlign: "center" }}>Chargement de vos indicateurs...</div>;
  if (error || !data) return <div style={{ padding: "40px", textAlign: "center", color: "red" }}>Erreur de chargement des données depuis le serveur.</div>;

  // Extract backend data
  const { main, activity } = data;

  // The activity API returns an array
  const activityData = Array.isArray(activity) ? activity : [];

  // Securing access to data from the new API
  const profile = main?.profile || {};
  const stats = main?.statistics || {};
  const firstName = profile.firstName || "Utilisateur";
  const lastName = profile.lastName || "";

  // Le nouveau backend ne renvoie plus de score, on fixe une valeur factice pour le graphique
  const userScore = 0.65;

  return (
    <div className={styles.mainContainer}>
      {/* Width constrained container to fulfill Product Owner specification for 1024px desktop layout */}
      <div className={styles.contentWrapper}>

        {/* Top Header: Branding Logo & Profile Navigation Capsule */}
       <Header />

        {/* User Profile Summary Panel */}
        <section className={styles.profileSection}>

          <div className={styles.profileInfoWrapper}>
            <div className={styles.profileAvatar}>
              {firstName[0]}
            </div>
            <div>
              <h1 className={styles.profileName}>
                {firstName} {lastName}
              </h1>
              <p className={styles.profileSub}>Membre depuis le 14 juin 2023</p>
            </div>
          </div>

          <div className={styles.profileDistanceWrapper}>
            <span className={styles.profileTotalDistanceLabel}>Distance totale parcourue</span>

            <div className={styles.profileTotalDistanceButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              <span className={styles.profileTotalDistanceValue}>{stats.totalDistance || 0} km</span>
            </div>
          </div>

        </section>

        {/* Analytics Section - Row 1: Activity & Heart Rate Metrics */}
        <h2 className={styles.sectionTitle}>Vos dernières performances</h2>
        <div className={`${styles.rowContainer} ${styles.mb32}`}>

          <div className={styles.cardLeft}>
            <KmAverage kmData={activityData} />
          </div>

          <div className={styles.cardRight}>
            <DailyActivity activityData={activityData} />
          </div>
        </div>

        {/* Analytics Section - Row 2: Weekly Goals Progress & Macro KPI blocks */}
        <h2 className={styles.sectionTitle}>Cette semaine</h2>
        <div className={styles.rowContainer}>
          <div className={styles.cardLeftBottom}>
            <div>
              <h3 className={styles.cardLeftBottomTitle}>
                Score Global
              </h3>
              <p className={styles.cardLeftBottomSubtitle}>Avancement de votre objectif</p>
            </div>
            <ScoreProgress score={userScore} total={1} />
          </div>

          <div className={styles.statsRightContainer}>
            <div className={styles.textStatCard}>
              <p className={styles.textStatLabel}>Temps Total</p>
              <p className={styles.textStatValue}>
                {stats.totalDuration || 0} <span className={styles.textStatUnitBlue}>min</span>
              </p>
            </div>
            <div className={styles.textStatCard}>
              <p className={styles.textStatLabel}>Poids Actuel</p>
              <p className={styles.textStatValue}>
                {profile.weight || 0} <span className={styles.textStatUnitRed}>kg</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}