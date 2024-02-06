export interface User {
  username: string;
  avatar?: string;
}

export interface Channel {
  broadcaster: string;
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
