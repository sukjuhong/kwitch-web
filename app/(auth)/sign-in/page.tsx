"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Loading from "@/components/loading";
import SignInForm from "@/components/auth/sign-in-form";
import { useAuth } from "@/lib/auth";

export default function SignIn() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    router.replace("/channels");
    return null;
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
