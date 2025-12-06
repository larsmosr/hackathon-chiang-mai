"use client";

import { PostCard } from "@/components/shared/post-card";

const fakePosts = [
  {
    content: `Can we normalize taking breaks without guilt?

I stepped away from my laptop for 3 days. Came back with more clarity than 3 weeks of grinding ever gave me.

Rest is part of the work.`,
    timestamp: "1 hour ago",
  },
  {
    content: `Building a startup is like assembling IKEA furniture without instructions.

You think you know what you're doing until you have 5 extra screws and the whole thing is wobbly.

But hey, at least it's standing ✨`,
    timestamp: "4 hours ago",
  },
  {
    content: `The hardest part of being an indie maker isn't the code.

It's convincing yourself that what you're building matters.

To everyone grinding through the doubt today: keep going. The world needs more builders.`,
    timestamp: "Yesterday",
  },
  {
    content: `POV: You finally fix that bug that's been haunting you for 3 days

The debugging journey:
Monday: This should be easy
Tuesday: Why is nothing working
Wednesday: I am become bug, destroyer of code
Thursday: *finds missing semicolon*`,
    timestamp: "2 days ago",
  },
  {
    content: `Here's my morning routine that actually sticks:

☕ Coffee first (non-negotiable)
📝 Write down ONE priority
🎧 Put on lo-fi beats
💻 Start building

No meditation apps. No 5am wake ups. Just focus.`,
    timestamp: "3 days ago",
  },
];

export default function ThreadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Threads</h1>
        <p className="text-muted-foreground">
          Generate and manage your Threads content
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
