"use client";

import React from "react";
import Logo from "./logo";
import { ModeToggle } from "./mode-toggle";
import SignInButton from "./auth/sign-in-button";
import SignUpButton from "./auth/sign-up-button";
import UserButton from "./user-button";
import { useSession } from "@/hooks/useSession";
import CreateChannelButton from "./create-channel-button";

export default function Header() {
  const { session } = useSession();

  return (
    <header className="w-full border-b bg-background/95">
      <div className="px-5 h-14 flex items-center">
        <Logo />
        <div className="flex-1" />
        <div className="flex items-center gap-x-5">
          <ModeToggle />
          {session ? (
            <>
              <UserButton />
              <CreateChannelButton />
            </>
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
