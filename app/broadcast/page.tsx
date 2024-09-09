"use client";

import { useEffect, useRef, useState } from "react";

import Chat from "@/components/channels/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { SignalIcon } from "@heroicons/react/20/solid";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useSocket } from "@/components/socket-provider";
import assert from "assert";

export default function Broadcast() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    socket,
    getDevice,
    createProducerTransport,
    connectProducerTransport,
  } = useSocket();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [title, setTitle] = useState("");
  const [warning, setWarning] = useState("");
  const [onAir, setOnAir] = useState(false);

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        },
      });

      assert(videoRef.current, "Video element is not defined");
      videoRef.current.srcObject = stream;
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDevice();
  }, []);

  // useEffect(() => {
  //   if (!onAir || !user) return;

  //   const peerConnections = conn.current;

  //   return () => {
  //     socket.off("p2p:joined");
  //     socket.off("p2p:left");
  //     socket.off("p2p:offer");
  //     socket.off("p2p:answer");
  //     socket.off("p2p:ice");

  //     if (streamRef.current) {
  //       streamRef.current.getTracks().forEach((track) => track.stop());
  //     }
  //     for (const socketId in peerConnections) {
  //       peerConnections[socketId].close();
  //       delete peerConnections[socketId];
  //     }

  //     socket.emit("broadcasts:end", (res: SocketResponse) => {
  //       if (res.success) {
  //         toast({
  //           title: "Broadcast ended",
  //           description: "Your broadcast has been ended automatically.",
  //         });
  //         return;
  //       }
  //     });
  //   };
  // }, [user, onAir]);

  // function startBroadcast() {
  //   if (!title || onAir) return;

  //   conn.current = new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: "stun:stun.l.google.com:19302",
  //       },
  //     ],
  //   });

  //   socket.emit("broadcasts:start", title, (res: SocketResponse) => {
  //     if (res.success) {
  //       setWarning("");
  //       setOnAir(true);
  //       return;
  //     }
  //     setWarning(res.message);
  //   });
  // }

  // async function getScreen() {
  //   assert(user, "User is not defined");

  //   if (streamRef.current) {
  //     streamRef.current.getTracks().forEach((track) => track.stop());
  //   }

  //   const stream = await navigator.mediaDevices.getDisplayMedia({
  //     video: true,
  //     audio: true,
  //   });

  //   videoRef.current!.srcObject = stream;
  //   streamRef.current = stream;

  //   for (const socketId in peerConnectionsRef.current) {
  //     const peerConnection = peerConnectionsRef.current[socketId];

  //     stream.getTracks().forEach((track) => {
  //       peerConnection.addTrack(track, stream);
  //     });

  //     peerConnection
  //       .createOffer()
  //       .then((offer) => peerConnection.setLocalDescription(offer))
  //       .then(() => {
  //         socket.emit(
  //           "p2p:offer",
  //           user.channelId,
  //           peerConnection.localDescription
  //         );
  //       });
  //   }
  // }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 flex relative">
      <div className="container max-w-7xl py-8 overflow-y-auto scroll">
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
          <Button disabled={onAir} className="mr-3">
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
            <span>{warning}</span>
          </div>
        )}
        {!onAir && (
          <>
            <div className="w-1/2 bg-yellow-600 text-white opacity-80 rounded-xl p-5 mb-5">
              <AlertTriangle className="w-6 h-6 inline-block mr-3"></AlertTriangle>
              <span>
                If this page is turned off, the broadcast will also be turned
                off.
              </span>
            </div>
            <Button onClick={getLocalStream} className="mb-5">
              Screen
            </Button>
            <Button onClick={createProducerTransport} className="mb-5">
              Create Consumer Transport
            </Button>
            <Button
              onClick={() => {
                if (videoRef.current) {
                  connectProducerTransport(
                    videoRef.current.srcObject as MediaStream
                  );
                }
              }}
              className="mb-5"
            >
              Connect Consumer Transport
            </Button>
            <div className="flex items-center gap-x-4 mb-5">
              <p className="text-sm font-medium">Video</p>
            </div>
            <video
              className="w-[600px] h-[400px] bg-black border"
              autoPlay
              playsInline
              muted
              ref={videoRef}
            />
          </>
        )}
      </div>
      {onAir && <Chat channelId={user!.channelId} />}
    </div>
  );
}
