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
  const { toast } = useToast();
  const socket = useSocket();

  if (!user) {
    throw new Error("User is not defined");
  }

  const roomid = user.id;

  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [title, setTitle] = useState("");
  const [warning, setWarning] = useState(false);
  const [onAir, setOnAir] = useState(false);

  useEffect(() => {
    const peerConnections = peerConnectionsRef.current;

    socket.on("welcome", (socketId: string) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnections[socketId] = peerConnection;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          peerConnection.addTrack(track, streamRef.current!);
        });
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice", event.candidate, roomid);
        }
      };

      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit("offer", peerConnection.localDescription, roomid);
        });
    });

    socket.on("bye", (socketId: string) => {
      peerConnections[socketId].close();
      delete peerConnections[socketId];
    });

    socket.on("answer", (socketId: string, answer: RTCSessionDescription) => {
      peerConnections[socketId].setRemoteDescription(answer);
    });

    socket.on("ice", (socketId: string, candidate: RTCIceCandidate) => {
      peerConnections[socketId].addIceCandidate(candidate);
    });

    return () => {
      socket.off("welcome");
      socket.off("bye");
      socket.off("ice");
      socket.off("answer");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      for (const socketId in peerConnections) {
        peerConnections[socketId].close();
        delete peerConnections[socketId];
      }

      socket.emit("close", roomid);

      socket.emit("destroy_room", roomid, (ok: boolean, _: string) => {
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

    socket.emit("create_room", roomid, title, (ok: boolean, result: string) => {
      if (ok) {
        setWarning(false);
        setOnAir(true);
      } else setWarning(true);
    });
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
          socket.emit("offer", peerConnection.localDescription, roomid);
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
          <Button onClick={startBroadcast} disabled={onAir} className="mr-3">
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
            <span>You can&apos;t turn on more than one broadcast.</span>
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
      {onAir && <Chat roomid={roomid} />}
    </div>
  );
}
