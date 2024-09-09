export interface User {
  id: number;
  username: string;
  channelId: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  viewers: number;
}

export interface Broadcast {
  id: string;
  channelId: string;
  status: "LIVE" | "ENDED";
  title: string;
}

export type LiveChannel = {
  channel: Channel;
  broadcast: Broadcast;
  viewers: number;
}

export interface Message {
  username: string;
  message: string;
  isAlert?: boolean;
  isBroadcaster?: boolean;
}
