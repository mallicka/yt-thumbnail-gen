import Image from "next/image";

interface Thumbnail {
  fileId: string;
  url: string;
  name: string;
  customMetadata?: {
    prompt?: string;
    style?: string;
  };
}

interface ThumbnailGalleryProps {
  thumbnails: Thumbnail[];
}

export function ThumbnailGallery({ thumbnails }: ThumbnailGalleryProps) {
  if (thumbnails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          No thumbnails generated yet.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Start by describing your vision above!
        </p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {thumbnails.map((thumb) => (
        <div
          key={thumb.fileId}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={thumb.url}
              alt={thumb.customMetadata?.prompt || thumb.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <p className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {thumb.customMetadata?.prompt || "Generated Thumbnail"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {thumb.customMetadata?.style || "Standard"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
