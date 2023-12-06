"use client";

import React, { useEffect, useState } from "react";
import ChannelNav from "@/components/channels/channel-nav";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useSocket } from "@/lib/socket";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.replace("/sign-in?redirect=/channels");
      return;
    }
    setLoading(false);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="flex-1 flex">
      <ChannelNav />
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}
