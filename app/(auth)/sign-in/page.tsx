"use client";

import SignInForm from "@/components/sign-in-form";
import React from "react";
import { SessionContext } from "@/components/session-provider";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

export default function SignIn() {
  const { session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/channels");
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="w-2/3 lg:w-1/4">
        <p className="text-3xl mb-5">Sign In</p>
        <SignInForm />
      </div>
    </div>
  );
}
