"use client";

import { useEffect, useState } from "react";
import { AuthContext, SignInParams, SignUpParams } from "@/lib/auth";
import type { User } from "@/types";
import { toast } from "./ui/use-toast";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/users/me", { cache: "no-cache" });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }

      setIsLoading(false);
    }

    fetchUser();
  }, []);

  async function signIn(signInParams: SignInParams) {
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signInParams),
      cache: "no-cache",
    });

    if (res.ok) {
      const data = await res.json();
      setUser({
        username: data.nickname,
      });
    }

    return res.ok;
  }

  async function signUp(signUpParams: SignUpParams) {
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpParams),
      cache: "no-cache",
    });

    return res.ok;
  }

  function signOut() {
    fetch("/api/auth/sign-out", {
      method: "POST",
    }).then(() => {
      setUser(null);
      toast({ title: "You are signed out." });
    });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
