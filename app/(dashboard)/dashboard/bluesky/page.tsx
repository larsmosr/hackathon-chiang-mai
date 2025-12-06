"use client";

import { PostCard } from "@/components/shared/post-card";

const fakePosts = [
  {
    content: `Just deployed a feature using WebSockets instead of polling.

Latency went from 2s to 50ms.

Sometimes the "harder" solution is actually easier once you commit to it.`,
    timestamp: "1 hour ago",
  },
  {
    content: `Hot take: TypeScript's strict mode should be the default.

Yes, it's annoying at first.
Yes, it catches bugs you didn't know you had.
Yes, your future self will thank you.

The type system is a feature, not a tax.`,
    timestamp: "4 hours ago",
  },
  {
    content: `TIL about the Performance API's measure() method.

Been console.log timing things like a caveman for years.

The web platform has so much I still haven't explored.`,
    timestamp: "Yesterday",
  },
  {
    content: `Open source maintainers don't get enough credit.

Just spent 2 hours debugging an issue, found a GitHub discussion where the maintainer helped 47 people with the same problem.

Thank you to everyone who builds in the open 🙏`,
    timestamp: "2 days ago",
  },
  {
    content: `The best technical decision I made this year: switching to SQLite for my side project.

No docker. No connection pools. No cold starts.

Just a file that works.

Postgres is great, but not everything needs it.`,
    timestamp: "3 days ago",
  },
];

export default function BlueskyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bluesky</h1>
        <p className="text-muted-foreground">
          Generate and manage your Bluesky content
        </p>
      </div>
      <div className="grid gap-4">
        {fakePosts.map((post, index) => (
          <PostCard key={index} content={post.content} timestamp={post.timestamp} />
        ))}
      </div>
    </div>
  );
}
