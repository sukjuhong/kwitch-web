"use client";

import { EyeIcon } from "@heroicons/react/20/solid";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Channel } from "@/types";
import { useRouter } from "next/navigation";

export default function ChannelNavItem({
  channel,
  foldNav,
}: {
  channel: Channel;
  foldNav: boolean;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/channels/${channel.broadcaster.username}`)}
    >
      <div className="flex p-3 items-center xl:border-b">
        <Avatar className="border-2 border-red-500 w-8 h-8">
          <AvatarImage src={channel.thumbnail} />
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
        {!foldNav && (
          <div className="flex-1 hidden xl:block pl-3">
            <div className="flex justify-between gap-x-5">
              <p className="font-bold text-md">{channel.title}</p>
              <div className="flex items-center">
                <EyeIcon className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm">{channel.viewers}</span>
              </div>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500">
                {channel.broadcaster.username}
              </span>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
