"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useAuth } from "@/lib/auth";

export default function BroadcastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    router.replace("/sign-in?redirect=/broadcast");
    return null;
  }

  return <div className="flex-1 flex">{children}</div>;
}
