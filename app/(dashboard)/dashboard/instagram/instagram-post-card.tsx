"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Check, Copy, Send, ImageIcon, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import confetti from "canvas-confetti";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface InstagramPostCardProps {
  postId: Id<"posts">;
  content: string;
  timestamp?: string;
  imageId?: Id<"_storage">;
  onGenerateImage: (postId: string) => Promise<void>;
}

function triggerConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#E1306C", "#F77737", "#FCAF45", "#833AB4", "#C13584"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#E1306C", "#F77737", "#FCAF45", "#833AB4", "#C13584"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export function InstagramPostCard({
  postId,
  content,
  timestamp,
  imageId,
  onGenerateImage,
}: InstagramPostCardProps) {
  const [copied, setCopied] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const imageUrl = useQuery(
    api.posts.getImageUrl,
    imageId ? { imageId } : "skip"
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePost = useCallback(() => {
    setShowCelebration(true);
  }, []);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      await onGenerateImage(postId);
      toast.success("Image generation started! It may take a few seconds.");
    } catch {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (showCelebration) {
      triggerConfetti();
    }
  }, [showCelebration]);

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow overflow-hidden">
        {imageUrl && (
          <div className="relative aspect-square max-h-80 overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt="Generated post image"
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
              {timestamp && (
                <p className="text-xs text-muted-foreground">{timestamp}</p>
              )}
            </div>
            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {!imageId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  title="Generate AI image"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handlePost}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="text-6xl mb-4">🎉</div>
            <DialogTitle className="text-2xl">Congratulations!</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Your Instagram post is ready to go live! Share your journey with
              the world.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowCelebration(false)}
            className="mt-4 w-full"
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

