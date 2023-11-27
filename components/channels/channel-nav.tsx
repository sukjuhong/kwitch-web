"use client";

import React from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/20/solid";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export type Broadcast = {
  broadcastor: string;
  title: string;
  viewers: number;
  thumbnail: string;
};

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

function ChannelNavItem({
  broadcast,
  foldNav,
}: {
  broadcast: Broadcast;
  foldNav: boolean;
}) {
  return (
    <div>
      <Link href={`/channels/${broadcast.broadcastor}`} prefetch={false}>
        <div className="flex p-3 items-center xl:border-b">
          <Avatar className="border-2 border-red-500 w-8 h-8">
            <AvatarImage src={broadcast.thumbnail} />
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
          {!foldNav && (
            <div className="flex-1 hidden xl:block pl-3">
              <div className="flex justify-between gap-x-5">
                <p className="font-bold text-md">{broadcast.title}</p>
                <div className="flex items-center">
                  <EyeIcon className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm">{broadcast.viewers}</span>
                </div>
              </div>
              <span>{broadcast.broadcastor}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function ChannelNav({
  foldNav,
  setFoldNav,
}: {
  foldNav: boolean;
  setFoldNav: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  broadcastDummyData.sort((a, b) => b.viewers - a.viewers);

  return (
    <div
      className={`border-r bg-gray-100 dark:bg-gray-900 ${
        foldNav ? "" : "xl:w-80"
      } flex flex-col`}
    >
      {foldNav && (
        <ArrowRightCircleIcon
          className="w-8 h-8 m-3 cursor-pointer hidden xl:block"
          onClick={() => setFoldNav(false)}
        />
      )}
      <div
        className={`hidden ${
          foldNav ? "" : "xl:flex"
        } justify-between items-center p-3`}
      >
        <p className="font-bold">Current Channel List</p>
        <ArrowLeftCircleIcon
          className="w-6 h-6 cursor-pointer"
          onClick={() => setFoldNav(true)}
        />
      </div>
      {broadcastDummyData.map((broadcast) => (
        <ChannelNavItem
          key={broadcast.broadcastor}
          broadcast={broadcast}
          foldNav={foldNav}
        />
      ))}
    </div>
  );
}
