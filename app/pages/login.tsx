import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import styles from "./login.module.css";

/**
 * Login page component.
 * Handles user authentication via JWT and manages form state.
 */
export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles the login form submission.
   * Sends credentials to the API, stores tokens, and redirects to the dashboard.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or server error.");
      }

      const result = await response.json();
      const { token, userId } = result;

      if (!token) {
        throw new Error("No authentication token received.");
      }

      // Securely store credentials in local storage
      localStorage.setItem("sportsee_token", token);
      localStorage.setItem("sportsee_userId", userId);

      // Hydrate global user context
      setUser({ id: userId } as any);

      navigate("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "An error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      {/* Authentication Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <div className={styles.logoBarRed1}></div>
            <div className={styles.logoBarRed2}></div>
            <div className={styles.logoBarBlue1}></div>
            <div className={styles.logoBarBlue2}></div>
          </div>
          <span className={styles.logoText}>SPORTSEE</span>
        </div>

        <div className={styles.formWrapper}>
          <h1 className={styles.mainTitle}>
            Transformez<br />vos stats en résultats
          </h1>
          <h2 className={styles.subTitle}>Se connecter</h2>

          <form onSubmit={handleSubmit}>
            {loginError && (
              <p className={styles.errorMessage}>
                {loginError}
              </p>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Adresse email ou identifiant</label>
              <input
                type="text"
                id="username"
                className={styles.input}
                placeholder="ex: sophiemartin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Mot de passe</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <a href="#forgot" className={styles.forgotLink}>Mot de passe oublié ?</a>
        </div>
      </div>

      {/* Visual Accent Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.infoBubble}>
          <p className={styles.infoText}>
            Analysez vos performances en un clin d'œil, suivez vos progrès et atteignez vos objectifs.
          </p>
        </div>
      </div>
    </div>
  );
}