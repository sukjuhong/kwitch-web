import React, { useEffect } from "react";
import * as z from "zod";
import { Socket, io } from "socket.io-client";

import { signInSchema } from "@/components/auth/sign-in-form";
import { signUpSchema } from "@/components/auth/sign-up-form";

import type { Session } from "@/lib/session";
import { SessionContext } from "@/lib/session";

export function useSession(): {
  session: Session | null;
  signUp: (signUpValue: z.infer<typeof signUpSchema>) => Promise<boolean>;
  signIn: (signInValue: z.infer<typeof signInSchema>) => Promise<boolean>;
  signOut: () => void;
} {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const value = React.useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  async function signIn(signInValue: z.infer<typeof signInSchema>) {
    const { id, password } = signInValue;
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
      cache: "no-cache",
    });

    const data = await res.json();

    if (res.ok) {
      value!.update({
        user: {
          userid: data.userid,
          username: data.nickname,
        },
      });
    }

    return res.ok;
  }

  function signOut() {
    fetch("/api/signout", { method: "POST", cache: "no-cache" });
    value!.update(null);
  }

  async function signUp(signUpValue: z.infer<typeof signUpSchema>) {
    const { id, username, password } = signUpValue;
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, nickname: username, password }),
      cache: "no-cache",
    });

    return res.ok;
  }

  return {
    session: value.session,
    signIn,
    signOut,
    signUp,
  };
}
