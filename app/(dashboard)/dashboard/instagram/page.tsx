"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { InstagramPostCard } from "./instagram-post-card";

export default function InstagramPage() {
  const posts = useQuery(api.posts.listByPlatform, { platform: "instagram" });
  const generateImage = useMutation(api.posts.generatePostImage);

  const handleGenerateImage = async (postId: string) => {
    await generateImage({ postId: postId as Parameters<typeof generateImage>[0]["postId"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instagram</h1>
        <p className="text-muted-foreground">
          Generate and manage your Instagram captions with AI-generated images
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <InstagramPostCard
              key={post._id}
              postId={post._id}
              content={post.content}
              timestamp={post.timestamp}
              imageId={post.imageId}
              onGenerateImage={handleGenerateImage}
            />
          ))
        )}
      </div>
    </div>
  );
}
