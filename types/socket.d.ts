import type { Socket } from "socket.io-client";
import type { Channel } from ".";

export interface ServerToClientEvents {
  "channel:read-all": (channels: Channel[]) => void;
}

export interface ClientToServerEvents {}

export interface SocketResponse {
  success: boolean;
  message: string;
}
