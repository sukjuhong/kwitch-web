import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center p-5 text-center">
      <h1 className="text-4xl font-bold trackinng-tight sm:text-6xl">
        Broadcast with Modern Web Browser.
      </h1>
      <p className="mt-4 text-lg text-gray-500">
        Kwitch is a broadcasting platform that allows anyone to broadcast
        easily.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/channel">Go to Channel List</Link>
      </Button>

      <img
        src="https://www.gstatic.com/devrel-devsite/prod/v032f5e834ea07ceb506abc7629b7ff47ac48c72d9122b91b2cecfd4022841b1c/webrtc/images/lockup.svg"
        alt="WebRTC"
        className="mt-8 w-96 dark:invert"
      />
    </main>
  );
}
