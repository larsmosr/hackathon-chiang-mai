"use client";

import { cn } from "@/lib/utils";
import { agents, type AgentId } from "@/lib/agents/config";
import { AgentAvatar, UserAvatar } from "./agent-avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";

type MessageRole = "user" | AgentId;

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  status?: "generating" | "complete" | "error";
  timestamp?: number;
  className?: string;
}

export function ChatMessage({
  role,
  content,
  status,
  timestamp,
  className,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";
  const agent = !isUser ? agents[role as AgentId] : null;

  const copyToClipboard = async () => {
    // Extract just the suggested post content if available
    const postMatch = content.match(
      /\*\*Suggested (?:Post|Caption):\*\*\n?([\s\S]*?)(?:\n\n📸|\n\n#|$)/
    );
    const textToCopy = postMatch ? postMatch[1].trim() : content;

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-2xl transition-all",
        isUser
          ? "bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20"
          : "bg-card border border-border",
        className
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <UserAvatar size="md" />
        ) : (
          <AgentAvatar agentId={role as AgentId} size="md" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm">
            {isUser ? "You" : agent?.name}
          </span>
          {agent && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: `${agent.gradientFrom || agent.color}20`,
                color: agent.gradientFrom || agent.color,
              }}
            >
              {agent.platform}
            </span>
          )}
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Message Content */}
        {status === "generating" ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: agent?.gradientFrom || agent?.color,
                  animationDelay: "0ms",
                }}
              />
              <span
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: agent?.gradientFrom || agent?.color,
                  animationDelay: "150ms",
                }}
              />
              <span
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: agent?.gradientFrom || agent?.color,
                  animationDelay: "300ms",
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {agent?.name} is thinking...
            </span>
          </div>
        ) : status === "error" ? (
          <div className="text-sm text-destructive">{content}</div>
        ) : (
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            <MessageContent content={content} />
          </div>
        )}

        {/* Actions */}
        {!isUser && status === "complete" && content && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 text-xs gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Post
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component to render formatted message content
function MessageContent({ content }: { content: string }) {
  // Split content into parts: regular text and suggested posts
  const parts = content.split(/(\*\*Suggested (?:Post|Caption):\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**Suggested")) {
          return (
            <span key={index} className="font-semibold text-primary block mt-3">
              {part.replace(/\*\*/g, "")}
            </span>
          );
        }
        if (part.includes("**Visual Suggestion:**")) {
          const [postContent, visualPart] = part.split("**Visual Suggestion:**");
          return (
            <span key={index}>
              <span className="block bg-muted/50 rounded-lg p-3 mt-1 border-l-2 border-primary">
                {postContent.trim()}
              </span>
              {visualPart && (
                <>
                  <span className="font-semibold text-primary block mt-3">
                    Visual Suggestion:
                  </span>
                  <span className="text-muted-foreground italic">
                    {visualPart.trim()}
                  </span>
                </>
              )}
            </span>
          );
        }
        // Check if this looks like a post (after the "Suggested Post:" header)
        if (
          index > 0 &&
          parts[index - 1]?.startsWith("**Suggested") &&
          part.trim()
        ) {
          return (
            <span
              key={index}
              className="block bg-muted/50 rounded-lg p-3 mt-1 border-l-2 border-primary"
            >
              {part.trim()}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

// Typing indicator component
export function TypingIndicator({
  agentIds,
  className,
}: {
  agentIds: AgentId[];
  className?: string;
}) {
  if (agentIds.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2 p-3", className)}>
      <div className="flex -space-x-2">
        {agentIds.slice(0, 4).map((agentId) => (
          <AgentAvatar key={agentId} agentId={agentId} size="sm" />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {agentIds.length === 1
          ? `${agents[agentIds[0]].name} is typing...`
          : `${agentIds.length} agents are typing...`}
      </span>
    </div>
  );
}

