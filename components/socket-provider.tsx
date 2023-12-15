"use client";

import { SocketContext } from "@/lib/socket";
import { Socket, io } from "socket.io-client";

const socket = io();

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
