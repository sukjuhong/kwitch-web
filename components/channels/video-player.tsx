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

    socket.on("offer", async (offer: RTCSessionDescription) => {
      peerConnection
        .setRemoteDescription(offer)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answer", broadcaster, peerConnection.localDescription);
        });

      peerConnection.ontrack = (event) => {
        videoRef.current!.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice", broadcaster, event.candidate);
        }
      };
    });

    socket.on("ice", async (candidate: RTCIceCandidate) => {
      await peerConnection.addIceCandidate(candidate);
    });

    return () => {
      peerConnection.close();
      socket.off("offer");
      socket.off("ice");
    };
  }, []);

  // TODO: video overflow
  return <video className="h-full bg-black" ref={videoRef} autoPlay />;
}
