import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const thumbnail = await db.thumbnail.findUnique({
      where: { id },
    });

    if (!thumbnail) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Ensure the user owns this thumbnail
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user || thumbnail.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.thumbnail.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
