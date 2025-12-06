import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const platformValidator = v.union(
  v.literal("x"),
  v.literal("threads"),
  v.literal("linkedin"),
  v.literal("instagram"),
  v.literal("bluesky")
);

export default defineSchema({
  posts: defineTable({
    platform: platformValidator,
    content: v.string(),
    timestamp: v.string(),
  }).index("by_platform", ["platform"]),
});

