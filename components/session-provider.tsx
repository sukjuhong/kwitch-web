"use client";

import React from "react";
import Loading from "./loading";

import type { Session } from "@/lib/session";

import { SessionContext } from "@/lib/session";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/user/info", { cache: "no-cache" });

      if (res.ok) {
        const data = await res.json();
        setSession({
          user: {
            userid: data.userId,
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
