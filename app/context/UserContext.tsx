import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserProfile } from "~/models/types"; 

// Structure
interface UserContextType {
  user: UserProfile | null;                   
  setUser: (user: UserProfile | null) => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook 
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error("useUser doit être utilisé à l'intérieur de UserProvider");
  }
  
  return context;
};