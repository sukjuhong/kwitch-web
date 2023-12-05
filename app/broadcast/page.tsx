"use client";

import { useSession } from "@/hooks/useSession";
import { socket } from "@/lib/socket";
import { useEffect, useMemo, useRef, useState } from "react";

import Chat from "@/components/channels/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { SignalIcon } from "@heroicons/react/20/solid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function Broadcast() {
  const { session } = useSession();
  const { toast } = useToast();

  const video = useRef<HTMLVideoElement | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const [videoType, setVideoType] = useState("");

  const [title, setTitle] = useState("");
  const [warning, setWarning] = useState(false);
  const [onAir, setOnAir] = useState(false);

  function handleStartBroadcast() {
    if (!title || onAir) return;

    // TODO: check if the broadcast is properly created
    socket.emit("create_room", session!.user.userid, title, (ok: boolean) => {
      if (!ok) {
        setWarning(true);
        return;
      }
      setWarning(false);
      setOnAir(true);
    });
  }

  async function getConnectedDevices(type: MediaDeviceKind) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === type);
  }

  async function getCamera() {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  }

  async function getScreen() {
    return navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
  }

  async function updateScreen() {}

  function stopVideo() {
    if (stream.current === null) return;

    setVideoType("");
    stream.current.getTracks().forEach((track) => track.stop());
    video.current!.srcObject = null;
  }

  async function handleChangeVideo(type: string) {
    setVideoType(type);
    if (type === "camera") {
      const camera = await getCamera();
      stream.current = camera;
      video.current!.srcObject = camera;
    } else if (type === "screen") {
      const screen = await getScreen();
      stream.current = screen;
      video.current!.srcObject = screen;
    }
  }

  useEffect(() => {
    return () => {
      socket.emit("destroy_room", session!.user.userid);
      toast({
        title: "Broadcast is turned off.",
        description:
          "Automatically shut down the broadcast because you left the page.",
      });
    };
  }, []);

  return (
    <div className="flex-1 flex relative overflow-hidden">
      <div className="container max-w-7xl py-8">
        <h1 className="text-4xl font-bold mb-5">Broadcasting</h1>
        <div className="flex items-center gap-x-4 mb-5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={onAir}
            className="w-64"
          />
        </div>
        <div className="flex items-center gap-x-3 mb-5">
          <Button
            onClick={handleStartBroadcast}
            disabled={onAir}
            className="mr-3"
          >
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
          <>
            <div className="w-1/2 bg-yellow-600 text-white opacity-80 rounded-xl p-5 mb-5">
              <AlertTriangle className="w-6 h-6 inline-block mr-3"></AlertTriangle>
              <span>
                If this page is turned off, the broadcast will also be turned
                off.
              </span>
            </div>
            <div className="flex items-center gap-x-4 mb-5">
              <p className="text-sm font-medium">Video</p>
              <Select onValueChange={handleChangeVideo}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Video" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screen">Screen</SelectItem>
                  <SelectItem value="camera">Camera</SelectItem>
                </SelectContent>
              </Select>
              {videoType !== "" && (
                <>
                  {videoType === "screen" && (
                    <Button onClick={() => getCamera()}>Change Screen</Button>
                  )}
                  <Button
                    className="bg-red-600 text-white hover:bg-destructive"
                    onClick={stopVideo}
                  >
                    Stop
                  </Button>
                </>
              )}
            </div>
            <video
              className="w-96 h-64 bg-black border"
              ref={video}
              autoPlay
              playsInline
              muted
            />
          </>
        )}
      </div>
      {onAir && <Chat broadcaster={session!.user.userid} />}
    </div>
  );
}
