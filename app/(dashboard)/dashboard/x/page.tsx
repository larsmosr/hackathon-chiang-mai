"use client";

import { PostCard } from "@/components/shared/post-card";

const fakePosts = [
  {
    content: `Just shipped v2.0 of my SaaS in 3 weeks 🚀

The secret? I stopped planning and started building.

Sometimes done > perfect.`,
    timestamp: "2 hours ago",
  },
  {
    content: `Hot take: Most "productivity" tools make you less productive.

I switched to a single notes app + calendar.

My output doubled.`,
    timestamp: "5 hours ago",
  },
  {
    content: `Day 47 of building in public:

- 1,200 users
- $2.4k MRR
- 0 paid ads

The compound effect is real.`,
    timestamp: "Yesterday",
  },
  {
    content: `Unpopular opinion: You don't need a co-founder.

What you need:
- Clear vision
- Relentless execution
- A good support network

Solo founders win too.`,
    timestamp: "2 days ago",
  },
  {
    content: `The best marketing strategy I've found?

Being genuinely helpful.

No hooks. No funnels. Just value.

(Thread 🧵)`,
    timestamp: "3 days ago",
  },
];

export default function XPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">X Posts</h1>
        <p className="text-muted-foreground">
          Generate and manage your X (Twitter) content
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
