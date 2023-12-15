"use client";

import { useEffect, useState } from "react";

import Chat from "@/components/channels/chat";
import VideoPlayer from "@/components/channels/video-player";
import { useSocket } from "@/lib/socket";

export default function ChannelPage({
  params,
}: {
  params: { broadcaster: string };
}) {
  let { broadcaster } = params;
  broadcaster = decodeURI(broadcaster);

  const { socket } = useSocket();

  const [onAir, setOnAir] = useState(false);

  // TODO: handle when broadcaster turn on the stream after broadcaster turn off the stream

  useEffect(() => {
    socket.emit("enter_room", broadcaster, (ok: boolean) => {
      if (ok) {
        setOnAir(true);
      }
    });

    return () => {
      socket.emit("leave_room", broadcaster);
    };
  }, []);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <VideoPlayer roomName={broadcaster} />
      {onAir && <Chat broadcaster={broadcaster} />}
    </div>
  );
}
