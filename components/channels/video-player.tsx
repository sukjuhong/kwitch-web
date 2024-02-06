"use client";

import React, { useEffect, useRef } from "react";
import { useSocket } from "../socket-provider";

/**
 * @param broadcaster broadcaster's username
 */
export default function VideoPlayer({ broadcaster }: { broadcaster: string }) {
  const socket = useSocket();

  const peerConnectionRef = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const peerConnection = peerConnectionRef.current;

    socket.on("p2p:offer", async (offer: RTCSessionDescription) => {
      await peerConnection.setRemoteDescription(offer);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("p2p:answer", broadcaster, peerConnection.localDescription);

      peerConnection.ontrack = (event) => {
        videoRef.current!.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("p2p:ice", broadcaster, event.candidate);
        }
      };
    });

    socket.on(
      "p2p:ice",
      async (socketId: string, candidate: RTCIceCandidate) => {
        await peerConnection.addIceCandidate(candidate);
      }
    );

    return () => {
      peerConnection.close();
      socket.off("p2p:offer");
      socket.off("p2p:ice");
    };
  }, []);

  // TODO: video overflow
  return <video className="h-full bg-black" ref={videoRef} autoPlay />;
}
