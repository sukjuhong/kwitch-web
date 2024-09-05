"use client";

import { EyeIcon } from "@heroicons/react/20/solid";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Broadcast, Channel, LiveChannel } from "@/types";
import { useRouter } from "next/navigation";

export default function ChannelNavItem({
  liveChannel,
  foldNav,
}: {
  liveChannel: LiveChannel;
  foldNav: boolean;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/channels/${liveChannel.channel.id}`)}
    >
      <div className="flex p-3 items-center xl:border-b">
        <Avatar className="border-2 border-red-500 w-8 h-8">
          <AvatarImage src={liveChannel.channel.imageUrl} />
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
        {!foldNav && (
          <div className="flex-1 hidden xl:block pl-3">
            <div className="flex justify-between gap-x-5">
              <div className="flex flex-col items-start">
                <p className="font-bold text-md">{liveChannel.broadcast.title}</p>
                <span className="text-sm text-gray-500">
                  {liveChannel.channel.name}
                </span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm">{liveChannel.viewers}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
