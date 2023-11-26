"use client";

import React, { useEffect } from "react";
import ChannelNav from "@/components/channels/channel-nav";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [foldNav, setFoldNav] = React.useState(false);
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/sign-in?redirect=/channels");
    }
  }, []);

  return session ? (
    <div className={`flex-1 flex ${foldNav ? "" : "xl:grid xl:grid-cols-5"}`}>
      <ChannelNav foldNav={foldNav} setFoldNav={setFoldNav} />
      <div className="col-span-4">{children}</div>
    </div>
  ) : (
    <Loading />
  );
}
