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

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex gap-x-5 items-center">
          <Logo />
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
