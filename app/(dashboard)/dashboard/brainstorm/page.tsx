"use client";

import { useState, useCallback } from "react";
import { BrainstormRoom } from "@/components/brainstorm/brainstorm-room";
import { ConversationalAgent } from "@/components/brainstorm/conversational-agent";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mic } from "lucide-react";

type BrainstormMode = "conversation" | "text";

export default function BrainstormPage() {
  const [mode, setMode] = useState<BrainstormMode>("conversation");
  const [conversationTranscript, setConversationTranscript] = useState<string | null>(null);

  // Get Convex site URL for HTTP endpoints
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(".convex.cloud", ".convex.site") || "";

  const handleConversationEnd = useCallback((transcript: string) => {
    console.log("Conversation ended with transcript:", transcript);
    setConversationTranscript(transcript);
    // Switch to text mode to generate posts
    setMode("text");
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Mode Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full p-1 border shadow-sm">
        <Button
          variant={mode === "conversation" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("conversation")}
          className="rounded-full gap-2"
        >
          <Mic className="w-4 h-4" />
          Voice AI
        </Button>
        <Button
          variant={mode === "text" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("text")}
          className="rounded-full gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Text Chat
        </Button>
      </div>

      {mode === "conversation" ? (
        <div className="h-full flex items-center justify-center">
          <ConversationalAgent
            onConversationEnd={handleConversationEnd}
            convexUrl={convexUrl}
          />
        </div>
      ) : (
        <BrainstormRoom initialTranscript={conversationTranscript} />
      )}
    </div>
  );
}
