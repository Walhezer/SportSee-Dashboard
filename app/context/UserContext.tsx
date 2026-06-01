import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { UserProfile } from "~/models/types"; 

// 1. On ajoute isLoading à la structure
interface UserContextType {
  user: UserProfile | null;                   
  setUser: (user: UserProfile | null) => void; 
  isLoading: boolean; // 👈 NOUVEAU
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export function UserProvider({ children }: { children: ReactNode }) {
  // On commence avec null, on ne lit plus le localStorage directement ici
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // 2. On indique que l'application est en train de chercher la session
  const [isLoading, setIsLoading] = useState(true);

  // 3. Mount Initialization: On lit le localStorage côté client uniquement
  useEffect(() => {
    const savedUser = localStorage.getItem("sportsee_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erreur lors de la lecture de la session:", error);
      }
    }
    // Une fois la vérification terminée, on enlève le mode chargement
    setIsLoading(false);
  }, []);

  // State Synchronization: Update localStorage on user change
  useEffect(() => {
    // ⚠️ Très important : on ignore cette étape tant que le chargement initial n'est pas fini,
    // sinon on risquerait d'effacer le localStorage par erreur !
    if (isLoading) return;

    if (user) {
      localStorage.setItem("sportsee_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("sportsee_user");
      localStorage.removeItem("sportsee_token"); 
    }
  }, [user, isLoading]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  
  return context;
};