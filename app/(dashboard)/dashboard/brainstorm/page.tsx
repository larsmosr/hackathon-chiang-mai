"use client";

import { BrainstormRoom } from "@/components/brainstorm/brainstorm-room";

export default function BrainstormPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <BrainstormRoom />
    </div>
  );
}
