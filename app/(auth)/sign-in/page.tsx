"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import SignInForm from "@/components/auth/sign-in-form";

export default function SignIn() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="w-2/3 lg:w-1/4">
        <p className="text-3xl mb-5">Sign In</p>
        <SignInForm />
      </div>
    </div>
  );
}
