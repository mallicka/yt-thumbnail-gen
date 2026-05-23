import { getGeneratedThumbnailsAction } from "@/app/actions";
import { ThumbnailForm } from "@/components/ThumbnailForm";
import { ThumbnailGallery } from "@/components/ThumbnailGallery";
import { Sparkles } from "lucide-react";

export default async function Home() {
  const thumbnails = await getGeneratedThumbnailsAction();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-black dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
              <Sparkles className="h-5 w-5 text-white dark:text-black" />
            </div>
            <span className="text-xl tracking-tight">ThumbGen AI</span>
          </div>
          <nav className="hidden space-x-6 text-sm font-medium sm:flex">
            <a href="#" className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">Home</a>
            <a href="#" className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">Pricing</a>
            <a href="#" className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">Gallery</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto flex max-w-5xl flex-1 flex-col items-center gap-12 px-4 py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-black dark:text-zinc-50 sm:text-6xl">
            Create Stunning YouTube <span className="text-zinc-500">Thumbnails</span> with AI
          </h1>
          <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
            Generate high-click-through-rate thumbnails in seconds. Just describe your vision or provide inspiration.
          </p>
        </div>

        {/* Generator Section */}
        <ThumbnailForm />

        {/* Your Gallery Section */}
        <div className="w-full space-y-8 py-8">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Your Generations
            </h2>
            <div className="text-sm font-medium text-zinc-500">
              {thumbnails.length} images total
            </div>
          </div>

          <ThumbnailGallery thumbnails={thumbnails as Parameters<typeof ThumbnailGallery>[0]["thumbnails"]} />
        </div>
      </main>

      <footer className="w-full border-t border-zinc-200 py-12 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>© 2024 ThumbGen AI. Built for the next generation of creators.</p>
        </div>
      </footer>
    </div>
  );
}
