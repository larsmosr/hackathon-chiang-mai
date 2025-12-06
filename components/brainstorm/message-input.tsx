"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorderButtonCompact } from "./voice-recorder-button";
import { AgentPicker } from "./agent-picker";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import type { AgentId } from "@/lib/agents/config";

interface MessageInputProps {
  onSendMessage: (message: string, audioBlob?: Blob) => Promise<void>;
  selectedAgents: AgentId[] | null;
  onAgentSelectionChange: (agents: AgentId[] | null) => void;
  isTranscribing?: boolean;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function MessageInput({
  onSendMessage,
  selectedAgents,
  onAgentSelectionChange,
  isTranscribing = false,
  disabled = false,
  className,
  autoFocus = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleRecordingComplete = useCallback(
    async (audioBlob: Blob) => {
      console.log("handleRecordingComplete called with blob:", audioBlob.size, audioBlob.type);
      // Pass audio to parent for transcription
      setIsSending(true);
      try {
        await onSendMessage("", audioBlob);
        console.log("onSendMessage completed successfully");
      } catch (error) {
        console.error("onSendMessage error:", error);
      } finally {
        setIsSending(false);
      }
    },
    [onSendMessage]
  );

  const {
    state: recordingState,
    formattedDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    error: recordingError,
  } = useVoiceRecorder({
    onRecordingComplete: handleRecordingComplete,
  });

  const handleSubmit = async () => {
    if (!message.trim() || disabled || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto resize
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const isRecording = recordingState === "recording";
  const isProcessing =
    recordingState === "processing" ||
    recordingState === "requesting" ||
    isTranscribing ||
    isSending; // Include isSending to show loading state while processing voice
  const canSend = message.trim() && !disabled && !isSending && !isRecording;

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div
        className={cn(
          "relative flex items-end gap-2 p-2 rounded-[2rem] bg-background/80 backdrop-blur-xl border shadow-lg transition-all duration-300",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
          isRecording && "border-red-500/30 bg-red-500/5 shadow-red-500/10"
        )}
      >
        {/* Voice Recorder - Left aligned */}
        <div className="pb-0.5 pl-1">
            <VoiceRecorderButtonCompact
            state={recordingState}
            formattedDuration={formattedDuration}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            disabled={disabled || isSending}
            />
        </div>

        {/* Text Input Area */}
        <div className="flex-1 min-w-0 py-2.5">
          {isRecording ? (
            <div className="flex items-center justify-between h-[24px] animate-in fade-in duration-200">
              <div className="flex items-center gap-3 px-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-sm font-medium text-red-600">
                  Recording...
                </span>
                <span className="text-sm text-muted-foreground font-mono tabular-nums">
                  {formattedDuration}
                </span>
              </div>
              <button
                onClick={cancelRecording}
                className="text-xs font-medium text-muted-foreground hover:text-destructive px-3 py-1 rounded-full hover:bg-destructive/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : isProcessing ? (
            <div className="flex items-center gap-3 px-2 h-[24px] animate-in fade-in slide-in-from-bottom-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {isTranscribing ? "Transcribing your thoughts..." : isSending ? "Sending to agents..." : "Processing audio..."}
              </span>
            </div>
          ) : (
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type or record your ideas..."
              disabled={disabled || isSending}
              className={cn(
                "min-h-[24px] max-h-[200px] w-full resize-none border-0 bg-transparent p-0 px-2",
                "text-base placeholder:text-muted-foreground/50",
                "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              )}
              rows={1}
            />
          )}
        </div>

        {/* Right Controls */}
        {!isRecording && !isProcessing && (
          <div className="flex items-center gap-2 pb-0.5 pr-1 animate-in fade-in duration-200">
            <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block" />
            
            <AgentPicker
              selectedAgents={selectedAgents}
              onSelectionChange={onAgentSelectionChange}
            />

            <Button
              onClick={handleSubmit}
              disabled={!canSend}
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full shrink-0 transition-all duration-200",
                canSend
                  ? "bg-primary shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-muted text-muted-foreground opacity-50"
              )}
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {recordingError && (
        <div className="absolute -bottom-8 left-0 right-0 text-center animate-in fade-in slide-in-from-top-1">
          <span className="text-xs text-destructive bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
            {recordingError.message}
          </span>
        </div>
      )}
    </div>
  );
}
