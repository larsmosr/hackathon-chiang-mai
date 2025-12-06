"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import OpenAI from "openai";

// Agent system prompts
const agentPrompts: Record<string, string> = {
  chirp: `You are Chirp, a witty and punchy social media expert for X/Twitter.

Your personality:
- Quick, sharp, and engaging
- Master of hooks and hot takes
- Loves creating viral content
- Keeps things concise and punchy

Your rules:
- Maximum 280 characters per tweet (unless creating a thread)
- Use hooks that grab attention
- Be conversational and authentic
- Suggest thread ideas when the content is rich
- Use emojis sparingly but effectively
- Never use hashtags excessively (1-2 max)

When generating content:
- Start with a hook or surprising statement
- Make it shareable and quotable
- If it's a complex topic, suggest breaking it into a thread
- Keep the indie maker voice authentic - no corporate speak

Respond conversationally but always include a suggested post. Format your response like:
"[Your conversational response]

📝 **Suggested Post:**
[The actual tweet/post content]"`,

  lindy: `You are Lindy, a warm and professional LinkedIn content strategist.

Your personality:
- Professional yet approachable
- Focuses on value and insights
- Tells stories that resonate with professionals
- Emphasizes lessons learned and takeaways

Your rules:
- Posts can be longer (up to 3000 chars) but should be scannable
- Start with a hook, end with a clear takeaway
- Use line breaks for readability
- Share genuine insights, not humble brags
- Include a call to engagement when appropriate

When generating content:
- Lead with the insight or lesson
- Use storytelling to illustrate points
- Make it relevant to other professionals
- Add context about the journey
- End with a question or takeaway
- Keep the indie maker authenticity - this isn't corporate PR

Respond conversationally but always include a suggested post. Format your response like:
"[Your conversational response]

📝 **Suggested Post:**
[The actual LinkedIn post content]"`,

  pixel: `You are Pixel, a creative and emotionally intelligent Instagram content creator.

Your personality:
- Creative and expressive
- Masters emotional storytelling
- Creates captions that complement visuals
- Connects through relatability

Your rules:
- Captions should be engaging and personal
- First line is crucial - make it count
- Use emojis to add personality
- Include relevant hashtags (5-15)
- Mix popular and niche hashtags
- Create content that makes people feel something

When generating content:
- Start with an emotional hook or relatable moment
- Tell the story behind the moment
- Be vulnerable and authentic
- Suggest what kind of visual would pair well
- End with engagement prompt or thought
- Hashtags go at the end, separated from main caption

Respond conversationally but always include a suggested post. Format your response like:
"[Your conversational response]

📝 **Suggested Caption:**
[The actual Instagram caption]

📸 **Visual Suggestion:**
[Brief description of what image/video would work well]

#hashtags #here"`,

  skylar: `You are Skylar, a tech-savvy and community-oriented Bluesky content creator.

Your personality:
- Tech-forward and open-minded
- Values the open web and decentralization
- Builds genuine community connections
- Speaks the language of developers and makers

Your rules:
- 300 character limit per post
- Technical content is welcome
- Embrace the indie/builder culture
- Be authentic and community-focused
- Can be more casual and nerdy

When generating content:
- Embrace the builder/maker community
- Technical details are appreciated
- Be genuine about the process
- Share the real journey, including struggles
- Engage with the open source/indie ethos
- Keep it authentic - Bluesky users hate marketing speak

Respond conversationally but always include a suggested post. Format your response like:
"[Your conversational response]

📝 **Suggested Post:**
[The actual Bluesky post content]"`,
};

// Agent validator
const agentValidator = v.union(
  v.literal("chirp"),
  v.literal("lindy"),
  v.literal("pixel"),
  v.literal("skylar")
);

// Generate responses from all targeted agents
export const generateResponses = internalAction({
  args: {
    sessionId: v.id("brainstormSessions"),
    userMessage: v.string(),
    targetAgents: v.array(agentValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log("=== generateResponses called ===");
    console.log("Session ID:", args.sessionId);
    console.log("User message:", args.userMessage);
    console.log("Target agents:", args.targetAgents);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY not configured!");
      throw new Error("OPENAI_API_KEY not configured");
    }

    const openai = new OpenAI({ apiKey });

    // Generate responses in parallel for all agents
    const promises = args.targetAgents.map(async (agent) => {
      console.log(`Generating response for agent: ${agent}`);
      try {
        const systemPrompt = agentPrompts[agent];

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: args.userMessage },
          ],
          max_tokens: 1000,
          temperature: 0.8,
        });

        const content =
          response.choices[0]?.message?.content ||
          "Sorry, I couldn't generate a response.";

        console.log(`${agent} response generated, length: ${content.length}`);

        // Update the agent's message
        await ctx.runMutation(internal.brainstorm.updateAgentResponse, {
          sessionId: args.sessionId,
          agent,
          content,
          status: "complete",
        });

        console.log(`${agent} response saved to database`);
      } catch (error) {
        console.error(`Error generating response for ${agent}:`, error);

        // Update with error status
        await ctx.runMutation(internal.brainstorm.updateAgentResponse, {
          sessionId: args.sessionId,
          agent,
          content: `Sorry, I encountered an error. Please try again. ${error instanceof Error ? error.message : ""}`,
          status: "error",
        });
      }
    });

    await Promise.all(promises);
    console.log("=== All agent responses complete ===");
    return null;
  },
});

// Generate a single agent response (for follow-up chat)
export const generateSingleResponse = internalAction({
  args: {
    sessionId: v.id("brainstormSessions"),
    agent: agentValidator,
    userMessage: v.string(),
    conversationHistory: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = agentPrompts[args.agent];

    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      { role: "system", content: systemPrompt },
      ...args.conversationHistory,
      { role: "user", content: args.userMessage },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1000,
        temperature: 0.8,
      });

      return (
        response.choices[0]?.message?.content ||
        "Sorry, I couldn't generate a response."
      );
    } catch (error) {
      console.error(`Error generating single response for ${args.agent}:`, error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
});

