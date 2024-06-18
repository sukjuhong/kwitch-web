"use client";

import { useContext, useEffect, useState } from "react";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import ChannelNavItem from "./channel-nav-item";
import type { Channel } from "@/types";
import { useSocket } from "../../app/components/socket-provider";

export default function ChannelNav() {
  const socket = useSocket();

  const [foldNav, setFoldNav] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const res = await fetch("/api/channels");
      if (res.ok) {
        const data = await res.json();
        setChannels(data);
      }
    };
    fetchChannels();

    socket.on("channels:update", (channel: Channel) => {
      // TODO: efficient update
      fetchChannels();
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
          key={channel.broadcaster.username}
          channel={channel}
          foldNav={foldNav}
        />
      ))}
    </div>
  );
}
