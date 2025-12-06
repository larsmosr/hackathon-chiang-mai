import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Agent role validator
const agentRoleValidator = v.union(
  v.literal("chirp"),
  v.literal("lindy"),
  v.literal("pixel"),
  v.literal("skylar")
);

// Message role validator (includes user)
const messageRoleValidator = v.union(
  v.literal("user"),
  v.literal("chirp"),
  v.literal("lindy"),
  v.literal("pixel"),
  v.literal("skylar")
);

// Create a new brainstorm session
export const createSession = mutation({
  args: {
    title: v.optional(v.string()),
  },
  returns: v.id("brainstormSessions"),
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("brainstormSessions", {
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get the current (most recent) session or create one
export const getCurrentSession = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("brainstormSessions"),
      _creationTime: v.number(),
      title: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const session = await ctx.db
      .query("brainstormSessions")
      .order("desc")
      .first();
    return session;
  },
});

// Get all messages in a session
export const getSessionMessages = query({
  args: {
    sessionId: v.id("brainstormSessions"),
  },
  returns: v.array(
    v.object({
      _id: v.id("brainstormMessages"),
      _creationTime: v.number(),
      sessionId: v.id("brainstormSessions"),
      role: messageRoleValidator,
      content: v.string(),
      audioStorageId: v.optional(v.id("_storage")),
      targetAgents: v.optional(v.array(agentRoleValidator)),
      status: v.optional(
        v.union(
          v.literal("generating"),
          v.literal("complete"),
          v.literal("error")
        )
      ),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("brainstormMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
    return messages;
  },
});

// Send a user message and trigger agent responses
export const sendMessage = mutation({
  args: {
    sessionId: v.id("brainstormSessions"),
    content: v.string(),
    audioStorageId: v.optional(v.id("_storage")),
    targetAgents: v.optional(v.array(agentRoleValidator)),
  },
  returns: v.id("brainstormMessages"),
  handler: async (ctx, args) => {
    console.log("=== sendMessage called ===");
    console.log("Session ID:", args.sessionId);
    console.log("Content:", args.content);
    console.log("Audio Storage ID:", args.audioStorageId);
    console.log("Target Agents:", args.targetAgents);

    const now = Date.now();

    // Create user message
    const messageId = await ctx.db.insert("brainstormMessages", {
      sessionId: args.sessionId,
      role: "user",
      content: args.content,
      audioStorageId: args.audioStorageId,
      targetAgents: args.targetAgents,
      createdAt: now,
    });
    console.log("User message created:", messageId);

    // Update session timestamp
    await ctx.db.patch(args.sessionId, { updatedAt: now });

    // Determine which agents should respond
    const agents = args.targetAgents || ["chirp", "lindy", "pixel", "skylar"];
    console.log("Agents that will respond:", agents);

    // Create placeholder messages for each agent (showing "generating" state)
    for (const agent of agents) {
      const agentMsgId = await ctx.db.insert("brainstormMessages", {
        sessionId: args.sessionId,
        role: agent as "chirp" | "lindy" | "pixel" | "skylar",
        content: "",
        status: "generating",
        createdAt: now + 1,
      });
      console.log(`Created placeholder for ${agent}:`, agentMsgId);
    }

    // Schedule AI generation
    console.log("Scheduling AI generation...");
    await ctx.scheduler.runAfter(0, internal.ai.generate.generateResponses, {
      sessionId: args.sessionId,
      userMessage: args.content,
      targetAgents: agents as ("chirp" | "lindy" | "pixel" | "skylar")[],
    });
    console.log("AI generation scheduled");

    return messageId;
  },
});

// Internal mutation to update agent response
export const updateAgentResponse = internalMutation({
  args: {
    sessionId: v.id("brainstormSessions"),
    agent: agentRoleValidator,
    content: v.string(),
    status: v.union(v.literal("complete"), v.literal("error")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find the generating message for this agent
    const messages = await ctx.db
      .query("brainstormMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();

    const agentMessage = messages.find(
      (m) => m.role === args.agent && m.status === "generating"
    );

    if (agentMessage) {
      await ctx.db.patch(agentMessage._id, {
        content: args.content,
        status: args.status,
      });
    }

    return null;
  },
});

// Get upload URL for audio
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save audio file reference
export const saveAudioFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.id("_storage"),
  handler: async (ctx, args) => {
    // Verify the file exists
    const metadata = await ctx.db.system.get(args.storageId);
    if (!metadata) {
      throw new Error("Audio file not found");
    }
    return args.storageId;
  },
});

// Delete a session and all its messages
export const deleteSession = mutation({
  args: {
    sessionId: v.id("brainstormSessions"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Delete all messages in the session
    const messages = await ctx.db
      .query("brainstormMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the session
    await ctx.db.delete(args.sessionId);
    return null;
  },
});

// Clear all messages in a session
export const clearSession = mutation({
  args: {
    sessionId: v.id("brainstormSessions"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("brainstormMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.patch(args.sessionId, { updatedAt: Date.now() });
    return null;
  },
});

