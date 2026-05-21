
import { useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";
import styles from "./login.module.css";

/**
 * Login page component.
 * Features a split layout with credentials input forms and brand visual accents.
 */
export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setUser({
      id: 12,
      userInfos: {
        firstName: "Sophie",
        lastName: "Clara",
        age: 29
      },
      keyData: {
        calorieCount: 2500,
        proteinCount: 90,
        carbohydrateCount: 150,
        lipidCount: 50
      }
    });

    // Redirection vers le tableau de bord
    navigate("/dashboard");
  };

  return (
    <div className={styles.splitContainer}>

      {/* PANNEAU GAUCHE : IDENTIFICATION */}
      <div className={styles.leftPanel}>

        {/* LOGO BRANDING */}
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

        {/* CONTENEUR FORMULAIRE */}
        <div className={styles.formWrapper}>
          <h1 className={styles.mainTitle}>
            Transformez<br />vos stats en résultats
          </h1>
          <h2 className={styles.subTitle}>Se connecter</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Adresse email</label>
              <input
                type="email"
                id="email"
                className={styles.input}
                placeholder="nom@exemple.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Mot de passe</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Se connecter
            </button>
          </form>

          <a href="#forgot" className={styles.forgotLink}>Mot de passe oublié ?</a>
        </div>

        {/* Empty structural spacer alignment helper */}
        <div></div>
      </div>

      {/* PANNEAU DROIT : IMAGE DE FOND ACCENT IMMERSIF */}
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