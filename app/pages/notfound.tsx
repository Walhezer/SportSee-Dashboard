import { Link } from "react-router";
import styles from "./notfound.module.css";

/**
 * 404 Not Found page component.
 * Displayed when a user navigates to an undefined route.
 */
export default function NotFound() {
  return (
    <main className={styles.container}>
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" className={styles.homeLink}>
        Return to the home page
      </Link>
    </main>
  );
}