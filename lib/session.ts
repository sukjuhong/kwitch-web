import React from "react";

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
