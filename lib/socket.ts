import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket;
}

export const SocketContext = createContext<SocketContextValue | undefined>(
  undefined
);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
