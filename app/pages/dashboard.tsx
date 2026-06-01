import { Link, useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import { useFetch } from "~/hooks/useFetch";
import { USE_MOCK } from '../services/config';
import { getUserActivity, getUserMainData } from '../services/api';
import { getUserActivityMock, getUserMainDataMock } from '../services/mockApi';
import Header from "../components/header";
import Footer from "../components/Footer";
import ProfileHeader from '../components/ProfileHeader';
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
  const { user, setUser, isLoading: isSessionLoading } = useUser();
  const navigate = useNavigate();

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

  //logout function
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  //A. loading session (local memory)
  if (isSessionLoading) {
    return (
      <main className={styles.errorMain}>
        <div className={styles.sessionLoading}>
          Restauration de votre session...
        </div>
      </main>
    );
  }

  //B. Route guarding: redirect or block access if user session context is missing
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

  //C. Handle API loading and error states
  if (isLoading) return <div className={styles.apiLoading}>Chargement de vos indicateurs...</div>;

  //D. if API return an error
  if (error || !data) {
    return (
      <main className={styles.errorMain}>
        <div className={styles.errorModal}>
          <h2 className={styles.errorTitle}>Erreur serveur</h2>
          <p className={styles.errorText}>
            Impossible de charger vos données. Le serveur est peut-être indisponible ou votre session n'est plus synchronisée.
          </p>
          <button
            onClick={handleLogout}
            className={styles.errorButton}
            style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Retour à la connexion
          </button>
        </div>
      </main>
    );
  }

  // Extract backend data
  const { main, activity } = data;

  // The activity API returns an array
  const activityData = Array.isArray(activity) ? activity : [];

  // Securing access to data from the new API
  const profile = main?.profile || {};
  const stats = main?.statistics || {};

  // 1. Destructuration du profil avec valeurs par défaut
  const {
    firstName = "Utilisateur",
    lastName = "",
    profilePicture: pictureUrl = "",
    createdAt
  } = profile;

  // 2. Destructuration des statistiques
  const { totalDistance = 0 } = stats;
  const formattedDistance = totalDistance ? Math.round(Number(totalDistance)) : 0;

  const lastWeekActivity = activityData.slice(-7);

  const weeklyDuration = lastWeekActivity.reduce((total, session) => total + (session.duration || 0), 0);
  const weeklyDistance = lastWeekActivity.reduce((total, session) => total + (session.distance || 0), 0);

  return (
    <div className={styles.mainContainer}>
      {/* Width constrained container to fulfill Product Owner specification for 1024px desktop layout */}
      <div className={styles.contentWrapper}>

        {/* Top Header: Branding Logo & Profile Navigation Capsule */}
        <Header />

        {/* Profile Header:*/}
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          profilePicture={pictureUrl}
          totalDistance={formattedDistance}
          createdAt={profile.createdAt}
          variant="dashboard"
        />

        {/* Analytics Section - Row 1: Activity & Heart Rate Metrics */}
        <div className={styles.performanceHeader}>
          <h2 className={styles.sectionTitle}>Vos dernières performances</h2>
        </div>
        <div className={`${styles.rowContainer} ${styles.mb32}`}>

          <div className={styles.cardLeft}>
            <KmAverage kmData={activityData} />
          </div>

          <div className={styles.cardRight}>
            <DailyActivity activityData={activityData} />
          </div>
        </div>

        {/* --- Analytics Section - Row 2 --- */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Cette semaine</h2>
          <p className={styles.sectionDate}>Du 23/06/2025 au 30/06/2025</p>
        </div>

        <div className={styles.rowContainer}>

          {/* Left-hand map (Donut chart) */}
          <div className={styles.cardLeftBottom}>
            <ScoreProgress current={4} target={6} />
          </div>

          {/* Right column (The two small cards) */}
          <div className={styles.statsRightContainer}>

            {/* Map 1: Activity Duration */}
            <div className={styles.textStatCard}>
              <p className={styles.textStatLabel}>Durée d'activité</p>
              <p className={styles.textStatValueBlue}>
                {weeklyDuration} <span className={styles.unitBlue}>minutes</span>
              </p>
            </div>

            {/* Map 2: Distance */}
            <div className={styles.textStatCard}>
              <p className={styles.textStatLabel}>Distance</p>
              <p className={styles.textStatValueRed}>
                {weeklyDistance.toFixed(1)} <span className={styles.unitRed}>kilomètres</span>
              </p>
            </div>

          </div>
        </div>

      </div>
      <Footer />
    </div >
  );
}