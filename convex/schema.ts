import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Platform validator for posts
export const platformValidator = v.union(
  v.literal("x"),
  v.literal("threads"),
  v.literal("linkedin"),
  v.literal("instagram"),
  v.literal("bluesky")
);

// Agent role validator for brainstorm
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

export default defineSchema({
  // Existing posts table
  posts: defineTable({
    platform: platformValidator,
    content: v.string(),
    timestamp: v.string(),
    imageId: v.optional(v.id("_storage")),
  }).index("by_platform", ["platform"]),

  // Brainstorm sessions - each session is like a conversation
  brainstormSessions: defineTable({
    title: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Messages in a brainstorm session
  brainstormMessages: defineTable({
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
  }).index("by_session", ["sessionId"]),

  // Voice entries for storing transcripts
  voiceEntries: defineTable({
    rawTranscript: v.string(),
    durationMs: v.optional(v.number()),
    audioStorageId: v.optional(v.id("_storage")),
    tags: v.optional(v.array(v.string())),
    projectName: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("idea"), v.literal("in_progress"), v.literal("shipped"))
    ),
    createdAt: v.number(),
  }),

  // Generated posts from voice entries
  generatedPosts: defineTable({
    voiceEntryId: v.id("voiceEntries"),
    platform: v.union(
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("instagram"),
      v.literal("bluesky")
    ),
    agentName: agentRoleValidator,
    content: v.string(),
    tone: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_voiceEntry", ["voiceEntryId"])
    .index("by_platform", ["platform"]),
});
