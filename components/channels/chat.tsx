"use client";

import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSession } from "@/hooks/useSession";
import { Textarea } from "../ui/textarea";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import { socket } from "@/lib/socket";

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

export default function Chat({ room }: { room: string }) {
  // TODO: restrict amount of messages

  const [messages, setMessages] = useState<Message[]>([
    { username: "admin", msg: "Welcome to the chat!", isAdmin: true },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [closeChat, setCloseChat] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    socket.on("chatting_enter", (username: string) => {
      setMessages((prev) => [
        ...prev,
        {
          username: "admin",
          msg: `${username} joined the chat!`,
          isAdmin: true,
        },
      ]);
    });

    socket.on(
      "new_message",
      (msg: string, userid: string, username: string) => {
        setMessages((prev) => [...prev, { username, msg, isAdmin: false }]);
      }
    );

    return () => {
      socket.off("chatting_enter");
      socket.off("new_message");
    };
  }, []);

  function submitMessage() {
    if (!currentMessage) {
      return;
    }
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
