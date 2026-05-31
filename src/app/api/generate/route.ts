import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import * as fal from "@fal-ai/serverless-client";
import OpenAI from "openai";
import { db } from "@/lib/db";

// Configure Fal
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { prompt, style = "realistic", refine = false } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Ensure user exists in our DB
    let dbUser = await db.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          clerkId,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }

    let finalPrompt = prompt;

    // Use OpenAI to refine the prompt for better image results
    if (refine) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional YouTube thumbnail designer. Your task is to take a simple prompt and turn it into a highly detailed, visually stunning image generation prompt. Focus on lighting, composition, colors, and 'YouTube' style aesthetics (high contrast, vibrant, clickbaity). Keep the response under 75 words.",
          },
          {
            role: "user",
            content: `Refine this prompt for a YouTube thumbnail: ${prompt}`,
          },
        ],
      });
      finalPrompt = completion.choices[0].message.content || prompt;
    }

    // Append style modifiers
    const styleModifiers: Record<string, string> = {
      realistic: "photorealistic, 8k, highly detailed, professional photography",
      anime: "vibrant anime style, clean lines, cel shaded, high energy",
      gaming: "gaming aesthetic, neon lights, high contrast, cinematic lighting, 4k",
      minimal: "clean, minimal design, bold typography placeholder, simple background",
      cyberpunk: "cyberpunk aesthetic, futuristic, neon glows, rainy night, high tech",
    };

    const enhancedPrompt = `YouTube thumbnail, ${styleModifiers[style] || styleModifiers.realistic}, ${finalPrompt}`;

    // Generate image using Fal
    const result: any = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: enhancedPrompt,
        image_size: "landscape_16_9",
        num_inference_steps: 4,
      },
    });

    const imageUrl = result.images[0].url;

    // Save to database
    const thumbnail = await db.thumbnail.create({
      data: {
        prompt: finalPrompt,
        imageUrl,
        userId: dbUser.id,
      },
    });

    return NextResponse.json(thumbnail);
  } catch (error) {
    console.error("[GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
