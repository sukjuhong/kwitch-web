import {
  Session,
  SessionContext,
  SessionContextValue,
} from "@/components/session-provider";
import React, { SetStateAction, useEffect } from "react";

export function useSession(): [
  Session,
  React.Dispatch<SetStateAction<Session>>
] {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const value = React.useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return [value.session, value.setSession];
}
