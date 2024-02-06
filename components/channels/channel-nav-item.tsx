"use client";

import Link from "next/link";
import { EyeIcon } from "@heroicons/react/20/solid";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Channel } from "@/types";

export default function ChannelNavItem({
  channel,
  foldNav,
}: {
  channel: Channel;
  foldNav: boolean;
}) {
  return (
    <div>
      <Link href={`/channels/${channel.broadcaster}`} prefetch={false}>
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
              <span className="text-sm text-gray-500">
                {channel.broadcaster}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
