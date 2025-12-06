"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import OpenAI from "openai";
import { internal } from "./_generated/api";

export const generateImage = internalAction({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const openai = new OpenAI();

    const prompt = `Create a visually appealing, Instagram-worthy image that represents this content: "${args.content.slice(0, 500)}". 
    Style: Modern, aesthetic, suitable for social media. 
    No text in the image. 
    High quality, vibrant colors, professional photography style.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch generated image");
    }

    const imageBlob = await imageResponse.blob();

    const storageId = await ctx.storage.store(imageBlob);

    await ctx.runMutation(internal.posts.updatePostImage, {
      postId: args.postId,
      imageId: storageId,
    });

    return null;
  },
});

