"use client";

import { useEffect, useState } from "react";

import Chat from "@/app/channels/[channelId]/components/chat";
import VideoPlayer from "@/app/channels/[channelId]/components/video-player";
import { useToast } from "@/components/ui/use-toast";
import { SignalSlashIcon } from "@heroicons/react/24/solid";
import { useSocket } from "@/app/components/socket-provider";
import { SocketResponse } from "@/types/socket";

export default function ChannelPage({
  params,
}: {
  params: { channelId: string };
}) {
  const { channelId } = params;

  const socket = useSocket();
  const { toast } = useToast();

  const [onAir, setOnAir] = useState<boolean>(false);

  // TODO: handle when broadcaster turn on the stream after broadcaster turn off the stream

  useEffect(() => {
    socket.emit("broadcasts:join", channelId, (res: SocketResponse) => {
      if (res.success) {
        setOnAir(true);
      }
    });

    socket.on("broadcasts:destroy", () => {
      toast({
        title: "The broadcaster closed the channel.",
        variant: "destructive",
      });
      setOnAir(false);
    });
  
    return () => {
      if (!onAir) return;
      socket.emit("broadcasts:leave", channelId, (res: SocketResponse) => {
        if (!res.success) {
          toast({
            title: "Failed to leave the channel.",
            description: "Something is wrong. Refresh the page.",
            variant: "destructive",
          });
        }
      });
  
      socket.off("broadcasts:destroy");
    };
  }, []);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {onAir ? (
        <>
          <VideoPlayer channelId={channelId} />
          <Chat channelId={channelId} />
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
