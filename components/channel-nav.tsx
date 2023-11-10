import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/solid";

export interface Broadcast {
  broadcastor: string;
  title: string;
  viewers: number;
  thumbnail: string;
}

const broadcastDummyData: Broadcast[] = [
  {
    broadcastor: "김민수",
    title: "테스트 방송",
    viewers: 12,
    thumbnail: "https://picsum.photos/seed/picsum/200/200",
  },
  {
    broadcastor: "김민수",
    title: "테스트 방송",
    viewers: 12,
    thumbnail: "https://picsum.photos/seed/picsum/200/200",
  },
  {
    broadcastor: "김민수",
    title: "테스트 방송",
    viewers: 12,
    thumbnail: "https://picsum.photos/seed/picsum/200/200",
  },
  {
    broadcastor: "김민수",
    title: "테스트 방송",
    viewers: 12,
    thumbnail: "https://picsum.photos/seed/picsum/200/200",
  },
  {
    broadcastor: "김민수",
    title: "테스트 방송",
    viewers: 12,
    thumbnail: "https://picsum.photos/seed/picsum/200/200",
  },
  {
    broadcastor: "김민수",
    title: "테스트 방송",
    viewers: 12,
    thumbnail: "https://picsum.photos/seed/picsum/200/200",
  },
  {
    broadcastor: "김민수",
    title: "테스트 방송",
    viewers: 12,
    thumbnail: "https://picsum.photos/seed/picsum/200/200",
  },
  {
    broadcastor: "김민수",
    title: "테스트 방송",
    viewers: 12,
    thumbnail: "https://picsum.photos/seed/picsum/200/200",
  },
];

function ChannelNavItem({ broadcast }: { broadcast: Broadcast }) {
  return (
    <div className="w-full">
      <Link href={`/broadcast/${broadcast.broadcastor}`} prefetch={false}>
        <div className="flex p-3 items-center border-b">
          <Avatar className="mr-3">
            <AvatarImage src={broadcast.thumbnail} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1">
            <div className="font-bold text-lg">{broadcast.title}</div>
            <div className="flex items-center">
              <EyeIcon className="w-4 h-4 text-gray-500 mr-1" />
              {broadcast.viewers}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ChannelNav() {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold p-3">현재 방송 목록</h1>
      {broadcastDummyData.map((broadcast) => (
        <ChannelNavItem broadcast={broadcast} />
      ))}
    </div>
  );
}
