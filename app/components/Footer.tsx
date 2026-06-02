import { Link } from "react-router";
import styles from "./footer.module.css";
import logo from "../assets/logo.svg";

/**
 * Footer component containing copyright information and secondary navigation links.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        <span className={styles.copyright}>©Sportsee Tous droits réservés</span>
      </div>

      <div className={styles.rightSection}>
        <Link to="/conditions" className={styles.footerLink}>Conditions générales</Link>
        <Link to="/contact" className={styles.footerLink}>Contact</Link>
        <img src={logo} alt="Logo SportSee" className={styles.logoImage} />
      </div>
    </footer>
  );
}