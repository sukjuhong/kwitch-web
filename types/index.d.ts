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
