"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { type AgentId } from "@/lib/agents/config";
import { ChatMessage } from "./chat-message";
import { MessageInput } from "./message-input";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles, Zap, PenTool, Share2 } from "lucide-react";

interface BrainstormRoomProps {
  initialTranscript?: string | null;
}

export function BrainstormRoom({ initialTranscript }: BrainstormRoomProps = {}) {
  const [sessionId, setSessionId] = useState<Id<"brainstormSessions"> | null>(
    null
  );
  const [selectedAgents, setSelectedAgents] = useState<AgentId[] | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [hasUsedInitialTranscript, setHasUsedInitialTranscript] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const currentSession = useQuery(api.brainstorm.getCurrentSession);
  const messages = useQuery(
    api.brainstorm.getSessionMessages,
    sessionId ? { sessionId } : "skip"
  );

  // Mutations
  const createSession = useMutation(api.brainstorm.createSession);
  const sendMessage = useMutation(api.brainstorm.sendMessage);
  const clearSession = useMutation(api.brainstorm.clearSession);
  const generateUploadUrl = useMutation(api.brainstorm.generateUploadUrl);

  // Actions
  const transcribeAudio = useAction(api.ai.transcribe.transcribeAudio);

  // Initialize session
  useEffect(() => {
    if (currentSession) {
      setSessionId(currentSession._id);
    } else if (currentSession === null) {
      // No session exists, create one
      createSession({}).then((id) => setSessionId(id));
    }
  }, [currentSession, createSession]);

  // Auto-send initial transcript from conversational AI
  useEffect(() => {
    if (initialTranscript && sessionId && !hasUsedInitialTranscript) {
      setHasUsedInitialTranscript(true);
      // Auto-send the conversation transcript to generate posts
      const message = `Based on this brainstorming conversation, please generate social media posts:\n\n${initialTranscript}`;
      handleSendMessage(message);
    }
  }, [initialTranscript, sessionId, hasUsedInitialTranscript]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (content: string, audioBlob?: Blob) => {
      console.log("handleSendMessage called", { content, hasAudioBlob: !!audioBlob, sessionId });
      
      if (!sessionId) {
        console.error("No session ID!");
        return;
      }

      let transcript = content;
      let audioStorageId: Id<"_storage"> | undefined;

      // If audio blob provided, upload and transcribe
      if (audioBlob) {
        console.log("Processing audio blob:", audioBlob.size, audioBlob.type);
        setIsTranscribing(true);
        try {
          // Upload audio to Convex storage
          console.log("Getting upload URL...");
          const uploadUrl = await generateUploadUrl();
          console.log("Upload URL obtained, uploading...");
          
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": audioBlob.type },
            body: audioBlob,
          });

          if (!uploadResponse.ok) {
            console.error("Upload failed:", uploadResponse.status);
            throw new Error("Failed to upload audio");
          }

          const result = await uploadResponse.json();
          console.log("Upload result:", result);
          const { storageId } = result;
          audioStorageId = storageId;

          // Transcribe the audio
          console.log("Starting transcription for:", storageId);
          transcript = await transcribeAudio({ audioStorageId: storageId });
          console.log("Transcription result:", transcript);
        } catch (error) {
          console.error("Transcription error:", error);
          // Fallback message if transcription fails
          transcript =
            "[Audio message - transcription failed. Please try again or type your message.]";
        } finally {
          setIsTranscribing(false);
        }
      }

      if (!transcript.trim()) {
        console.log("Empty transcript, not sending");
        return;
      }

      // Send the message
      console.log("Sending message:", { sessionId, content: transcript, selectedAgents });
      try {
        const messageId = await sendMessage({
          sessionId,
          content: transcript,
          audioStorageId,
          targetAgents: selectedAgents || undefined,
        });
        console.log("Message sent, ID:", messageId);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [
      sessionId,
      selectedAgents,
      generateUploadUrl,
      transcribeAudio,
      sendMessage,
    ]
  );

  // Handle clearing the session
  const handleClearSession = useCallback(async () => {
    if (!sessionId) return;
    await clearSession({ sessionId });
  }, [sessionId, clearSession]);

  const hasMessages = messages && messages.length > 0;

  // Suggestion cards for the hero view
  const suggestions = [
    {
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      title: "Brainstorm ideas",
      desc: "Turn loose thoughts into concrete plans",
      agents: null, // All agents
    },
    {
      icon: <PenTool className="w-4 h-4 text-violet-500" />,
      title: "Draft a post",
      desc: "Create content for X or LinkedIn",
      agents: ["chirp", "lindy"] as AgentId[],
    },
    {
      icon: <Share2 className="w-4 h-4 text-blue-500" />,
      title: "Product Update",
      desc: "Share what you just shipped",
      agents: ["chirp", "skylar"] as AgentId[],
    },
  ];

  return (
    <div className="relative flex flex-col h-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-end">
        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSession}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear Session
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!hasMessages ? (
          // Hero / Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-2xl space-y-8 text-center">
              {/* Greeting */}
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 mb-4 shadow-sm">
                  <Sparkles className="w-8 h-8 text-violet-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  What are you working on?
                </h1>
                <p className="text-lg text-muted-foreground">
                  Voice dump your thoughts. We&apos;ll turn them into content.
                </p>
              </div>

              {/* Centered Input */}
              <div className="w-full max-w-xl mx-auto py-4">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  selectedAgents={selectedAgents}
                  onAgentSelectionChange={setSelectedAgents}
                  isTranscribing={isTranscribing}
                  className="shadow-xl"
                  autoFocus={true}
                />
              </div>

              {/* Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                {suggestions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                        setSelectedAgents(item.agents);
                        // Ideally this would focus the input or start recording
                        const textarea = document.querySelector("textarea");
                        if(textarea) textarea.focus();
                    }}
                    className="flex flex-col items-start p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-md transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-background transition-colors mb-3">
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm text-foreground">
                      {item.title}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Chat View
          <div className="flex flex-col h-full">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
               {/* Top spacer */}
               <div className="h-4" />
               
              {messages.map((message) => (
                <div key={message._id} className="max-w-3xl mx-auto w-full">
                    <ChatMessage
                    role={message.role}
                    content={message.content}
                    status={message.status}
                    timestamp={message.createdAt}
                    />
                </div>
              ))}
              
              {/* Bottom spacer for scrolling */}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Fixed Input Area */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background/90 to-transparent z-20">
              <div className="max-w-3xl mx-auto">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  selectedAgents={selectedAgents}
                  onAgentSelectionChange={setSelectedAgents}
                  isTranscribing={isTranscribing}
                  className="shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
