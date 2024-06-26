"use client";

import { useAuth } from "@/lib/auth";
import { createContext, useContext, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { API_URL } from "@/config/env";

const SocketContext = createContext<Socket | undefined>(undefined);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const socketRef = useRef<Socket>(
    io(API_URL, {
      path: "/socket.io/",
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket"],
    })
  );

  useEffect(() => {
    if (user) {
      socketRef.current.connect();
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return socket;
};

export { SocketProvider, useSocket };
