"use client";

import Chat from "@/components/channels/chat";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function ChannelPage({
  params,
}: {
  params: { broadcaster: string };
}) {
  let { broadcaster } = params;
  broadcaster = decodeURI(broadcaster);

  const [onAir, setOnAir] = useState(true);

  useEffect(() => {
    socket.emit("enter_room", broadcaster, (ok: boolean) => {
      if (ok) {
        setOnAir(true);
      }
    });
  }, []);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {/* TODO: get a video */}
      <h1>{onAir ? "열려있는 방송" : "꺼져있는 방송"}</h1>
      {onAir && <Chat room={broadcaster} />}
    </div>
  );
}
