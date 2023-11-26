import { type Session, SessionContext } from "@/components/session-provider";
import React from "react";
import * as z from "zod";
import { formSchema as SignInSchema } from "@/components/auth/sign-in-form";
import { formSchema as SignUpSchema } from "@/components/auth/sign-up-form";

export type SignUpContext = {
  id: string;
  username: string;
  password: string;
};

export function useSession(): {
  session: Session | null;
  // signUp: (signUpContext: z.infer<typeof SignUpSchema>) => Promise<void>;
  signIn: (signInContext: z.infer<typeof SignInSchema>) => Promise<boolean>;
  signOut: () => void;
} {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const value = React.useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  async function signIn(formSchema: z.infer<typeof SignInSchema>) {
    const { id, password } = formSchema;
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const data = await res.json();

    if (res.ok) {
      value!.setSession({
        user: {
          userid: data.userid,
          username: data.nickname,
        },
      });
    }

    return res.ok;
  }

  function signOut() {
    fetch("/api/signout", { method: "POST" });
    value!.setSession(null);
  }

  function signUp() {}

  return {
    session: value.session,
    signIn,
    signOut,
  };
}
