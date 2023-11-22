import React from "react";
import Logo from "./logo";
import { ModeToggle } from "./mode-toggle";
import SignInButton from "./sign-in-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95">
      <div className="px-5 h-14 flex items-center">
        <Logo />
        <div className="flex-1" />
        <div className="flex items-center gap-x-5">
          <ModeToggle />
          <SignInButton />
        </div>
      </div>
    </header>
  );
}
