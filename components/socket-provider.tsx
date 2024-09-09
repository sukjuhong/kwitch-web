"use client";

import { useAuth } from "@/lib/auth";
import { API_URL } from "@/utils/env";
import { createContext, useContext, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

import { types as mediasoupTypes } from "mediasoup-client";
import { isFailedSocketResponse, type SocketResponse } from "@/types/socket";

const SocketContext = createContext<Socket | undefined>(undefined);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const socketRef = useRef<Socket>(
    io(API_URL, {
      path: "/socket.io/",
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket"],
    })
  );

  useEffect(() => {
    if (user) {
      socketRef.current.connect();
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

const producerOptions = {
  encodings: [
    {
      rid: "r0",
      maxBitrate: 100000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r1",
      maxBitrate: 300000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r2",
      maxBitrate: 900000,
      scalabilityMode: "S1T3",
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

const useSocket = () => {
  const socket = useContext(SocketContext);

  const device = useRef<mediasoupTypes.Device>();
  const rtpCapabilities = useRef<mediasoupTypes.RtpCapabilities>();
  const producerTransport = useRef<mediasoupTypes.Transport>();
  const consumerTransport = useRef<mediasoupTypes.Transport>();
  const producer = useRef<mediasoupTypes.Producer>();
  const consumer = useRef<mediasoupTypes.Consumer>();

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  const getDevice = async () => {
    try {
      device.current = new mediasoupTypes.Device();
      rtpCapabilities.current = await _getRtpCapabilities();
      await device.current.load({
        routerRtpCapabilities: rtpCapabilities.current,
      });
      console.log("RTP Capabilities: ", device.current.rtpCapabilities);
    } catch (err) {
      console.error(err);
    }
  };

  const _getRtpCapabilities: () => Promise<mediasoupTypes.RtpCapabilities> =
    () => {
      return new Promise((resolve, reject) => {
        socket.emit("getRtpCapabilities", (res: SocketResponse) => {
          if (isFailedSocketResponse(res)) {
            reject(res.error);
          } else {
            resolve(res.content);
          }
        });
      });
    };

  const createProducerTransport = () => {
    socket.emit(
      "createWebRtcTransport",
      { sender: true },
      (res: SocketResponse) => {
        if (isFailedSocketResponse(res)) {
          console.error(res.error);
          return;
        }

        const transportOptions = res.content;
        console.log("Transport Options: ", transportOptions);

        if (!device.current) {
          console.error("No device");
          return;
        }

        producerTransport.current =
          device.current.createSendTransport(transportOptions);
        if (!producerTransport.current) {
          console.error("No producer transport");
          return;
        }

        console.log("Producer Transport ID: ", producerTransport.current.id);

        producerTransport.current.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              console.log("dtlsParameters: ", dtlsParameters);
              socket.emit("transport-connect", { dtlsParameters });
              callback();
            } catch (err: any) {
              errback(err);
            }
          }
        );

        producerTransport.current.on(
          "produce",
          async (parameters, callback, errback) => {
            try {
              socket.emit(
                "transport-produce",
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id }: { id: string }) => {
                  callback({ id });
                }
              );
            } catch (err: any) {
              errback(err);
            }
          }
        );
      }
    );
  };

  const connectProducerTransport = async (stream: MediaStream) => {
    if (!producerTransport.current) {
      console.error("No producer transport");
      return;
    }

    producer.current = await producerTransport.current.produce({
      track: stream.getVideoTracks()[0],
      ...producerOptions,
    });

    console.log("producer ID: ", producer.current.id);

    producer.current.on("transportclose", () => {
      console.log("Producer Transport Closed");
    });

    producer.current.on("trackended", () => {
      console.log("Producer Track Ended");
    });
  };

  const createConsumerTransport = () => {
    socket.emit(
      "createWebRtcTransport",
      { sender: false },
      (res: SocketResponse) => {
        if (isFailedSocketResponse(res)) {
          console.error(res.error);
          return;
        }

        console.log(res);

        const transportOptions = res.content;
        console.log("consumer transport options: ", transportOptions);

        consumerTransport.current =
          device.current?.createRecvTransport(transportOptions);
        if (!consumerTransport.current) {
          console.error("No consumer transport");
          return;
        }

        consumerTransport.current.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              socket.emit("transport-recv-connect", { dtlsParameters });
              callback();
            } catch (err: any) {
              errback(err);
            }
          }
        );
      }
    );
  };

  const connectConsumerTransport = (remoteVideo: any) => {
    socket.emit(
      "consume",
      { rtpCapabilities: device.current?.rtpCapabilities },
      async ({ params }: { params: any }) => {
        if (params.error) {
          console.error(params.error);
          return;
        }
        console.log(params);

        if (!consumerTransport.current) {
          console.error("No consumer transport");
          return;
        }

        consumer.current = await consumerTransport.current.consume(params);

        const { track } = consumer.current;
        remoteVideo.srcObject = new MediaStream([track]);
        socket.emit("consumer-resume");
      }
    );
  };

  return {
    socket,
    getDevice,
    createProducerTransport,
    connectProducerTransport,
    createConsumerTransport,
    connectConsumerTransport,
  };
};

export { SocketProvider, useSocket };
