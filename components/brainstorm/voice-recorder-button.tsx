"use client";

import { cn } from "@/lib/utils";
import { Mic, Square, Loader2 } from "lucide-react";
import type { RecordingState } from "@/hooks/use-voice-recorder";

interface VoiceRecorderButtonProps {
  state: RecordingState;
  formattedDuration: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceRecorderButton({
  state,
  formattedDuration,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  disabled = false,
  className,
}: VoiceRecorderButtonProps) {
  const isIdle = state === "idle";
  const isRecording = state === "recording";
  const isProcessing = state === "processing" || state === "requesting";

  const handleClick = () => {
    if (isIdle) {
      onStartRecording();
    } else if (isRecording) {
      onStopRecording();
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Main Record Button */}
      <button
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
          "focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-background",
          isIdle && [
            "bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
            "hover:scale-105 active:scale-95",
            "focus:ring-red-500/50",
          ],
          isRecording && [
            "bg-gradient-to-br from-red-600 to-rose-700 scale-110",
            "animate-pulse focus:ring-red-500/50",
          ],
          isProcessing && [
            "bg-gradient-to-br from-amber-500 to-orange-600",
            "cursor-wait focus:ring-amber-500/50",
          ],
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Ripple effect when recording */}
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
            <span
              className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}

        {/* Icon */}
        <span className="relative z-10">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : isRecording ? (
            <Square className="w-8 h-8 text-white fill-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </span>
      </button>

      {/* Duration / Status */}
      <div className="text-center">
        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-lg font-mono font-semibold text-red-500">
              {formattedDuration}
            </span>
          </div>
        )}
        {isProcessing && (
          <span className="text-sm text-muted-foreground">Processing...</span>
        )}
        {isIdle && (
          <span className="text-sm text-muted-foreground">
            Tap to record
          </span>
        )}
      </div>

      {/* Cancel button when recording */}
      {isRecording && (
        <button
          onClick={onCancelRecording}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

// Compact inline version
export function VoiceRecorderButtonCompact({
  state,
  formattedDuration,
  onStartRecording,
  onStopRecording,
  disabled = false,
  className,
}: Omit<VoiceRecorderButtonProps, "onCancelRecording">) {
  const isIdle = state === "idle";
  const isRecording = state === "recording";
  const isProcessing = state === "processing" || state === "requesting";

  const handleClick = () => {
    if (isIdle) {
      onStartRecording();
    } else if (isRecording) {
      onStopRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={cn(
        "relative flex items-center justify-center transition-all duration-200 shrink-0",
        "focus:outline-none",
        // Idle State - Minimal Ghost Button
        isIdle && [
          "w-10 h-10 rounded-full",
          "text-muted-foreground hover:text-primary hover:bg-muted/50",
        ],
        // Recording State - Pulse Red
        isRecording && [
          "w-10 h-10 rounded-full bg-red-500/10 text-red-500",
          "ring-2 ring-red-500/20 ring-offset-2 ring-offset-background",
        ],
        // Processing State - Pulse Amber
        isProcessing && [
          "w-10 h-10 rounded-full bg-amber-500/10 text-amber-500",
          "cursor-wait",
        ],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      title={
        isIdle ? "Start recording" : isRecording ? "Stop recording" : "Processing"
      }
    >
      {/* Icon */}
      <span className="relative z-10">
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </span>

      {/* Duration badge when recording */}
      {isRecording && (
        <span className="absolute -top-2 right-0 bg-red-500 text-white text-[9px] font-mono px-1 py-0.5 rounded-full shadow-sm">
          {formattedDuration}
        </span>
      )}
    </button>
  );
}

