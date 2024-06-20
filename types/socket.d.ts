import type { Socket } from "socket.io-client";
import type { Channel } from ".";

export interface SocketResponse {
  success: boolean;
  message: string;
}
