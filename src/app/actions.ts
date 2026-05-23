"use server";

import { imagekit } from "@/lib/imagekit";
import { revalidatePath } from "next/cache";

export type ThumbnailStyle = {
  id: string;
  name: string;
  description: string;
};

export const THUMBNAIL_STYLES: ThumbnailStyle[] = [
  { id: "minimalist", name: "Minimalist", description: "Clean and simple with focused elements." },
  { id: "clickbait", name: "Clickbait", description: "Bright colors, big text, and high contrast." },
  { id: "cinematic", name: "Cinematic", description: "Mood lighting and dramatic framing." },
  { id: "neon", name: "Neon", description: "Vibrant glow and futuristic aesthetic." },
];

export async function generateThumbnailAction(formData: FormData) {
  const prompt = formData.get("prompt") as string;
  const styleId = formData.get("styleId") as string;
  const inspirationUrl = formData.get("inspirationUrl") as string;

  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const selectedStyle = THUMBNAIL_STYLES.find((s) => s.id === styleId);

  // Mock AI Image Generation
  // In a real app, you would call OpenAI DALL-E, Replicate, etc.
  // We'll use a high-quality placeholder that mimics a generated thumbnail
  const mockGeneratedImageUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt + (selectedStyle?.name || ""))}/1280/720`;

  try {
    // Upload the "generated" image to ImageKit
    const uploadResponse = await imagekit.files.upload({
      file: mockGeneratedImageUrl,
      fileName: `generated-${Date.now()}.jpg`,
      tags: ["generated"],
      customMetadata: {
        prompt,
        style: selectedStyle?.name || "None",
        inspirationUrl: inspirationUrl || "None",
      },
    });

    revalidatePath("/");
    return { success: true, image: uploadResponse };
  } catch (error) {
    console.error("Failed to generate/upload thumbnail:", error);
    return { success: false, error: "Failed to generate thumbnail" };
  }
}

export async function getGeneratedThumbnailsAction() {
  try {
    const files = await imagekit.assets.list({
      tags: "generated",
    });

    return files;
  } catch (error) {
    console.error("Failed to fetch thumbnails:", error);
    return [];
  }
}
