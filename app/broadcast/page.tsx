"use client";

import Chat from "@/components/channels/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/useSession";
import { socket } from "@/lib/socket";
import { SignalIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function Broadcast() {
  const { session } = useSession();

  const [title, setTitle] = useState("");
  const [onAir, setOnAir] = useState(false);

  const handleClick = () => {
    socket.emit("create_room", session!.user.username, title);
    setOnAir(true);
  };

  return (
    <div className="flex-1 flex relative">
      <div className="container mx-auto py-5">
        <h1 className="text-4xl font-bold mb-5">Broadcasting</h1>
        <div className="flex items-center mb-5">
          <Label htmlFor="title" className="mr-4">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="flex items-center gap-x-5">
          <Button onClick={handleClick} disabled={onAir}>
            Start
          </Button>
          {onAir && (
            <div className="flex items-center gap-x-3">
              <SignalIcon className="w-4 h-4 text-red-600"></SignalIcon>On Air
              <span className="ml-4"></span>
            </div>
          )}
        </div>
      </div>
      {onAir && <Chat room={session!.user.username} />}
    </div>
  );
}
