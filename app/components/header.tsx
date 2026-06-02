import { Link, useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import styles from "./header.module.css";
import logo from "../assets/logo.svg";

/**
 * Header component containing the application logo and main navigation.
 * Manages user logout actions.
 */
export default function Header() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  /**
   * Clears the user session, removes authentication tokens,
   * and redirects to the login page.
   */
  const handleLogout = () => {
    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("sportsee_token");
    }

    navigate("/");
  };

  return (
    <header className={styles.headerTop}>
      <div className={styles.logoArea}>
        <div className={styles.logoImage}>
          <img src={logo} alt="Logo SportSee" />
        </div>
        <span className={styles.logoText}>SPORTSEE</span>
      </div>

      <nav className={styles.navBubble}>
        <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
        <Link to="/profil" className={styles.navLink}>Mon profil</Link>
        <span className={styles.navSeparator}>|</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}