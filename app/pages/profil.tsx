import { Link } from "react-router";
import styles from "./profil.module.css";

/**
 * Component page for the user profile.
 * Displays personal details and aggregated training metrics.
 * Aligned to the 1024px desktop design requirements.
 */
export default function Profil() {
  
  // TODO: Restore dynamic session tracking from useUser context (Step 6)
  // Temporary hardcoded session profile to test rendering layout
  const user = {
    userInfos: {
      firstName: "Clara",
      lastName: "Dupont"
    }
  };

  // TODO: Link these static profile properties to the backend API response data
  const profileDetails = {
    age: 29,
    gender: "Femme",
    height: "1m68",
    weight: "58kg",
    memberSince: "14 juin 2023"
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        
        {/* EN-TÊTE : LOGO + CAPSULE DE NAVIGATION */}
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
            <button className={styles.logoutButton}>Se déconnecter</button>
          </nav>
        </div>

        {/* SECTION SUPERIEURE : BANDEAU UTILISATEUR */}
        <section className={styles.userCard}>
          <div className={styles.avatar}>
            {user.userInfos.firstName[0]}
          </div>
          <div>
            <h1 className={styles.userName}>
              {user.userInfos.firstName} {user.userInfos.lastName}
            </h1>
            <p className={styles.userSub}>Membre depuis le {profileDetails.memberSince}</p>
          </div>
        </section>

        {/* CORPS PRINCIPAL : DOUBLE COLONNE */}
        <div className={styles.columnsContainer}>
          
          {/* PANNEAU GAUCHE : INFORMATIONS PERSONNELLES */}
          <section className={styles.leftColumn}>
            <div className={styles.profileInfoBlock}>
              <h2 className={styles.profileInfoTitle}>Votre profil</h2>
              <hr style={{ border: "none", height: "1px", backgroundColor: "#EAEAEA", margin: "0 0 20px 0" }} />
              
              <p className={styles.profileLine}>
                <strong>Âge :</strong> {profileDetails.age} ans
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

          {/* PANNEAU DROIT : GRILLE DES STATISTIQUES GLOBALES */}
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

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Calories brûlées</p>
                <p className={styles.statValue}>
                  25 000 <span className={styles.statUnit}>cal</span>
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