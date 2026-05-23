"use client";

import { THUMBNAIL_STYLES } from "@/app/actions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onSelect: (styleId: string) => void;
}

export function StyleSelector({ selectedStyleId, onSelect }: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Choose a Thumbnail Style
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {THUMBNAIL_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onSelect(style.id)}
            className={cn(
              "group relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900",
              selectedStyleId === style.id
                ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-900"
                : "border-transparent bg-white dark:bg-zinc-950"
            )}
          >
            <span className="text-sm font-semibold text-black dark:text-white">
              {style.name}
            </span>
            <span className="mt-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
              {style.description}
            </span>
            {selectedStyleId === style.id && (
              <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white dark:bg-white dark:text-black">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
