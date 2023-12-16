"use client";

import { useEffect, useState } from "react";

import Chat from "@/components/channels/chat";
import VideoPlayer from "@/components/channels/video-player";
import { useSocket } from "@/lib/socket";
import { useToast } from "@/components/ui/use-toast";
import { SignalSlashIcon } from "@heroicons/react/24/solid";

export default function ChannelPage({
  params,
}: {
  params: { broadcaster: string };
}) {
  let { broadcaster } = params;
  broadcaster = decodeURI(broadcaster);

  const socket = useSocket();
  const { toast } = useToast();

  const [onAir, setOnAir] = useState(false);

  // TODO: handle when broadcaster turn on the stream after broadcaster turn off the stream

  useEffect(() => {
    socket.emit("enter_room", broadcaster, (ok: boolean) => {
      if (ok) {
        setOnAir(true);
      }
    });

    socket.on("on_destroy_room", () => {
      toast({
        title: "The broadcaster closed the channel.",
        variant: "destructive",
      });
      setOnAir(false);
    });

    return () => {
      socket.emit("leave_room", broadcaster);
    };
  }, []);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {onAir ? (
        <>
          <VideoPlayer roomid={broadcaster} />
          <Chat roomid={broadcaster} />
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center">
          <SignalSlashIcon className="w-20 h-20" />
          <h1 className="text-lg text-gray-500">Channel is offline.</h1>
        </div>
      )}
    </div>
  );
}
