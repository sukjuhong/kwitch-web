"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import ChannelNavItem from "./channel-nav-item";
import { useSocket } from "@/lib/socket";

export declare type Channel = {
  broadcaster: string;
  title: string;
  viewers: number;
  thumbnail?: string;
};

export default function ChannelNav() {
  const { socket } = useSocket();

  const [foldNav, setFoldNav] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    async function getChannels() {
      const res = await fetch("/api/room/list");

      if (res.ok) {
        const { roomlist } = await res.json();
        setChannels(
          roomlist.map((room: any) => ({
            broadcaster: room.name,
            title: room.title,
            viewers: room.users,
          }))
        );
      }
    }
    getChannels();

    socket.on("room_change", () => {
      getChannels();
    });
  }, []);

  return (
    <div
      className={`border-r bg-gray-200 dark:bg-gray-900 min-w-[56px] ${
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
          key={channel.broadcaster}
          channel={channel}
          foldNav={foldNav}
        />
      ))}
    </div>
  );
}
