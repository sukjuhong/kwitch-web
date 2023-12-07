"use client";

import { useEffect, useRef, useState } from "react";

import Chat from "@/components/channels/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { SignalIcon } from "@heroicons/react/20/solid";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/lib/socket";
import { useAuth } from "@/lib/auth";

export default function Broadcast() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();

  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [title, setTitle] = useState("");
  const [warning, setWarning] = useState(false);
  const [onAir, setOnAir] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on("welcome", (socketId: string) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionsRef.current[socketId] = peerConnection;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          peerConnection.addTrack(track, streamRef.current!);
        });
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice", event.candidate, user!.id);
        }
      };

      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit("offer", peerConnection.localDescription, user!.id);
        });
    });

    socket.on("bye", (socketId: string) => {
      peerConnectionsRef.current[socketId].close();
      delete peerConnectionsRef.current[socketId];
    });

    socket.on("answer", (socketId: string, answer: RTCSessionDescription) => {
      peerConnectionsRef.current[socketId].setRemoteDescription(answer);
    });

    socket.on("ice", (socketId: string, candidate: RTCIceCandidate) => {
      peerConnectionsRef.current[socketId].addIceCandidate(candidate);
    });

    return () => {
      socket.off("welcome");
      socket.off("bye");
      socket.off("ice");
      socket.off("answer");

      for (const socketId in peerConnectionsRef.current) {
        peerConnectionsRef.current[socketId].close();
        delete peerConnectionsRef.current[socketId];
      }

      socket.emit("destroy_room", user!.id, (ok: boolean, result: string) => {
        if (ok) {
          toast({
            title: "Broadcast ended",
            description: "Your broadcast has been ended automatically.",
          });
        }
      });
    };
  }, []);

  function startBroadcast() {
    if (!title || onAir) return;

    setIsLoading(true);
    setOnAir(true);
    setWarning(false);
    socket.emit(
      "create_room",
      user!.id,
      title,
      (ok: boolean, result: string) => {
        if (!ok) {
          setWarning(true);
          setOnAir(false);
          return;
        }

        setIsLoading(false);
      }
    );
  }

  async function getScreen() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    videoRef.current!.srcObject = stream;
    streamRef.current = stream;

    for (const socketId in peerConnectionsRef.current) {
      const peerConnection = peerConnectionsRef.current[socketId];

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit("offer", peerConnection.localDescription, user!.id);
        });
    }
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
          <Button
            onClick={startBroadcast}
            disabled={isLoading || onAir}
            className="mr-3"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start"}
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
            <Button onClick={getScreen} className="mb-5">
              Screen
            </Button>
            <div className="flex items-center gap-x-4 mb-5">
              <p className="text-sm font-medium">Video</p>
            </div>
            <video
              className="w-[600px] h-[400px] bg-black border"
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
          </>
        )}
      </div>
      {onAir && <Chat broadcaster={user!.id} />}
    </div>
  );
}
