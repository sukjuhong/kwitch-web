"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import React from "react";
import Logo from "./logo";
import { ModeToggle } from "./mode-toggle";
import LoginButton from "./login-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95">
      <div className="px-5 flex h-14 items-center">
        <Logo />
        <ModeToggle />
        <LoginButton />
      </div>
    </header>
  );
}
