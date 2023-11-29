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
    socket.on("no_room", () => {
      setOnAir(false);
    });

    socket.emit("enter_room", broadcaster);
  }, []);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {/* TODO: get a video */}
      <h1>{onAir ? "열려있는 방송" : "꺼져있는 방송"}</h1>
      {onAir && <Chat room={broadcaster} />}
    </div>
  );
}
