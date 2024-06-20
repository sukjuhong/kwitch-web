"use client";

import { EyeIcon } from "@heroicons/react/20/solid";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Broadcast, Channel } from "@/types";
import { useRouter } from "next/navigation";

export default function ChannelNavItem({
  broadcast,
  foldNav,
}: {
  broadcast: Broadcast;
  foldNav: boolean;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/channels/${broadcast.roomName}`)}
    >
      <div className="flex p-3 items-center xl:border-b">
        <Avatar className="border-2 border-red-500 w-8 h-8">
          <AvatarImage src={"TODO"} />
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
          </div>
        )}
      </div>
    </button>
  );
}
