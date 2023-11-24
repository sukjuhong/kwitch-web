"use client";

import React, { useEffect } from "react";
import Loading from "./loading";

export type Session = {
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
};

export type SessionContextValue = {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
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
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // TODO: get user info from server.
    // if you can't get user info, it describes user is not logged in.
    // currently, we just mock it. when you enter the page, you are logged in.

    // fetch("/api/users/me")
    setLoading(false);
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {loading ? <Loading /> : children}
    </SessionContext.Provider>
  );
}
