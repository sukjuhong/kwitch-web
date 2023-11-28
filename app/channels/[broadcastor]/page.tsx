"use client";

import Chat from "@/components/channels/chat";
import {
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect } from "react";
import { Socket, io } from "socket.io-client";

export default function ChannelPage({
  params,
}: {
  params: { broadcastor: string };
}) {
  let { broadcastor } = params;
  broadcastor = decodeURI(broadcastor);

  const socket = io({ autoConnect: false });
  const [closeChat, setCloseChat] = React.useState(false);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
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
        <h1>방송공간</h1>
      </div>
      <div
        className={`w-80 border-l flex flex-col ${closeChat ? "hidden" : ""}`}
      >
        <Chat
          socket={socket}
          room={broadcastor}
          closeChat={closeChat}
          setCloseChat={setCloseChat}
        />
      </div>
    </>
  );
}
