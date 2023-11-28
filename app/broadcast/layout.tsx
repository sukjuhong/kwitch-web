"use client";

import React, { useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function BroadcastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/sign-in?redirect=/broadcast");
    }
  }, []);

  return session ? <div className="flex-1 flex">{children}</div> : <Loading />;
}
