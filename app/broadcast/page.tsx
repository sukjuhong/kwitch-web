"use client";

import { useContext, useEffect, useRef, useState } from "react";

import Chat from "@/components/channels/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { SignalIcon } from "@heroicons/react/20/solid";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { SocketResponse } from "@/types/socket";
import { useSocket } from "@/components/socket-provider";

export default function Broadcast() {
  const { user } = useAuth();
  const { toast } = useToast();
  const socket = useSocket();

  if (!user) {
    throw new Error("User is not defined");
  }

  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [title, setTitle] = useState("");
  const [warning, setWarning] = useState("");
  const [onAir, setOnAir] = useState(false);

  useEffect(() => {
    if (!onAir) return;

    const peerConnections = peerConnectionsRef.current;

    socket.on("p2p:joined", (socketId: string) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnections[socketId] = peerConnection;

      if (streamRef.current) {
        const stream = streamRef.current;
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      }
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("p2p:ice", user.username, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit(
            "p2p:offer",
            user.username,
            peerConnection.localDescription
          );
        });
    });

    socket.on("p2p:left", (socketId: string) => {
      peerConnections[socketId].close();
      delete peerConnections[socketId];
    });

    socket.on(
      "p2p:answer",
      (socketId: string, answer: RTCSessionDescription) => {
        peerConnections[socketId].setRemoteDescription(answer);
      }
    );

    socket.on("p2p:ice", (socketId: string, candidate: RTCIceCandidate) => {
      peerConnections[socketId].addIceCandidate(candidate);
    });

    return () => {
      socket.off("p2p:joined");
      socket.off("p2p:left");
      socket.off("p2p:offer");
      socket.off("p2p:answer");
      socket.off("p2p:ice");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      for (const socketId in peerConnections) {
        peerConnections[socketId].close();
        delete peerConnections[socketId];
      }

      socket.emit("channels:delete", (res: SocketResponse) => {
        if (res.success) {
          toast({
            title: "Broadcast ended",
            description: "Your broadcast has been ended automatically.",
          });
          return;
        }
      });
    };
  }, [onAir]);

  function startBroadcast() {
    if (!title || onAir) return;

    socket.emit("channels:create", title, (res: SocketResponse) => {
      if (res.success) {
        setWarning("");
        setOnAir(true);
        return;
      }
      setWarning(res.message);
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
          socket.emit(
            "p2p:offer",
            user!.username,
            peerConnection.localDescription
          );
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
            <span>{warning}</span>
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
      {onAir && <Chat broadcaster={user.username} />}
    </div>
  );
}
