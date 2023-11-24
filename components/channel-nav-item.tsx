import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Broadcast } from "@/components/channel-nav";
import { EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function ChannelNavItem({
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
          <div className={`hidden ${foldNav ? "" : "xl:block"} pl-3`}>
            <p className="font-bold text-md">{broadcast.title}</p>
            <p className="font-thin text-sm mb-1">{broadcast.broadcastor}</p>
            <p className="flex items-center text-sm">
              <EyeIcon className="w-4 h-4 text-gray-500 mr-1" />
              {broadcast.viewers}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
