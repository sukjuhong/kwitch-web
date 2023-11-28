"use client";

import React, { useEffect } from "react";
import Loading from "./loading";
import { Socket, io } from "socket.io-client";

export type Session = {
  user: {
    userid: number;
    username: string;
    avatar?: string;
  };
};

export type SessionContextValue = {
  session: Session | null;
  update: React.Dispatch<React.SetStateAction<Session | null>>;
};

export const SessionContext = React.createContext<
  SessionContextValue | undefined
>(undefined);

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
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
