import styles from './profileHeader.module.css';
import tagIcon from '../assets/tag.svg';

// 1. On déclare nos propriétés attendues
interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  profilePicture: string;
  totalDistance?: number;
  showDistance?: boolean;
  createdAt?: string;
  variant?: "profile" | "dashboard";
}

// 2. Retrieve the properties
export default function ProfileHeader({
  firstName,
  lastName,
  profilePicture,
  totalDistance,
  showDistance = true,
  createdAt,
  variant = "profile"
}: ProfileHeaderProps) {

  const containerClass = variant === "dashboard" ? styles.dashboardSection : styles.profileSection;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    : "14 juin 2023";


  return (
    <section className={containerClass}>

      {/* LEFT BLOCK (Always displayed) */}
      <div className={styles.profileInfoWrapper}>
        <img
          src={profilePicture}
          alt={`Profil de ${firstName} ${lastName}`}
          className={styles.profileAvatar}
        />
        <div>
          <h1 className={styles.profileName}>
            {firstName} {lastName}
          </h1>
          <p className={styles.profileSub}>Membre depuis le {formattedDate}</p>
        </div>
      </div>

      {/* RIGHT BLOCK (Displays UNDER CONDITIONS) */}
      {showDistance && (
        <div className={styles.profileDistanceWrapper}>
          <span className={styles.profileTotalDistanceLabel}>Distance totale parcourue</span>

          <div className={styles.profileTotalDistanceButton}>
            <img src={tagIcon} alt="Icône distance" className={styles.profileTotalDistanceIcon} />
            <span className={styles.profileTotalDistanceValue}>{totalDistance || 0} km</span>
          </div>
        </div>
      )}

    </section>
  );
}