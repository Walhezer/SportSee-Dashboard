import { Link } from "react-router";
import styles from "./footer.module.css";
import logo from "../assets/logo.svg";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            {/* Côté gauche : Copyright */}
            <div className={styles.leftSection}>
                <span className={styles.copyright}>©Sportsee Tous droits réservés</span>
            </div>

            {/* Côté droit : Liens et mini-logo */}
            <div className={styles.rightSection}>
                <Link to="/conditions" className={styles.footerLink}>Conditions générales</Link>
                <Link to="/contact" className={styles.footerLink}>Contact</Link>
                <img src={logo} alt="Logo SportSee" className={styles.logoImage} />
            </div>
        </footer>
    );
}