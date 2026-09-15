import { NextRequest, NextResponse } from "next/server";
import { refreshSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get("redirect_to") || "/dashboard";

  try {
    const userId = await refreshSession();
    
    if (userId) {
      // Successfully refreshed tokens
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  } catch (error) {
    console.error("Failed to refresh session", error);
  }

  // If we reach here, refresh failed or no valid refresh token
  return NextResponse.redirect(new URL("/login", request.url));
}
