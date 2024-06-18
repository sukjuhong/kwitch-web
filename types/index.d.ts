export interface User {
  id: number;
  username: string;
  avatar?: string;
}

export interface Channel {
  id: number;
  broadcasterId: number;
  broadcaster: User;
  title: string;
  viewers: number;
  thumbnail?: string;
}

export interface Message {
  username: string;
  message: string;
  isAlert?: boolean;
  isBroadcaster?: boolean;
}
