"use client";

import React, { useEffect, useState } from "react";
import ChannelNav from "@/components/channels/channel-nav";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const router = useRouter();

  const [foldNav, setFoldNav] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/sign-in?redirect=/channels");
    }
  }, []);

  return session ? (
    <div className={`flex-1 flex`}>
      <ChannelNav foldNav={foldNav} setFoldNav={setFoldNav} />
      <div className={`flex-1 flex ${foldNav ? "" : "xl:col-span-4"}`}>
        {children}
      </div>
    </div>
  ) : (
    <Loading />
  );
}
