"use client";

import React, { useEffect, useState } from "react";
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.replace("/sign-in?redirect=/broadcast");
    }
    setLoading(false);
  }, []);

  return loading ? <Loading /> : <div className="flex-1 flex">{children}</div>;
}
