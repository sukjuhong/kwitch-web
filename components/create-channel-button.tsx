import { Button } from "./ui/button";
import Link from "next/link";

export default function CreateChannelButton() {
  return (
    <Button asChild>
      <Link href="/broadcast">New Channel</Link>
    </Button>
  );
}
