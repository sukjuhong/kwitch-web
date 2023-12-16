"use client";

import { useEffect, useState } from "react";

import { AuthContext, SignInParams, SignUpParams, User } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user/me", { cache: "no-cache" });

      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data.accountId,
          username: data.nickname,
        });
      }

      setIsLoading(false);
    }

    fetchUser();
  }, []);

  async function signIn(signInParams: SignInParams) {
    const res = await fetch("/api/signin", {
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
        id: data.accountId,
        username: data.nickname,
      });
    }

    return res.ok;
  }

  async function signUp(signUpParams: SignUpParams) {
    const res = await fetch("/api/signup", {
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
    fetch("/api/signout", {
      method: "POST",
    }).then(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
