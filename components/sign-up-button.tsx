import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function SignUpButton() {
  return (
    <Button asChild className="bg-kookmin dark:text-white">
      <Link href="/sign-up">Get Started</Link>
    </Button>
  );
}
