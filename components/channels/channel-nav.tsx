"use client";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import ChannelNavItem from "./channel-nav-item";
import React, { useEffect } from "react";

export declare type Channel = {
  broadcastor: string;
  title: string;
  viewers: number;
  thumbnail?: string;
};

export default function ChannelNav({
  foldNav,
  setFoldNav,
}: {
  foldNav: boolean;
  setFoldNav: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [channels, setChannels] = React.useState<Channel[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    async function getChannels() {
      const res = await fetch("/api/rooms");

      if (res.ok) {
        const { roomlist } = await res.json();
        setChannels(
          roomlist.map((room: any) => ({
            broadcastor: room.name,
            title: "미구현",
            viewers: room.users,
          }))
        );
      }

      timer = setTimeout(getChannels, 1000 * 10);
    }
    getChannels();

    return () => clearTimeout(timer);
  }, []);

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
      {channels.map((channel) => (
        <ChannelNavItem
          key={channel.broadcastor}
          channel={channel}
          foldNav={foldNav}
        />
      ))}
    </div>
  );
}
