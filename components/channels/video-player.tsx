"use client";

import React, { useEffect, useRef } from "react";
import { useSocket } from "../../app/components/socket-provider";

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

    socket.on("p2p:offer", (offer: RTCSessionDescription) => {
      peerConnection.ontrack = (event) => {
        videoRef.current!.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("p2p:ice", broadcaster, event.candidate);
        }
      };

      peerConnection
        .setRemoteDescription(offer)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit(
            "p2p:answer",
            broadcaster,
            peerConnection.localDescription
          );
        });
    });

    socket.on("p2p:ice", (socketId: string, candidate: RTCIceCandidate) => {
      peerConnection.addIceCandidate(candidate);
    });

    return () => {
      socket.off("p2p:offer");
      socket.off("p2p:ice");
      peerConnection.close();
    };
  }, []);

  // TODO: video overflow
  return <video className="h-full bg-black" ref={videoRef} autoPlay />;
}
