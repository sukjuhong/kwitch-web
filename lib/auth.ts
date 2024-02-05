import React, { useCallback } from "react";
import type { User } from "@/types";

export interface SignInParams {
  username: string;
  password: string;
}

export interface SignUpParams {
  username: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (signInParams: SignInParams) => Promise<boolean>;
  signUp: (signUpParams: SignUpParams) => Promise<boolean>;
  signOut: () => void;
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}
