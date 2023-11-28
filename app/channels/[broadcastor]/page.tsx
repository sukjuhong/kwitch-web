"use client";

import Chat from "@/components/channels/chat";
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import React, { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function ChannelPage({
  params,
}: {
  params: { broadcastor: string };
}) {
  let { broadcastor } = params;
  broadcastor = decodeURI(broadcastor);

  const [onAir, setOnAir] = React.useState(true);
  const [closeChat, setCloseChat] = React.useState(false);

  useEffect(() => {
    socket.on("no_room", () => {
      // TODO: channel is not on air. handle this
      setOnAir(false);
    });

    socket.emit("enter_room", broadcastor);
  }, []);

  return (
    <>
      <div className="flex-1 relative">
        {closeChat && (
          <div className="absolute top-3 right-3">
            <Bars3BottomRightIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => setCloseChat(false)}
            />
          </div>
        )}
        <h1>{onAir ? "열려있는 방송" : "꺼져있는 방송"}</h1>
      </div>
      <div
        className={`w-80 border-l flex flex-col ${
          closeChat || !onAir ? "hidden" : ""
        }`}
      >
        <Chat room={broadcastor} setCloseChat={setCloseChat} />
      </div>
    </>
  );
}
