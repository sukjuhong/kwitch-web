"use client";

import { useSession } from "@/hooks/useSession";
import { socket } from "@/lib/socket";
import { useMemo, useState } from "react";

import Chat from "@/components/channels/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { SignalIcon } from "@heroicons/react/20/solid";

export default function Broadcast() {
  const { session } = useSession();

  const broadcaster = useMemo(() => String(session!.user.userid), [session]);

  const [title, setTitle] = useState("");
  const [warning, setWarning] = useState(false);
  const [onAir, setOnAir] = useState(false);

  const handleClick = () => {
    if (!title) return;

    // TODO: check if the broadcast is properly created
    socket.emit("create_room", session!.user.userid, title, (ok: boolean) => {
      console.log(ok);
      if (!ok) {
        setWarning(true);
        return;
      }
      warning && setWarning(false);
      setOnAir(true);
    });
  };

  return (
    <div className="flex-1 flex relative overflow-hidden">
      <div className="container max-w-7xl py-8">
        <h1 className="text-4xl font-bold mb-5">Broadcasting</h1>
        <div className="flex items-center mb-5">
          <Label htmlFor="title" className="mr-4">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={onAir}
            className="w-64"
          />
        </div>
        <div className="flex items-center gap-x-3 mb-5">
          <Button onClick={handleClick} disabled={onAir} className="mr-3">
            Start
          </Button>
          {onAir && (
            <>
              <SignalIcon className="w-4 h-4 inline-block text-red-600"></SignalIcon>
              <span>On Air</span>
            </>
          )}
        </div>
        {!onAir && warning && (
          <div className="w-1/2 bg-red-600 text-white opacity-80 rounded-xl p-5">
            <AlertTriangle className="w-6 h-6 inline-block mr-3"></AlertTriangle>
            <span>You can't turn on more than one broadcast.</span>
          </div>
        )}
        {onAir && (
          <div className="w-1/2 bg-yellow-600 text-white opacity-80 rounded-xl p-5">
            <AlertTriangle className="w-6 h-6 inline-block mr-3"></AlertTriangle>
            <span>
              If this page is turned off, the broadcast will also be turned off.
            </span>
          </div>
        )}
      </div>
      {onAir && <Chat broadcaster={broadcaster} />}
    </div>
  );
}
