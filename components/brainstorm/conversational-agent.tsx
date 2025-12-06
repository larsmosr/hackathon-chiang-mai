"use client";

import { useState, useCallback, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff, Sparkles, Loader2 } from "lucide-react";
import { AgentPicker } from "./agent-picker";
import { type AgentId } from "@/lib/agents/config";

interface ConversationalAgentProps {
  onConversationEnd: (transcript: string) => void;
  convexUrl: string;
}

type ConversationStatus = "idle" | "connecting" | "connected" | "disconnected";

export function ConversationalAgent({
  onConversationEnd,
  convexUrl,
}: ConversationalAgentProps) {
  const [status, setStatus] = useState<ConversationStatus>("idle");
  const [transcript, setTranscript] = useState<Array<{ role: "user" | "agent"; text: string }>>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<AgentId[] | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setStatus("connected");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      setStatus("disconnected");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      setStatus("disconnected");
    },
  });

  // Track conversation transcript
  useEffect(() => {
    if (conversation.isSpeaking) {
      // Agent is speaking
    }
  }, [conversation.isSpeaking]);

  const startConversation = useCallback(async () => {
    setStatus("connecting");
    setTranscript([]);
    
    try {
      const url = `${convexUrl}/elevenlabs-signed-url`;
      console.log("Fetching signed URL from:", url);
      
      // Get signed URL from Convex HTTP endpoint
      const response = await fetch(url);
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to get signed URL: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Got data:", data);
      
      if (!data.signed_url) {
        throw new Error("No signed URL in response");
      }

      // Start the conversation with the signed URL
      await conversation.startSession({
        signedUrl: data.signed_url,
      });
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setStatus("idle");
    }
  }, [convexUrl, conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
    setStatus("disconnected");
    
    // Build transcript string from conversation
    const transcriptText = transcript
      .map((t) => `${t.role === "user" ? "User" : "Agent"}: ${t.text}`)
      .join("\n\n");
    
    onConversationEnd(transcriptText);
  }, [conversation, transcript, onConversationEnd]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      conversation.setVolume({ volume: 1 });
    } else {
      conversation.setVolume({ volume: 0 });
    }
    setIsMuted(!isMuted);
  }, [conversation, isMuted]);

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      {/* Status Display */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 mb-4 shadow-lg relative">
          {isConnected && (
            <>
              <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
              <span className="absolute inset-2 rounded-full bg-green-500/10 animate-pulse" />
            </>
          )}
          <Sparkles className={cn(
            "w-12 h-12 transition-colors",
            isConnected ? "text-green-500" : "text-violet-600"
          )} />
        </div>
        
        <h2 className="text-2xl font-bold">
          {status === "idle" && "Ready to Brainstorm"}
          {status === "connecting" && "Connecting..."}
          {status === "connected" && "Brainstorming..."}
          {status === "disconnected" && "Session Ended"}
        </h2>
        
        <p className="text-muted-foreground">
          {status === "idle" && "Start a voice conversation to explore your ideas"}
          {status === "connecting" && "Setting up your brainstorm session"}
          {status === "connected" && "Speak naturally - I'm listening"}
          {status === "disconnected" && "Ready to generate your posts"}
        </p>
      </div>

      {/* Voice Activity Indicator */}
      {isConnected && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full transition-colors",
              conversation.isSpeaking ? "bg-violet-500 animate-pulse" : "bg-muted"
            )} />
            <span className="text-sm text-muted-foreground">
              {conversation.isSpeaking ? "Agent speaking..." : "Listening..."}
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        {status === "idle" && (
          <>
            <Button
              onClick={startConversation}
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <Phone className="w-5 h-5" />
              Start Brainstorming
            </Button>
            <AgentPicker
              selectedAgents={selectedAgents}
              onSelectionChange={setSelectedAgents}
            />
          </>
        )}

        {isConnecting && (
          <Button disabled size="lg" className="gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting...
          </Button>
        )}

        {isConnected && (
          <>
            <Button
              onClick={toggleMute}
              variant="outline"
              size="lg"
              className={cn(
                "gap-2",
                isMuted && "bg-red-500/10 border-red-500/50 text-red-500"
              )}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>

            <Button
              onClick={endConversation}
              variant="destructive"
              size="lg"
              className="gap-2"
            >
              <PhoneOff className="w-5 h-5" />
              End & Generate Posts
            </Button>
          </>
        )}

        {status === "disconnected" && (
          <Button
            onClick={startConversation}
            size="lg"
            className="gap-2"
          >
            <Phone className="w-5 h-5" />
            Start New Session
          </Button>
        )}
      </div>

      {/* Instructions */}
      {status === "idle" && (
        <div className="max-w-md text-center text-sm text-muted-foreground space-y-2">
          <p>🎙️ Have a natural conversation about what you&apos;re working on</p>
          <p>💡 The AI will help you explore and refine your ideas</p>
          <p>📝 When done, click &quot;End &amp; Generate Posts&quot; to create content</p>
        </div>
      )}
    </div>
  );
}

