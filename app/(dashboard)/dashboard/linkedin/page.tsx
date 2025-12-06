"use client";

import { PostCard } from "@/components/shared/post-card";

const fakePosts = [
  {
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
];

export default function LinkedInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">LinkedIn</h1>
        <p className="text-muted-foreground">
          Generate and manage your LinkedIn content
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
