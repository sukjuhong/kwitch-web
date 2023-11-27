"use client";

import Chat from "@/components/channels/chat";
import { socket } from "@/lib/socket";
import React, { useEffect } from "react";

export default function ChannelPage({
  params,
}: {
  params: { broadcastor: string };
}) {
  let { broadcastor } = params;
  broadcastor = decodeURI(broadcastor);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="flex-1">
        <h1>방송공간</h1>
      </div>
      <div className="w-80 border-l flex flex-col">
        <Chat socket={socket} room={broadcastor} />
      </div>
    </>
  );
}
