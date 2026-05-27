import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import styles from "./login.module.css";

/**
 * Login page component with JWT authentication.
 * Features a split layout with credentials input forms and brand visual accents.
 */
export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Form input and UI states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      // 1. Submit credentials to the backend API endpoint
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
      
      // Extract token and user ID from the response payload
      const { token, userId } = result;

      if (!token) {
        throw new Error("No authentication token received.");
      }

      // 2. Securely store the JWT token for subsequent API calls
      localStorage.setItem("sportsee_token", token);

      // 3. Hydrate the global user context with the authenticated ID
      // Using type assertion to bypass strict interface requirements temporarily
      setUser({ id: userId } as any);

      // Navigate to the secured dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "An error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.splitContainer}>

      {/* Left Panel: Authentication Form */}
      <div className={styles.leftPanel}>

        {/* Branding Area */}
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <div className={styles.logoBarRed1}></div>
            <div className={styles.logoBarRed2}></div>
            <div className={styles.logoBarBlue1}></div>
            <div className={styles.logoBarBlue2}></div>
          </div>
          <span className={styles.logoText}>
            SPORTSEE
          </span>
        </div>

        {/* Form Container */}
        <div className={styles.formWrapper}>
          <h1 className={styles.mainTitle}>
            Transformez<br />vos stats en résultats
          </h1>
          <h2 className={styles.subTitle}>Se connecter</h2>

          <form onSubmit={handleSubmit}>
            {loginError && (
              <p style={{ color: "#FF013F", marginBottom: "15px", fontSize: "14px" }}>
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

        <div></div>
      </div>

      {/* Right Panel: Immersive Visual Accent */}
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