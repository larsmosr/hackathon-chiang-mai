"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type RecordingState = "idle" | "requesting" | "recording" | "processing";

interface UseVoiceRecorderOptions {
  onRecordingComplete?: (audioBlob: Blob, durationMs: number) => void;
  onError?: (error: Error) => void;
  maxDurationMs?: number;
}

interface UseVoiceRecorderReturn {
  state: RecordingState;
  isRecording: boolean;
  durationMs: number;
  formattedDuration: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  error: Error | null;
}

export function useVoiceRecorder(
  options: UseVoiceRecorderOptions = {}
): UseVoiceRecorderReturn {
  const {
    onRecordingComplete,
    onError,
    maxDurationMs = 5 * 60 * 1000, // 5 minutes max
  } = options;

  const [state, setState] = useState<RecordingState>("idle");
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Use a ref to track if recording was cancelled - this avoids stale closure issues
  const isCancelledRef = useRef<boolean>(false);
  // Store callbacks in refs to avoid stale closures
  const onRecordingCompleteRef = useRef(onRecordingComplete);
  const onErrorRef = useRef(onError);

  // Keep refs up to date
  useEffect(() => {
    onRecordingCompleteRef.current = onRecordingComplete;
  }, [onRecordingComplete]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setState("requesting");
    isCancelledRef.current = false;

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Create MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalDuration = Date.now() - startTimeRef.current;
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Use the ref to check cancellation state - avoids stale closure
        if (audioBlob.size > 0 && !isCancelledRef.current) {
          console.log("Recording complete, calling onRecordingComplete with blob size:", audioBlob.size);
          onRecordingCompleteRef.current?.(audioBlob, finalDuration);
        } else {
          console.log("Recording skipped - cancelled:", isCancelledRef.current, "blob size:", audioBlob.size);
        }

        cleanup();
        setState("idle");
        setDurationMs(0);
      };

      mediaRecorder.onerror = () => {
        const err = new Error("Recording failed");
        setError(err);
        onErrorRef.current?.(err);
        cleanup();
        setState("idle");
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      startTimeRef.current = Date.now();
      setState("recording");
      console.log("Recording started with mimeType:", mimeType);

      // Update duration every 100ms
      timerRef.current = setInterval(() => {
        setDurationMs(Date.now() - startTimeRef.current);
      }, 100);

      // Auto-stop at max duration
      maxTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, maxDurationMs);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to access microphone");
      setError(error);
      onErrorRef.current?.(error);
      cleanup();
      setState("idle");
    }
  }, [maxDurationMs, cleanup]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      setState("processing");
      mediaRecorderRef.current.stop();
    }
  }, []);

  const cancelRecording = useCallback(() => {
    // Set cancelled flag BEFORE stopping - this ensures the onstop handler knows it was cancelled
    isCancelledRef.current = true;
    console.log("Recording cancelled");
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
    cleanup();
    setState("idle");
    setDurationMs(0);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Format duration as mm:ss
  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    state,
    isRecording: state === "recording",
    durationMs,
    formattedDuration: formatDuration(durationMs),
    startRecording,
    stopRecording,
    cancelRecording,
    error,
  };
}

