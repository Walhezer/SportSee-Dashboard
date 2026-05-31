import { Link, useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import { useFetch } from "~/hooks/useFetch";

// Services & Components
import { USE_MOCK } from '../services/config';
import { getUserMainData } from '../services/api';
import { getUserMainDataMock } from '../services/mockApi';
import ProfileHeader from '../components/ProfileHeader';
import Header from "../components/header";
import styles from "./profil.module.css";

// --- UTILITY FUNCTIONS ---
// Extracted outside the component to prevent unnecessary re-creations on every render

/** Formats height from cm to meters (e.g., 165 -> "1m65") */
const formatHeight = (h?: number): string => {
  if (!h) return "Non renseignée";
  const meters = Math.floor(h / 100);
  const centimeters = h % 100;
  // padStart ensures "1m05" instead of "1m5" if height is 105cm
  return `${meters}m${centimeters.toString().padStart(2, '0')}`;
};

/** Converts total minutes into hours and minutes */
const formatDuration = (totalMinutes?: number) => {
  if (!totalMinutes) return { hours: 0, mins: 0 };
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return { hours, mins };
};

/**
 * User Profile Component
 * Displays personal details and aggregated training metrics.
 * Aligned to the 1024px desktop design requirements.
 */
export default function Profil() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // --- 1. ROUTE GUARDING ---
  // Redirect or block access if user session context is missing
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

  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // --- 2. DATA FETCHING ---
  // Passes the current user.id to ensure we fetch the correct profile
  const fetchProfileData = async () => {
    if (USE_MOCK) {
      return await getUserMainDataMock();
    } else {
      return await getUserMainData();
    }
  };

  const { data, isLoading, error } = useFetch(fetchProfileData, []);

  // --- 3. LOADING & ERROR STATES ---
  if (isLoading) return <div style={{ padding: "40px", textAlign: "center" }}>Chargement de votre profil...</div>;
  if (error || !data) return <div style={{ padding: "40px", textAlign: "center", color: "red" }}>Erreur de chargement des données depuis le serveur.</div>;

  // --- 4. DATA EXTRACTION & FORMATTING ---
  // Safe extraction with fallbacks
  const userProfile = data.profile || {};
  const userStats = data.statistics || {};

  // 1. Destructuration du Profil
  const {
    firstName = "Utilisateur",
    lastName = "",
    profilePicture = "",
    age: rawAge,
    weight: rawWeight,
    height: rawHeight,
    gender: apiGender = "",
    createdAt
  } = userProfile;

  console.log("1. Objet userProfile complet :", userProfile);
  console.log("2. Valeur extraite (apiGender) :", apiGender);
  console.log("3. Type de apiGender :", typeof apiGender);

  // Formatted Profile Details
  const age = rawAge ? `${rawAge} ans` : "-- ans";
  const weight = rawWeight ? `${rawWeight}kg` : "Non renseigné";
  const height = formatHeight(rawHeight);

  // La date dynamique au lieu du texte en dur
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : "14 juin 2023";

  const rawGender = apiGender.toLowerCase();
  let gender = "Non renseigné";
  if (rawGender.startsWith("f")) {
    gender = "Femme";
  } else if (rawGender.startsWith("m") || rawGender.startsWith("h")) {
    gender = "Homme";
  }

  // 2. Destructuration des Statistiques
  const {
    totalDuration,
    totalDistance = 0,
    totalSessions: sessions = 0,
    calories = 0,
    restDays = 0
  } = userStats;

  // Formatted Global Statistics
  const duration = formatDuration(totalDuration);
  const distance = totalDistance ? Math.round(Number(totalDistance)) : 0;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>

        {/* Top Header: Branding & Navigation */}
        <Header />

        {/* Main Body: Two-Column Layout */}
        <div className={styles.columnsContainer}>

          {/* Left Column: Personal Information */}
          <section className={styles.leftColumn}>

            {/* Top Section: User Banner */}
            <ProfileHeader
              firstName={firstName || "Utilisateur"}
              lastName={lastName || ""}
              profilePicture={profilePicture || ""}
              showDistance={false}
            />

            <div className={styles.profileInfoBlock}>
              <h2 className={styles.profileInfoTitle}>Votre profil</h2>
              <hr style={{ border: "none", height: "1px", backgroundColor: "#EAEAEA", margin: "0 0 20px 0" }} />

              <p className={styles.profileLine}>
                <strong>Âge :</strong> {age}
              </p>
              <p className={styles.profileLine}>
                <strong>Genre :</strong> {gender}
              </p>
              <p className={styles.profileLine}>
                <strong>Taille :</strong> {height}
              </p>
              <p className={styles.profileLine}>
                <strong>Poids :</strong> {weight}
              </p>
            </div>
          </section>

          {/* Right Column: Global Statistics Grid */}
          <section className={styles.rightColumn}>
            <h2 className={styles.statsSectionTitle}>Vos statistiques</h2>
            <p className={styles.statsSectionSubtitle}>depuis le {memberSince}</p>

            <div className={styles.statsGrid}>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Temps total couru</p>
                <p className={styles.statValue}>
                  27h <span className={styles.statUnit}>15min</span>
                </p>
              </div>

              {/* Calories mapped from API */}
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Calories brûlées</p>
                <p className={styles.statValue}>
                  {calories.toLocaleString('fr-FR')} <span className={styles.statUnit}>cal</span>
                </p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Distance totale parcourue</p>
                <p className={styles.statValue}>
                  312 <span className={styles.statUnit}>km</span>
                </p>
              </div>

              <div className={styles.statCard}>
                <p style={{ margin: "0 0 16px 0", fontSize: "13px", opacity: 0.9 }}>Nombre de jours de repos</p>
                <p className={styles.statValue}>
                  9 <span className={styles.statUnit}>jours</span>
                </p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Nombre de sessions</p>
                <p className={styles.statValue}>
                  41 <span className={styles.statUnit}>sessions</span>
                </p>
              </div>

            </div>
          </section>

        </div>

      </div>
    </div>
  );
}