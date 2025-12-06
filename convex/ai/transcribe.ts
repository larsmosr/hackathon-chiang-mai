"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";

// Transcribe audio using ElevenLabs Speech-to-Text API
export const transcribeAudio = action({
  args: {
    audioStorageId: v.id("_storage"),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error("ELEVENLABS_API_KEY not configured");
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    console.log("=== transcribeAudio called ===");
    console.log("Storage ID:", args.audioStorageId);

    // Get the audio file from storage
    const audioUrl = await ctx.storage.getUrl(args.audioStorageId);
    if (!audioUrl) {
      console.error("Audio file not found for storage ID:", args.audioStorageId);
      throw new Error("Audio file not found");
    }

    console.log("Got audio URL:", audioUrl.substring(0, 50) + "...");

    // Fetch the audio file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      console.error("Failed to fetch audio file:", audioResponse.status);
      throw new Error("Failed to fetch audio file");
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: "audio/webm" });
    console.log("Audio blob size:", audioBlob.size);

    // Create form data for ElevenLabs API
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model_id", "scribe_v1");

    console.log("Calling ElevenLabs API...");

    // Call ElevenLabs Speech-to-Text API
    const response = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text",
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      throw new Error(`Transcription failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("ElevenLabs result:", JSON.stringify(result).substring(0, 200));

    if (!result.text) {
      console.error("No transcription text returned");
      throw new Error("No transcription returned");
    }

    console.log("Transcription successful:", result.text.substring(0, 100));
    return result.text;
  },
});
