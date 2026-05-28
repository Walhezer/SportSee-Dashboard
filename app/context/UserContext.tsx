import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { UserProfile } from "~/models/types"; 

// Context Structure
interface UserContextType {
  user: UserProfile | null;                   
  setUser: (user: UserProfile | null) => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export function UserProvider({ children }: { children: ReactNode }) {
  // State Initialization: Lazy load from localStorage
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("sportsee_user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    }
    return null;
  });

  // State Synchronization: Update localStorage on user change
  useEffect(() => {
    if (user) {
      localStorage.setItem("sportsee_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("sportsee_user");
      localStorage.removeItem("sportsee_token"); 
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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