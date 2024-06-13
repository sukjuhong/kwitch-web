import Link from "next/link";

import { Button } from "../../components/ui/button";

export default function CreateChannelButton() {
  return (
    <Button asChild>
      <Link href="/broadcast">New Channel</Link>
    </Button>
  );
}
