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
    broadcastor: "한동숙",
    title: "키미가시네 2장",
    viewers: 11696,
    thumbnail:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/c5a2baa2-74ed-4b72-b047-8326572c9bfa-profile_image-70x70.png",
  },
  {
    broadcastor: "우왁굳",
    title: "마크 조공 있다고 함 9시",
    viewers: 16947,
    thumbnail:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/fa7d6582-6635-410f-8691-9e1d4d55411f-profile_image-70x70.png",
  },
  {
    broadcastor: "풍월량",
    title: "부동산 시뮬레이터",
    viewers: 17320,
    thumbnail:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/7d354ef2-b2a8-4276-8c12-5be7f6301ae0-profile_image-70x70.png",
  },
  {
    broadcastor: "탬탬버린",
    title: "알아 1114 ٩(●'▿'●)۶ *",
    viewers: 12083,
    thumbnail:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/b260e1c2-ad39-47bc-95ed-b7a2c7d6cd4f-profile_image-70x70.png",
  },
];

function ChannelNavItem({ broadcast }: { broadcast: Broadcast }) {
  return (
    <div>
      <Link href={`/broadcast/${broadcast.broadcastor}`} prefetch={false}>
        <div className="flex p-3 items-center xl:border-b">
          <Avatar className="xl:mr-3 border-2 border-red-500">
            <AvatarImage src={broadcast.thumbnail} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="hidden xl:block">
            <p className="font-bold text-lg">{broadcast.title}</p>
            <p className="font-thin text-sm mb-1">{broadcast.broadcastor}</p>
            <p className="flex items-center">
              <EyeIcon className="w-4 h-4 text-gray-500 mr-1" />
              {broadcast.viewers}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ChannelNav() {
  broadcastDummyData.sort((a, b) => b.viewers - a.viewers);

  return (
    <div className="border-r">
      <h1 className="hidden xl:block font-bold p-3">Current Channel List</h1>
      {broadcastDummyData.map((broadcast) => (
        <ChannelNavItem broadcast={broadcast} />
      ))}
    </div>
  );
}
