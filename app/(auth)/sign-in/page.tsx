"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

import Loading from "@/components/loading";
import SignInForm from "@/components/auth/sign-in-form";

export default function SignIn() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/channels");
    }
  }, []);

  return session ? (
    <Loading />
  ) : (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="w-2/3 lg:w-1/4">
        <p className="text-3xl mb-5">Sign In</p>
        <SignInForm />
      </div>
    </div>
  );
}
