"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { agents, agentIds, type AgentId } from "@/lib/agents/config";
import { Badge } from "@/components/ui/badge";

interface AgentPickerProps {
  selectedAgents: AgentId[] | null;
  onSelectionChange: (agents: AgentId[] | null) => void;
}

export function AgentPicker({
  selectedAgents,
  onSelectionChange,
}: AgentPickerProps) {
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

  const getLabel = () => {
    if (isAllSelected) return "All Agents";
    if (selectedAgents.length === 1) return agents[selectedAgents[0]].name;
    return `${selectedAgents.length} Agents`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className="h-8 gap-2 px-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 rounded-full border border-transparent hover:border-border transition-all"
        >
          {isAllSelected ? (
            <Users className="w-3.5 h-3.5" />
          ) : (
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
              {selectedAgents.length}
            </span>
          )}
          {getLabel()}
          <ChevronsUpDown className="ml-auto h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[220px] p-2" align="start">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            onSelectionChange(null);
          }}
        >
          <div
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
              isAllSelected
                ? "bg-primary text-primary-foreground"
                : "opacity-50 [&_svg]:invisible"
            )}
          >
            <Check className={cn("h-3 w-3")} />
          </div>
          <span>All Agents</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {agentIds.map((agentId) => {
          const agent = agents[agentId];
          const isSelected = isAllSelected || selectedAgents?.includes(agentId);

          return (
            <DropdownMenuItem
              key={agentId}
              className="flex items-center gap-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                toggleAgent(agentId);
              }}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                )}
              >
                <Check className={cn("h-3 w-3")} />
              </div>
              <span className="mr-auto">{agent.name}</span>
              <Badge variant="outline" className="text-[10px] h-5 px-1">
                {agent.platform}
              </Badge>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
