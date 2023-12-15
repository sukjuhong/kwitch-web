"use client";

import React, { useEffect, useState } from "react";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";

import type { Message } from "./message-box";
import MessageBox from "./message-box";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useSocket } from "@/lib/socket";
import { useAuth } from "@/lib/auth";

export default function Chat({ broadcaster }: { broadcaster: string }) {
  const { user } = useAuth();
  const socket = useSocket();

  // TODO: restrict amount of messages
  const [messages, setMessages] = useState<Message[]>([
    { username: "admin", msg: "Welcome to the chat!", isAlert: true },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [closeChat, setCloseChat] = useState(false);

  useEffect(() => {
    socket.on("welcome", (_: string, username: string) => {
      setMessages((prev) => [
        ...prev,
        {
          username: "admin",
          msg: `${username} joined the chat!`,
          isAlert: true,
        },
      ]);
    });

    socket.on("bye", (_: string, username: string) => {
      setMessages((prev) => [
        ...prev,
        {
          username: "admin",
          msg: `${username} left the chat!`,
          isAlert: true,
        },
      ]);
    });

    socket.on(
      "new_message",
      (msg: string, userid: string, username: string) => {
        setMessages((prev) => [
          ...prev,
          { username, msg, isBroadcaster: broadcaster === userid },
        ]);
      }
    );

    return () => {
      socket.off("welcome");
      socket.off("bye");
      socket.off("new_message");
    };
  }, []);

  function submitMessage() {
    if (!currentMessage) {
      return;
    }
    socket.emit("send_message", currentMessage, broadcaster, () => {
      setMessages((prev) => [
        ...prev,
        {
          username: user!.username,
          msg: currentMessage,
          isBroadcaster: broadcaster === String(user!.id),
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
      e.preventDefault();
      submitMessage();
    }
  }

  return (
    <div
      className={
        "absolute h-full border-l w-80 flex flex-col transition-all duration-500 bg-gray-100 dark:bg-gray-900 " +
        (closeChat ? "-right-80" : "right-0")
      }
    >
      <Bars3BottomLeftIcon
        className={
          "w-6 h-6 absolute top-3 cursor-pointer transition-all duration-500 " +
          (closeChat ? "-left-8" : "left-2")
        }
        onClick={() => setCloseChat(!closeChat)}
      />
      <h1 className="text-lg text-center border-b py-2">Chat</h1>
      <div className="flex-1 flex flex-col-reverse p-3 scrollbar-thin scrollbar-thumb-kookmin scrollbar-track-white h-32 overflow-y-auto">
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
    </div>
  );
}
