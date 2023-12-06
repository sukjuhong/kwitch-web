"use client";

import { SocketContext } from "@/lib/socket";
import { useRef } from "react";
import { Socket, io } from "socket.io-client";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socketRef = useRef<Socket>(io());

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
