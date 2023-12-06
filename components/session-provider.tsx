"use client";

import React, { useState, useEffect } from "react";
import type { Session } from "@/lib/session";
import { SessionContext } from "@/lib/session";

import Loading from "./loading";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/user/me", { cache: "no-cache" });

      if (res.ok) {
        const data = await res.json();
        setSession({
          user: {
            userid: data.accountId,
            username: data.nickname,
          },
        });
      } else {
        console.log("You are not logged in");
      }

      setLoading(false);
    };
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, update: setSession }}>
      {loading ? <Loading /> : children}
    </SessionContext.Provider>
  );
}
