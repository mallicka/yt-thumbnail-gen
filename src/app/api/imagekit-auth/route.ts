import { imagekit } from "@/lib/imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParameters);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth parameters" },
      { status: 500 }
    );
  }
}
