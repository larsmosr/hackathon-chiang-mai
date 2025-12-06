"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostCard } from "@/components/shared/post-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function XPage() {
  const posts = useQuery(api.posts.listByPlatform, { platform: "x" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">X Posts</h1>
        <p className="text-muted-foreground">
          Generate and manage your X (Twitter) content
        </p>
      </div>
      <div className="grid gap-4">
        {posts === undefined ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No posts yet. Run the seed function to add sample posts.
          </p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} content={post.content} timestamp={post.timestamp} />
          ))
        )}
      </div>
    </div>
  );
}
