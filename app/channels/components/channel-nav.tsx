"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import ChannelNavItem from "./channel-nav-item";
import type { Broadcast, Channel, LiveChannel } from "@/types";
import { api } from "@/lib/axios";

export default function ChannelNav() {
  const [foldNav, setFoldNav] = useState(false);
  const [liveChannels, setLiveChannels] = useState<LiveChannel[]>([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const res = await api.get("/api/channels/live");
      const { data: liveChannelData } = await res.data;

      console.log("liveChannelData: ", liveChannelData);
      setLiveChannels(liveChannelData);

      setTimeout(() => fetchChannels(), 10000);
    };

    fetchChannels();
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
        <p className="font-bold">Online channel list</p>
        <ArrowLeftCircleIcon
          className="w-6 h-6 cursor-pointer"
          onClick={() => setFoldNav(true)}
        />
      </div>
      {liveChannels.map((liveChannel) => (
        <ChannelNavItem
          key={liveChannel.channel.id}
          liveChannel={liveChannel}
          foldNav={foldNav}
        />
      ))}
    </div>
  );
}
