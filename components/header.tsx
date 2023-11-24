"use client";

import React from "react";
import Logo from "./logo";
import { ModeToggle } from "./mode-toggle";
import SignInButton from "./sign-in-button";
import { SessionContext } from "./session-provider";
import SignUpButton from "./sign-up-button";
import UserButton from "./user-button";
import { useSession } from "@/hooks/useSession";

export default function Header() {
  const { session, update } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95">
      <div className="px-5 h-14 flex items-center">
        <Logo />
        <div className="flex-1" />
        <div className="flex items-center gap-x-5">
          <ModeToggle />
          {session ? (
            <UserButton />
          ) : (
            <>
              <SignInButton />
              <SignUpButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
