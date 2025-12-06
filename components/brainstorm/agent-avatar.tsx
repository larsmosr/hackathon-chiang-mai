"use client";

import { cn } from "@/lib/utils";
import type { AgentId } from "@/lib/agents/config";
import { agents } from "@/lib/agents/config";

interface AgentAvatarProps {
  agentId: AgentId;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export function AgentAvatar({
  agentId,
  size = "md",
  showName = false,
  className,
}: AgentAvatarProps) {
  const agent = agents[agentId];

  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-lg",
    lg: "w-14 h-14 text-2xl",
  };

  const hasGradient = agent.gradientFrom && agent.gradientTo;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105",
          sizeClasses[size]
        )}
        style={{
          background: hasGradient
            ? `linear-gradient(135deg, ${agent.gradientFrom}, ${agent.gradientTo})`
            : agent.color,
        }}
        title={`${agent.name} - ${agent.platform}`}
      >
        <span className="select-none">{agent.emoji}</span>
      </div>
      {showName && (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{agent.name}</span>
          <span className="text-xs text-muted-foreground">{agent.platform}</span>
        </div>
      )}
    </div>
  );
}

// User avatar component
export function UserAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-lg",
    lg: "w-14 h-14 text-2xl",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-md",
        sizeClasses[size],
        className
      )}
    >
      <span className="select-none">👤</span>
    </div>
  );
}

