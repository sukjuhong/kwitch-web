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
  title: string;
  roomName: string;
  ownerId: number;
  viewers: number;
}

export interface Message {
  username: string;
  message: string;
  isAlert?: boolean;
  isBroadcaster?: boolean;
}
