"use client";

import { useSession } from "@/hooks/useSession";
import { usePathname } from "next/navigation";

import Logo from "./logo";
import { ModeToggle } from "./mode-toggle";
import CreateChannelButton from "./create-channel-button";
import SignInButton from "./auth/sign-in-button";
import SignUpButton from "./auth/sign-up-button";
import UserButton from "./user-button";

export default function Header() {
  const { session } = useSession();
  const pathname = usePathname();

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
              {pathname !== "/broadcast" && <CreateChannelButton />}
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
