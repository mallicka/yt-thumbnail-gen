"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Thumbnail {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
}

interface ThumbnailGalleryProps {
  initialThumbnails: Thumbnail[];
}

export function ThumbnailGallery({ initialThumbnails }: ThumbnailGalleryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  if (initialThumbnails.length === 0) {
    return (
      <div className="h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-10 bg-muted/30">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Download className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No thumbnails yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Your generated thumbnails will appear here. Start by entering a prompt on the left.
        </p>
      </div>
    );
  }

  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `thumbnail-${prompt.slice(0, 20).replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download image.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/generate/delete?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete thumbnail");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {initialThumbnails.map((thumbnail) => (
        <Card key={thumbnail.id} className="overflow-hidden group border-muted/60 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
          <CardContent className="p-0 relative aspect-video bg-muted">
            <Image
              src={thumbnail.imageUrl}
              alt={thumbnail.prompt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button 
                size="icon" 
                variant="secondary" 
                onClick={() => handleDownload(thumbnail.imageUrl, thumbnail.prompt)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="destructive"
                disabled={deletingId === thumbnail.id}
                onClick={() => handleDelete(thumbnail.id)}
              >
                {deletingId === thumbnail.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-4 flex flex-col items-start gap-1">
            <p className="text-sm font-medium line-clamp-1">{thumbnail.prompt}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(thumbnail.createdAt).toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
