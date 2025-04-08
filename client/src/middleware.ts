import { NextRequest, NextResponse } from "next/server";
import {
  authRoutes,
  DEFAULT_REDIRECT,
  publicRoutes,
  SIGN_IN_REDIRECT,
} from "./constants/routes";
import { createMiddlewareSupabaseClient } from "./lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next();

  const {
    nextUrl: { pathname },
  } = req;

  // Updated to createMiddlewareClient instead of createMiddlewareSupabaseClient
  const supabase = createMiddlewareSupabaseClient(req, res);

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session;

  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  const isApiRoute =
    pathname.startsWith("/api") || pathname.startsWith("/trpc");

  // Early returns for public and API routes
  if (isPublicRoute || isApiRoute) return res;

  // Handle unauthenticated users
  if (!isLoggedIn) {
    if (isAuthRoute) {
      return res;
    }
    return NextResponse.redirect(new URL(SIGN_IN_REDIRECT, req.url));
  }

  // Avoid redirects on these pages to prevent loops
  if (pathname === "/verify" || pathname === "/profile/create") {
    return res;
  }

  try {
    // Fetch phone data using REST API
    const phoneResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/phones?filters[userId][$eq]=${session.user.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const phoneData = await phoneResponse.json();

    // Check if phone data exists, if not redirect to verify
    if (!phoneData || !phoneData.data || phoneData.data.length === 0) {
      console.log({ session, phoneData });

      if (pathname !== "/verify") {
        return NextResponse.redirect(new URL("/verify", req.url));
      }
      return res;
    }

    // Fetch profile data using REST API
    const profileResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles?filters[userId][$eq]=${session.user.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const profileData = await profileResponse.json();

    // Check if profile exists, if not redirect to create profile
    if (!profileData || !profileData.data || profileData.data.length === 0) {
      // Don't redirect if already at /profile/create to prevent loops
      if (pathname !== "/profile/create") {
        return NextResponse.redirect(new URL("/profile/create", req.url));
      }
      return res;
    }

    // If at profile creation but profile already exists, redirect to default
    if (
      pathname === "/profile/create" &&
      profileData.data &&
      profileData.data.length > 0
    ) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, req.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);
    // Return the original response on error instead of possibly redirecting
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
