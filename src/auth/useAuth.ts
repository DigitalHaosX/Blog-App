// src/auth/useAuth.ts
import { useAuthContext } from "./useAuthContext";

export const useAuth = () => {
  const { user, logout, loading } = useAuthContext();
  return { user, logout, loading };
};
