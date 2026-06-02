import { Link, useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import { useFetch } from "~/hooks/useFetch";

// Services & Components
import { USE_MOCK } from '../services/config';
import { getUserMainData } from '../services/api';
import { getUserMainDataMock } from '../services/mockApi';
import ProfileHeader from '../components/ProfileHeader';
import Header from "../components/header";
import Footer from "../components/Footer";
import styles from "./profil.module.css";

/** * Formats height from cm to meters (e.g., 165 -> "1m65") 
 * @param {number} h - Height in centimeters.
 * @returns {string} Formatted height string.
 */
const formatHeight = (h?: number): string => {
  if (!h) return "Non renseignée";
  const meters = Math.floor(h / 100);
  const centimeters = h % 100;
  return `${meters}m${centimeters.toString().padStart(2, '0')}`;
};

/** * Converts total minutes into hours and minutes object.
 * @param {number} totalMinutes - Total duration in minutes.
 * @returns {{hours: number, mins: number}} Formatted time object.
 */
const formatDuration = (totalMinutes?: number) => {
  if (!totalMinutes) return { hours: 0, mins: 0 };
  return {
    hours: Math.floor(totalMinutes / 60),
    mins: totalMinutes % 60
  };
};

/**
 * User Profile component.
 * Displays personal details and aggregated training metrics.
 */
export default function Profil() {
  // 1. --- ALL HOOKS ARE CALLED FIRST ---
  const { user, setUser, isLoading: isSessionLoading } = useUser();
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    return USE_MOCK ? await getUserMainDataMock() : await getUserMainData();
  };

  const { data, isLoading, error } = useFetch(fetchProfileData, []);

  // 2. --- EARLY RETURNS FOR LOADING AND ERROR STATES ---
  if (isSessionLoading) return <div className={styles.apiLoading}>Chargement de la session...</div>;
  
  if (!user) {
    return (
      <main className={styles.errorMain}>
        <div className={styles.errorModal}>
          <h2 className={styles.errorTitle}>Session expirée</h2>
          <p className={styles.errorText}>Veuillez vous connecter pour accéder à votre profil.</p>
          <Link to="/" className={styles.errorButton}>Retour à la connexion</Link>
        </div>
      </main>
    );
  }

  if (isLoading) return <div className={styles.apiLoading}>Chargement du profil...</div>;
  if (error || !data) return <div className={styles.apiError}>Erreur lors du chargement des données.</div>;

  // 3. --- DATA LOGIC AND PROCESSING ---
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const profile = data.profile || {};
  const stats = data.statistics || {};

  const { firstName = "User", lastName = "", profilePicture = "", age: rawAge, weight: rawWeight, height: rawHeight, gender: apiGender = "", createdAt } = profile;
  
  const age = rawAge ? `${rawAge} ans` : "-- ans";
  const weight = rawWeight ? `${rawWeight} kg` : "N/A";
  const height = formatHeight(rawHeight);
  const memberSince = createdAt ? new Date(createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : "14 juin 2023";
  
  const gender = apiGender.toLowerCase().startsWith("f") ? "Femme" : "Homme";
  const { hours, mins } = formatDuration(stats.totalDuration);

  // 4. --- COMPONENT RENDER ---
  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <Header />
        <div className={styles.columnsContainer}>
          <section className={styles.leftColumn}>
            <ProfileHeader firstName={firstName} lastName={lastName} profilePicture={profilePicture} showDistance={false} />
            <div className={styles.profileInfoBlock}>
              <h2 className={styles.profileInfoTitle}>Votre profil</h2>
              <div className={styles.divider} />
              <p className={styles.profileLine}><strong>Âge :</strong> {age}</p>
              <p className={styles.profileLine}><strong>Genre :</strong> {gender}</p>
              <p className={styles.profileLine}><strong>Taille :</strong> {height}</p>
              <p className={styles.profileLine}><strong>Poids :</strong> {weight}</p>
            </div>
          </section>

          <section className={styles.rightColumn}>
            <h2 className={styles.statsSectionTitle}>Vos statistiques</h2>
            <p className={styles.statsSectionSubtitle}>depuis le {memberSince}</p>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}><p className={styles.statLabel}>Temps total</p><p className={styles.statValue}>{hours}h <span className={styles.statUnit}>{mins}min</span></p></div>
              <div className={styles.statCard}><p className={styles.statLabel}>Calories</p><p className={styles.statValue}>{stats.calories?.toLocaleString('fr-FR')} <span className={styles.statUnit}>cal</span></p></div>
              <div className={styles.statCard}><p className={styles.statLabel}>Distance</p><p className={styles.statValue}>{Math.round(Number(stats.totalDistance))} <span className={styles.statUnit}>km</span></p></div>
              <div className={styles.statCard}><p className={styles.statLabel}>Jours de repos</p><p className={styles.statValue}>{stats.restDays} <span className={styles.statUnit}>jours</span></p></div>
              <div className={styles.statCard}><p className={styles.statLabel}>Sessions</p><p className={styles.statValue}>{stats.totalSessions} <span className={styles.statUnit}>sessions</span></p></div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}