"use client";

import { PostCard } from "@/components/shared/post-card";

const fakePosts = [
  {
    content: `Coffee shops hits different when you're building something you actually care about ☕️✨

6 months ago I was stuck in a cubicle dreaming about this. Now I'm living it.

Not saying it's easy. But it's worth it.

#indiehacker #startuplife #workfromanywhere #digitalnomad #entrepreneur`,
    timestamp: "2 hours ago",
  },
  {
    content: `POV: You just hit your first $1k month 🥹

It's not about the money (okay, it's a little about the money).

It's about proof. Proof that this crazy idea might actually work.

To everyone still at $0: your moment is coming. Keep building.

#buildinpublic #sidehustle #passiveincome #entrepreneurlife #motivation`,
    timestamp: "8 hours ago",
  },
  {
    content: `The setup that helps me stay focused 🖥️

Minimal desk. Maximum vibes.

Swipe to see the before (trust me, it was chaos).

Drop a 🔥 if you're team clean desk

#desksetup #minimalism #productivity #workfromhome #techsetup`,
    timestamp: "Yesterday",
  },
  {
    content: `Real talk: I almost quit last month.

The algorithm wasn't working. Sales were flat. Imposter syndrome was LOUD.

But I kept showing up. One day at a time.

This week? Best week ever.

The dip is part of the journey. Don't let it stop you 💪

#entrepreneurmindset #nevergiveup #growthmindset #startupjourney #realtalk`,
    timestamp: "3 days ago",
  },
  {
    content: `From idea to launch in 30 days 🚀

Here's what I learned shipping my first product:

1. Done beats perfect
2. Talk to users early
3. Launch scared
4. Iterate fast

Save this for when you need the reminder ✨

#productlaunch #startup #entrepreneur #buildingproducts #techstartup`,
    timestamp: "5 days ago",
  },
];

export default function InstagramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instagram</h1>
        <p className="text-muted-foreground">
          Generate and manage your Instagram captions
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
