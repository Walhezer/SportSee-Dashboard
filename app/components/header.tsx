import { Link } from "react-router";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.headerTop}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <div className={styles.logoBarRed1}></div>
          <div className={styles.logoBarRed2}></div>
          <div className={styles.logoBarBlue1}></div>
          <div className={styles.logoBarBlue2}></div>
        </div>
        <span className={styles.logoText}>
          SPORTSEE</span>
      </div>

      <nav className={styles.navBubble}>
        <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
        <Link to="/profil" className={styles.navLink}>Mon profil</Link>
        <span className={styles.navSeparator}>|</span>
        <button className={styles.logoutButton}>Se déconnecter</button>
      </nav>
    </header>
  );
}