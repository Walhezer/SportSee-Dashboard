import styles from './profileHeader.module.css';
import tagIcon from '../assets/tag.svg';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  profilePicture: string; 
  totalDistance: number;
}

export default function ProfileHeader({ firstName, lastName, profilePicture, totalDistance }: ProfileHeaderProps) {
  return (
    <section className={styles.profileSection}>
      
      {/* Bloc gauche : Photo et informations */}
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
          <p className={styles.profileSub}>Membre depuis le 14 juin 2023</p>
        </div>
      </div>

      {/* Bloc droite : Distance */}
      <div className={styles.profileDistanceWrapper}>
        <span className={styles.profileTotalDistanceLabel}>Distance totale parcourue</span>
        
        <div className={styles.profileTotalDistanceButton}>
          <img src={tagIcon} alt="Icône distance" className={styles.profileTotalDistanceIcon} />
          <span className={styles.profileTotalDistanceValue}>{totalDistance || 0} km</span>
        </div>
      </div>

    </section>
  );
}