"use client";

import React from "react";
import ChannelNav from "@/components/channel-nav";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [foldNav, setFoldNav] = React.useState(false);

  return (
    <div className={`flex-1 flex ${foldNav ? "" : "xl:grid xl:grid-cols-5"}`}>
      <ChannelNav foldNav={foldNav} setFoldNav={setFoldNav} />
      <div className="col-span-4">{children}</div>
    </div>
  );
}
