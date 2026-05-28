import { Link, useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import { useFetch } from "~/hooks/useFetch";

// Data System Imports
import { USE_MOCK } from '../services/config';
import { getUserMainData } from '../services/api';
import { getUserMainDataMock } from '../services/mockApi';

import styles from "./profil.module.css";

/**
 * Component page for the user profile.
 * Displays personal details and aggregated training metrics.
 * Aligned to the 1024px desktop design requirements.
 */
export default function Profil() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Route guarding: redirect or block access if user session context is missing
  if (!user) {
    return (
      <main className={styles.errorMain}>
        <div className={styles.errorModal}>
          <h2 className={styles.errorTitle}>
            Session expirée
          </h2>
          <p className={styles.errorText}>
            Votre session a expiré suite à une période d'inactivité, ou vous n'êtes pas connecté. Veuillez vous reconnecter pour accéder à votre profil.
          </p>

          <Link to="/" className={styles.errorButton}>
            Retour à la connexion
          </Link>
        </div>
      </main>
    );
  }

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // Data Source Switch: API vs Mock
  const fetchProfileData = async () => {
    if (USE_MOCK) {
      return await getUserMainDataMock();
    } else {
      return await getUserMainData();
    }
  };

  const { data, isLoading, error } = useFetch(fetchProfileData, []);

  // Loading and error state handling
  if (isLoading) return <div style={{ padding: "40px", textAlign: "center" }}>Chargement de votre profil...</div>;
  if (error || !data) return <div style={{ padding: "40px", textAlign: "center", color: "red" }}>Erreur de chargement des données depuis le serveur.</div>;

  // Safe data extraction with fallbacks
  const userInfos = data?.userInfos || {};
  const keyData = data?.keyData || {};
  
  const firstName = userInfos.firstName || "Utilisateur";
  const lastName = userInfos.lastName || "";
  const age = userInfos.age || "--";
  const calories = keyData.calorieCount || 0;

  // Fallback data for fields not provided by the new SportSee API
  const profileDetails = {
    gender: "Non renseigné",
    height: "1m68", 
    weight: "58kg",
    memberSince: "14 juin 2023"
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        
        {/* Top Header: Branding & Navigation */}
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
            <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link to="/profil" className={styles.navLinkActive}>Mon profil</Link>
            <span className={styles.navSeparator}>|</span>
            <button onClick={handleLogout} className={styles.logoutButton}>Se déconnecter</button>
          </nav>
        </div>

        {/* Top Section: User Banner */}
        <section className={styles.userCard}>
          <div className={styles.avatar}>
            {firstName[0]}
          </div>
          <div>
            <h1 className={styles.userName}>
              {firstName} {lastName}
            </h1>
            <p className={styles.userSub}>Membre depuis le {profileDetails.memberSince}</p>
          </div>
        </section>

        {/* Main Body: Two-Column Layout */}
        <div className={styles.columnsContainer}>
          
          {/* Left Column: Personal Information */}
          <section className={styles.leftColumn}>
            <div className={styles.profileInfoBlock}>
              <h2 className={styles.profileInfoTitle}>Votre profil</h2>
              <hr style={{ border: "none", height: "1px", backgroundColor: "#EAEAEA", margin: "0 0 20px 0" }} />
              
              <p className={styles.profileLine}>
                <strong>Âge :</strong> {age} ans
              </p>
              <p className={styles.profileLine}>
                <strong>Genre :</strong> {profileDetails.gender}
              </p>
              <p className={styles.profileLine}>
                <strong>Taille :</strong> {profileDetails.height}
              </p>
              <p className={styles.profileLine}>
                <strong>Poids :</strong> {profileDetails.weight}
              </p>
            </div>
          </section>

          {/* Right Column: Global Statistics Grid */}
          <section className={styles.rightColumn}>
            <h2 className={styles.statsSectionTitle}>Vos statistiques</h2>
            <p className={styles.statsSectionSubtitle}>depuis le {profileDetails.memberSince}</p>

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