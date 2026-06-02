import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import { USE_MOCK } from "../services/config";
import styles from "./login.module.css";

/**
 * Login page component.
 * Handles user authentication via API or Mock, and manages form state.
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
   * Routes to either the mock login simulator or the real API.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      let token = "";
      let userId = "";

      if (USE_MOCK) {
        // --- MOCK LOGIN LOGIC ---
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (username === "user123" || username === "sophiemartin") {
          userId = "user123";
        } else if (username === "user789" || username === "emmaleroy") {
          userId = "user789";
        } else {
          throw new Error("Identifiants invalides en mode Mock. Essayez sophiemartin ou emmaleroy.");
        }

        token = "mock_jwt_token_12345";

      } else {
        // --- REAL API LOGIN LOGIC ---
        const response = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error("Identifiants invalides ou erreur serveur.");
        }

        const result = await response.json();
        token = result.token;
        userId = result.userId;

        if (!token) {
          throw new Error("Aucun jeton d'authentification reçu.");
        }
      }

      // Securely store credentials in local storage
      localStorage.setItem("sportsee_token", token);
      localStorage.setItem("sportsee_userId", userId);

      // Hydrate global user context
      setUser({ id: userId } as any);

      navigate("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "Une erreur est survenue lors de la connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: sophiemartin ou emmaleroy"
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