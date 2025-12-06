import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { platformValidator } from "./schema";
import { internal } from "./_generated/api";

export const listByPlatform = query({
  args: { platform: platformValidator },
  returns: v.array(
    v.object({
      _id: v.id("posts"),
      _creationTime: v.number(),
      platform: platformValidator,
      content: v.string(),
      timestamp: v.string(),
      imageId: v.optional(v.id("_storage")),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_platform", (q) => q.eq("platform", args.platform))
      .order("desc")
      .collect();
  },
});

export const getImageUrl = query({
  args: { imageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId);
  },
});

export const updatePostImage = internalMutation({
  args: {
    postId: v.id("posts"),
    imageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, { imageId: args.imageId });
    return null;
  },
});

export const generatePostImage = mutation({
  args: { postId: v.id("posts") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.imageId) {
      return null;
    }
    await ctx.scheduler.runAfter(0, internal.images.generateImage, {
      postId: args.postId,
      content: post.content,
    });
    return null;
  },
});

export const create = mutation({
  args: {
    platform: platformValidator,
    content: v.string(),
    timestamp: v.string(),
  },
  returns: v.id("posts"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      platform: args.platform,
      content: args.content,
      timestamp: args.timestamp,
    });
  },
});

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("posts").first();
    if (existing) {
      return null;
    }

    const posts = [
      // X posts
      {
        platform: "x" as const,
        content: `Just shipped v2.0 of my SaaS in 3 weeks 🚀

The secret? I stopped planning and started building.

Sometimes done > perfect.`,
        timestamp: "2 hours ago",
      },
      {
        platform: "x" as const,
        content: `Hot take: Most "productivity" tools make you less productive.

I switched to a single notes app + calendar.

My output doubled.`,
        timestamp: "5 hours ago",
      },
      {
        platform: "x" as const,
        content: `Day 47 of building in public:

- 1,200 users
- $2.4k MRR
- 0 paid ads

The compound effect is real.`,
        timestamp: "Yesterday",
      },
      {
        platform: "x" as const,
        content: `Unpopular opinion: You don't need a co-founder.

What you need:
- Clear vision
- Relentless execution
- A good support network

Solo founders win too.`,
        timestamp: "2 days ago",
      },
      {
        platform: "x" as const,
        content: `The best marketing strategy I've found?

Being genuinely helpful.

No hooks. No funnels. Just value.

(Thread 🧵)`,
        timestamp: "3 days ago",
      },

      // Threads posts
      {
        platform: "threads" as const,
        content: `Can we normalize taking breaks without guilt?

I stepped away from my laptop for 3 days. Came back with more clarity than 3 weeks of grinding ever gave me.

Rest is part of the work.`,
        timestamp: "1 hour ago",
      },
      {
        platform: "threads" as const,
        content: `Building a startup is like assembling IKEA furniture without instructions.

You think you know what you're doing until you have 5 extra screws and the whole thing is wobbly.

But hey, at least it's standing ✨`,
        timestamp: "4 hours ago",
      },
      {
        platform: "threads" as const,
        content: `The hardest part of being an indie maker isn't the code.

It's convincing yourself that what you're building matters.

To everyone grinding through the doubt today: keep going. The world needs more builders.`,
        timestamp: "Yesterday",
      },
      {
        platform: "threads" as const,
        content: `POV: You finally fix that bug that's been haunting you for 3 days

The debugging journey:
Monday: This should be easy
Tuesday: Why is nothing working
Wednesday: I am become bug, destroyer of code
Thursday: *finds missing semicolon*`,
        timestamp: "2 days ago",
      },
      {
        platform: "threads" as const,
        content: `Here's my morning routine that actually sticks:

☕ Coffee first (non-negotiable)
📝 Write down ONE priority
🎧 Put on lo-fi beats
💻 Start building

No meditation apps. No 5am wake ups. Just focus.`,
        timestamp: "3 days ago",
      },

      // LinkedIn posts
      {
        platform: "linkedin" as const,
        content: `I quit my $180k job to build a startup. Here's what happened:

After 18 months of building in the evenings, I took the leap.

The first 3 months were terrifying. No steady paycheck. No team. Just me and my laptop.

But here's what I learned:

→ Fear is temporary, regret is forever
→ You don't need to be ready, you need to start
→ The skills you build as a founder compound

Today, we've helped 2,000+ users and hit $15k MRR.

If you're on the fence about starting something of your own, this is your sign.

#entrepreneurship #startup #buildinpublic`,
        timestamp: "3 hours ago",
      },
      {
        platform: "linkedin" as const,
        content: `Stop saying "I don't have time."

Start saying "It's not a priority."

This simple reframe changed everything for me.

When I caught myself saying I didn't have time to exercise, I realized I was actually saying my health wasn't a priority.

That was the wake-up call I needed.

Now I apply this to everything:
• Client calls? Priority.
• Strategic planning? Priority.
• Doom scrolling? Not a priority.

Language shapes behavior. Choose your words wisely.

What's one thing you've been saying you "don't have time for"?

#productivity #leadership #personaldevelopment`,
        timestamp: "Yesterday",
      },
      {
        platform: "linkedin" as const,
        content: `The best career advice I ever received:

"Optimize for learning, not earning."

In my 20s, I chased titles and salaries.

In my 30s, I realized the people who learned the most, earned the most—just on a 10-year delay.

The compound interest of knowledge is the most powerful force in your career.

What's the best career advice you've received?

#career #growthmindset #professionaldevelopment`,
        timestamp: "2 days ago",
      },
      {
        platform: "linkedin" as const,
        content: `I've interviewed 500+ candidates. Here are the 3 questions that reveal everything:

1. "Tell me about a time you failed."
   → Shows self-awareness and growth mindset

2. "What would you do in your first 30 days?"
   → Reveals preparation and strategic thinking

3. "What questions do you have for me?"
   → Indicates genuine curiosity and fit

The answers matter less than HOW someone answers.

Confidence without arrogance. Honesty without excuses. Curiosity without agenda.

Agree? What would you add?

#hiring #leadership #talentacquisition`,
        timestamp: "4 days ago",
      },
      {
        platform: "linkedin" as const,
        content: `Remote work isn't dying. Bad management is.

The companies calling everyone back to the office have one thing in common: they can't measure output, only attendance.

Great teams focus on results, not where the work happens.

I've built a fully remote team across 5 time zones. Our secret?

→ Async communication by default
→ Clear ownership and accountability
→ Trust over surveillance

The future of work is flexible. Adapt or lose your best people.

#remotework #futureofwork #leadership`,
        timestamp: "5 days ago",
      },

      // Instagram posts
      {
        platform: "instagram" as const,
        content: `Coffee shops hits different when you're building something you actually care about ☕️✨

6 months ago I was stuck in a cubicle dreaming about this. Now I'm living it.

Not saying it's easy. But it's worth it.

#indiehacker #startuplife #workfromanywhere #digitalnomad #entrepreneur`,
        timestamp: "2 hours ago",
      },
      {
        platform: "instagram" as const,
        content: `POV: You just hit your first $1k month 🥹

It's not about the money (okay, it's a little about the money).

It's about proof. Proof that this crazy idea might actually work.

To everyone still at $0: your moment is coming. Keep building.

#buildinpublic #sidehustle #passiveincome #entrepreneurlife #motivation`,
        timestamp: "8 hours ago",
      },
      {
        platform: "instagram" as const,
        content: `The setup that helps me stay focused 🖥️

Minimal desk. Maximum vibes.

Swipe to see the before (trust me, it was chaos).

Drop a 🔥 if you're team clean desk

#desksetup #minimalism #productivity #workfromhome #techsetup`,
        timestamp: "Yesterday",
      },
      {
        platform: "instagram" as const,
        content: `Real talk: I almost quit last month.

The algorithm wasn't working. Sales were flat. Imposter syndrome was LOUD.

But I kept showing up. One day at a time.

This week? Best week ever.

The dip is part of the journey. Don't let it stop you 💪

#entrepreneurmindset #nevergiveup #growthmindset #startupjourney #realtalk`,
        timestamp: "3 days ago",
      },
      {
        platform: "instagram" as const,
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

      // Bluesky posts
      {
        platform: "bluesky" as const,
        content: `Just deployed a feature using WebSockets instead of polling.

Latency went from 2s to 50ms.

Sometimes the "harder" solution is actually easier once you commit to it.`,
        timestamp: "1 hour ago",
      },
      {
        platform: "bluesky" as const,
        content: `Hot take: TypeScript's strict mode should be the default.

Yes, it's annoying at first.
Yes, it catches bugs you didn't know you had.
Yes, your future self will thank you.

The type system is a feature, not a tax.`,
        timestamp: "4 hours ago",
      },
      {
        platform: "bluesky" as const,
        content: `TIL about the Performance API's measure() method.

Been console.log timing things like a caveman for years.

The web platform has so much I still haven't explored.`,
        timestamp: "Yesterday",
      },
      {
        platform: "bluesky" as const,
        content: `Open source maintainers don't get enough credit.

Just spent 2 hours debugging an issue, found a GitHub discussion where the maintainer helped 47 people with the same problem.

Thank you to everyone who builds in the open 🙏`,
        timestamp: "2 days ago",
      },
      {
        platform: "bluesky" as const,
        content: `The best technical decision I made this year: switching to SQLite for my side project.

No docker. No connection pools. No cold starts.

Just a file that works.

Postgres is great, but not everything needs it.`,
        timestamp: "3 days ago",
      },
    ];

    for (const post of posts) {
      await ctx.db.insert("posts", post);
    }

    return null;
  },
});

