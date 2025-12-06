"use client";

import { cn } from "@/lib/utils";
import { agents, agentIds, type AgentId } from "@/lib/agents/config";
import { AgentAvatar } from "./agent-avatar";
import { Button } from "@/components/ui/button";

interface AgentSelectorProps {
  selectedAgents: AgentId[] | null; // null means all agents
  onSelectionChange: (agents: AgentId[] | null) => void;
  className?: string;
}

export function AgentSelector({
  selectedAgents,
  onSelectionChange,
  className,
}: AgentSelectorProps) {
  const isAllSelected = selectedAgents === null;

  const toggleAgent = (agentId: AgentId) => {
    if (isAllSelected) {
      // Switching from "all" to single agent
      onSelectionChange([agentId]);
      return;
    }

    const isSelected = selectedAgents.includes(agentId);

    if (isSelected) {
      // Remove agent
      const newSelection = selectedAgents.filter((a) => a !== agentId);
      // If no agents selected, default to all
      onSelectionChange(newSelection.length === 0 ? null : newSelection);
    } else {
      // Add agent
      const newSelection = [...selectedAgents, agentId];
      // If all agents selected, switch to null (all)
      onSelectionChange(
        newSelection.length === agentIds.length ? null : newSelection
      );
    }
  };

  const selectAll = () => {
    onSelectionChange(null);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Talk to
        </span>
        <Button
          variant={isAllSelected ? "default" : "outline"}
          size="sm"
          onClick={selectAll}
          className="h-7 text-xs"
        >
          All Agents
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {agentIds.map((agentId) => {
          const agent = agents[agentId];
          const isSelected = isAllSelected || selectedAgents?.includes(agentId);
          const hasGradient = agent.gradientFrom && agent.gradientTo;

          return (
            <button
              key={agentId}
              onClick={() => toggleAgent(agentId)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all duration-200",
                isSelected
                  ? "border-transparent shadow-md scale-105"
                  : "border-muted bg-background hover:border-muted-foreground/30"
              )}
              style={
                isSelected
                  ? {
                      background: hasGradient
                        ? `linear-gradient(135deg, ${agent.gradientFrom}20, ${agent.gradientTo}20)`
                        : `${agent.color}20`,
                      borderColor: hasGradient ? agent.gradientFrom : agent.color,
                    }
                  : undefined
              }
            >
              <span className="text-lg">{agent.emoji}</span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {agent.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for inline use
export function AgentSelectorCompact({
  selectedAgents,
  onSelectionChange,
  className,
}: AgentSelectorProps) {
  const isAllSelected = selectedAgents === null;

  const toggleAgent = (agentId: AgentId) => {
    if (isAllSelected) {
      onSelectionChange([agentId]);
      return;
    }

    const isSelected = selectedAgents.includes(agentId);
    if (isSelected) {
      const newSelection = selectedAgents.filter((a) => a !== agentId);
      onSelectionChange(newSelection.length === 0 ? null : newSelection);
    } else {
      const newSelection = [...selectedAgents, agentId];
      onSelectionChange(
        newSelection.length === agentIds.length ? null : newSelection
      );
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => onSelectionChange(null)}
        className={cn(
          "px-2 py-1 text-xs rounded-md transition-colors",
          isAllSelected
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        All
      </button>
      {agentIds.map((agentId) => {
        const agent = agents[agentId];
        const isSelected = isAllSelected || selectedAgents?.includes(agentId);

        return (
          <button
            key={agentId}
            onClick={() => toggleAgent(agentId)}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-all",
              isSelected
                ? "ring-2 ring-offset-1 ring-offset-background"
                : "opacity-40 hover:opacity-70"
            )}
            style={
              isSelected
                ? ({ "--tw-ring-color": agent.gradientFrom || agent.color } as React.CSSProperties)
                : undefined
            }
            title={`${agent.name} - ${agent.platform}`}
          >
            <span className="text-sm">{agent.emoji}</span>
          </button>
        );
      })}
    </div>
  );
}

