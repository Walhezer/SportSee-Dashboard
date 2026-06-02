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
 * Calculates the week's date range based on the latest activity in the dataset.
 * @param {any[]} activityData - The array of user activities.
 * @returns {string} Formatted string "Du [start date] au [end date]".
 */
const getWeekRange = (activityData: any[]): string => {
  if (!activityData || activityData.length === 0) return "Dates indisponibles";

  const lastSession = activityData[activityData.length - 1];
  const referenceDate = new Date(lastSession.day || lastSession.date);

  const dayOfWeek = referenceDate.getDay() || 7;
  const startOfWeek = new Date(referenceDate);
  startOfWeek.setDate(referenceDate.getDate() - dayOfWeek + 1);
  
  const endOfWeek = new Date(referenceDate);
  endOfWeek.setDate(referenceDate.getDate() - dayOfWeek + 7);
  
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  
  return `Du ${startOfWeek.toLocaleDateString('fr-FR', options)} au ${endOfWeek.toLocaleDateString('fr-FR', options)}`;
};

/**
 * Dashboard page component.
 * Displays user analytics, activity charts, and performance metrics.
 */
export default function Dashboard() {
  const { user, setUser, isLoading: isSessionLoading } = useUser();
  const navigate = useNavigate();

  /**
   * Fetches dashboard data from either the API or mock services based on configuration.
   * @returns {Promise<{main: any, activity: any}>} The user's main profile and activity data.
   */
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

  const { data, isLoading, error } = useFetch(fetchDashboardData, []);

  /**
   * Clears user session and redirects to the login page.
   */
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // Rendering logic based on authentication and data states
  if (isSessionLoading) {
    return (
      <main className={styles.errorMain}>
        <div className={styles.sessionLoading}>
          Restoring your session...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.errorMain}>
        <div className={styles.errorModal}>
          <h2 className={styles.errorTitle}>Session expired</h2>
          <p className={styles.errorText}>
            Your session has expired or you are not connected. Please log in to access your dashboard.
          </p>
          <Link to="/" className={styles.errorButton}>
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) return <div className={styles.apiLoading}>Loading your metrics...</div>;

  if (error || !data) {
    return (
      <main className={styles.errorMain}>
        <div className={styles.errorModal}>
          <h2 className={styles.errorTitle}>Server error</h2>
          <p className={styles.errorText}>
            Unable to load data. The server might be unreachable or your session is out of sync.
          </p>
          <button
            onClick={handleLogout}
            className={styles.errorButton}
            style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Back to login
          </button>
        </div>
      </main>
    );
  }

  // Data processing
  const { main, activity } = data;
  const activityData = Array.isArray(activity) ? activity : [];
  const weekRangeText = getWeekRange(activityData);
  const profile = main?.profile || {};
  const stats = main?.statistics || {};

  const {
    firstName = "User",
    lastName = "",
    profilePicture: pictureUrl = "",
  } = profile;

  const totalDistance = stats.totalDistance || 0;
  const formattedDistance = Math.round(Number(totalDistance));

  const lastWeekActivity = activityData.slice(-7);
  const weeklyDuration = lastWeekActivity.reduce((total, session) => total + (session.duration || 0), 0);
  const weeklyDistance = lastWeekActivity.reduce((total, session) => total + (session.distance || 0), 0);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <Header />
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          profilePicture={pictureUrl}
          totalDistance={formattedDistance}
          createdAt={profile.createdAt}
          variant="dashboard"
        />

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

        <div className={styles.sectionHeader}>
         <h2 className={styles.sectionTitle}>Cette semaine</h2>
          <p className={styles.sectionSubtitle}>{weekRangeText}</p>
        </div>

        <div className={styles.rowContainer}>
          <div className={styles.cardLeftBottom}>
            <ScoreProgress current={4} target={6} />
          </div>
          <div className={styles.statsRightContainer}>
            <div className={styles.textStatCard}>
              <p className={styles.textStatLabel}>Durée d'activité</p>
              <p className={styles.textStatValueBlue}>
                {weeklyDuration} <span className={styles.unitBlue}>min</span>
              </p>
            </div>
            <div className={styles.textStatCard}>
              <p className={styles.textStatLabel}>Distance</p>
              <p className={styles.textStatValueRed}>
                {weeklyDistance.toFixed(1)} <span className={styles.unitRed}>km</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}