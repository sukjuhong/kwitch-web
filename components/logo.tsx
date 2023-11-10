import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href={"/"}>
      <div className="text-xl font-bold">Kwitch</div>
    </Link>
  );
}
