"use client";

import React, { useEffect, useRef } from "react";
import { useSocket } from "@/lib/socket";

export default function VideoPlayer({ roomName }: { roomName: string }) {
  const { socket } = useSocket();

  const peerConnectionRef = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    socket.on("offer", async (_: string, offer: RTCSessionDescription) => {
      peerConnectionRef.current
        .setRemoteDescription(offer)
        .then(() => peerConnectionRef.current.createAnswer())
        .then((sdp) => peerConnectionRef.current.setLocalDescription(sdp))
        .then(() => {
          socket.emit(
            "answer",
            peerConnectionRef.current.localDescription,
            roomName
          );
        });

      peerConnectionRef.current.ontrack = (event) => {
        videoRef.current!.srcObject = event.streams[0];
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice", event.candidate, roomName);
        }
      };
    });

    socket.on("ice", async (_: string, candidate: RTCIceCandidate) => {
      await peerConnectionRef.current.addIceCandidate(candidate);
    });

    return () => {
      // TODO: leave room
      peerConnectionRef.current.close();
      socket.off("offer");
      socket.off("ice");
    };
  }, []);

  // TODO: video overflow
  return <video className="h-full bg-black" ref={videoRef} autoPlay />;
}
