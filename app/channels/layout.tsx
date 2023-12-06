"use client";

import React, { useEffect, useState } from "react";
import ChannelNav from "@/components/channels/channel-nav";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useSocket } from "@/lib/socket";
import { useAuth } from "@/lib/auth";

export default function ChannelLayout({
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
    router.replace("/sign-in?redirect=/channels");
    return null;
  }

  return (
    <div className="flex-1 flex">
      <ChannelNav />
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}
