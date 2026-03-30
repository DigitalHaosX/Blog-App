import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout?: () => Promise<void>;
};

// ✅ export the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
