import { auth } from "@clerk/nextjs/server";
import { Navbar } from "@/components/navbar";
import { GeneratorForm } from "@/components/generator-form";
import { ThumbnailGallery } from "@/components/thumbnail-gallery";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  // Get user's thumbnails
  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      thumbnails: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create New Thumbnail</h1>
            <p className="text-muted-foreground">Describe your video and let AI do the magic.</p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <GeneratorForm />
            </div>
            <div className="lg:col-span-7">
              <ThumbnailGallery initialThumbnails={user?.thumbnails || []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
