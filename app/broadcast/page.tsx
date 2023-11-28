"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { socket } from "@/lib/socket";
import { useState } from "react";

export default function Broadcast() {
  const [title, setTitle] = useState("");

  const handleClick = () => {
    socket.emit("create_room", title);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold">Broadcasting</h1>
      <div className="flex items-center my-5">
        <Label htmlFor="title" className="mr-4">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-64"
        />
      </div>
      <Button onClick={handleClick}>Start</Button>
    </div>
  );
}
