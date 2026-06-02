import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { UserProfile } from "~/models/types";

/**
 * Interface representing the structure of the User Context.
 */
interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Provider component that wraps the application to manage user authentication state.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load: Check for saved session in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("sportsee_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse stored user session:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Sync user state with localStorage
  useEffect(() => {
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

/**
 * Custom hook to consume the UserContext.
 * @throws {Error} If used outside of a UserProvider.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};