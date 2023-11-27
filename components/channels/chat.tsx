"use client";

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSession } from "@/hooks/useSession";
import { set } from "zod";
import { Textarea } from "../ui/textarea";

type Message = {
  username: string;
  msg: string;
  isAdmin: boolean;
};

function MessageBox({ message }: { message: Message }) {
  return (
    <div className="rounded-md my-1 px-1">
      <span>{message.isAdmin ? "" : `${message.username}: `}</span>
      <span className={message.isAdmin ? "text-gray-500" : ""}>
        {message.msg}
      </span>
    </div>
  );
}

export default function Chat({
  socket,
  room,
}: {
  socket: Socket;
  room: string;
}) {
  // TODO: restrict amount of messages

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { session } = useSession();

  useEffect(() => {
    socket.emit("enter_room", room, () => {
      setMessages((prev) => [
        ...prev,
        {
          username: "admin",
          msg: "Welcome to the chat!",
          isAdmin: true,
        },
      ]);
    });

    socket.on("welcome", (userId) => {
      setMessages((prev) => [
        ...prev,
        {
          username: "admin",
          msg: `${userId} joined the chat!`,
          isAdmin: true,
        },
      ]);
    });

    socket.on("new_message", (msg, userId) => {
      setMessages((prev) => [
        ...prev,
        { username: userId, msg, isAdmin: false },
      ]);
    });

    return () => {
      socket.emit("disconnecting");
      socket.off("welcome");
      socket.off("new_message");
    };
  }, []);

  function submitMessage() {
    socket.emit("send_message", currentMessage, room, () => {
      setMessages((prev) => [
        ...prev,
        {
          username: session!.user.username,
          msg: currentMessage,
          isAdmin: false,
        },
      ]);
    });
    setCurrentMessage("");
  }

  function handleOnKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }
      submitMessage();
    }
  }

  return (
    <>
      <h1 className="text-lg text-center border-b py-2">STREAM CHAT</h1>
      <div className="flex-1 flex flex-col-reverse p-3">
        <div>
          {messages.map((message, index) => (
            <MessageBox key={index} message={message} />
          ))}
        </div>
      </div>
      <div className="flex flex-col p-3">
        <Label htmlFor="msg" />
        <div className="grid w-full gap-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleOnKeyDown}
            className="min-h-0 resize-none"
            placeholder="Type your message here"
            id="msg"
          />
          <Button
            size="sm"
            className="bg-kookmin dark:text-white"
            onClick={submitMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
