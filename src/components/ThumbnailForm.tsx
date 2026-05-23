"use client";

import { useState, useTransition } from "react";
import { generateThumbnailAction } from "@/app/actions";
import { StyleSelector } from "./StyleSelector";
import { ImageKitContext, IKUpload } from "imagekitio-next";
import { Loader2, Upload, Wand2 } from "lucide-react";
import Image from "next/image";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

export function ThumbnailForm() {
  const [prompt, setPrompt] = useState("");
  const [styleId, setStyleId] = useState<string>("minimalist");
  const [inspirationUrl, setInspirationUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUploadSuccess = (res: { url: string }) => {
    setInspirationUrl(res.url);
  };

  const handleUploadError = (err: { message: string }) => {
    console.error("Upload error:", err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("styleId", styleId);
    if (inspirationUrl) {
      formData.append("inspirationUrl", inspirationUrl);
    }

    startTransition(async () => {
      await generateThumbnailAction(formData);
      setPrompt("");
      setInspirationUrl(null);
    });
  };

  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        throw new Error("Failed to authenticate with ImageKit");
      }
      return await response.json();
    } catch (error) {
      console.error("ImageKit authentication failed:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label
            htmlFor="prompt"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            What should be in your thumbnail?
          </label>
          <textarea
            id="prompt"
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A futuristic city at night with neon lights and a robot mascot"
            className="h-32 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 transition-all focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        <StyleSelector selectedStyleId={styleId} onSelect={setStyleId} />

        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Inspiration Image (Optional)
          </label>
        <ImageKitContext
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
          >
            <div className="flex flex-col items-center gap-4">
              {inspirationUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                  <Image
                    src={inspirationUrl}
                    alt="Inspiration"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setInspirationUrl(null)}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    <Loader2 className="h-4 w-4 rotate-45" />
                  </button>
                </div>
              ) : (
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <Upload className="mb-3 h-8 w-8 text-zinc-400" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                    </div>
                    <IKUpload
                      className="hidden"
                      onError={handleUploadError}
                      onSuccess={handleUploadSuccess}
                      useUniqueFileName={true}
                    />
                  </label>
                </div>
              )}
            </div>
          </ImageKitContext>
        </div>

        <button
          type="submit"
          disabled={isPending || !prompt}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-6 text-base font-semibold text-white transition-all hover:bg-zinc-800 disabled:bg-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              Generate Thumbnail
            </>
          )}
        </button>
      </form>
    </div>
  );
}
