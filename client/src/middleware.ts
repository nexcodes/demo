import { NextRequest, NextResponse } from "next/server";
import {
  authRoutes,
  DEFAULT_REDIRECT,
  publicRoutes,
  SIGN_IN_REDIRECT,
} from "./constants/routes";
import { createMiddlewareSupabaseClient } from "./lib/supabase/middleware";

// Helper function with timeout
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout = 3000
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });

  clearTimeout(id);
  return response;
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const {
    nextUrl: { pathname },
  } = req;

  // Early returns for static files and public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return res;
  }

  const supabase = createMiddlewareSupabaseClient(req, res);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isApiRoute =
    pathname.startsWith("/api") || pathname.startsWith("/trpc");

  // Handle public and API routes
  if (isPublicRoute || isApiRoute) return res;

  // Handle unauthenticated users
  if (!isLoggedIn) {
    if (isAuthRoute) return res;
    return NextResponse.redirect(new URL(SIGN_IN_REDIRECT, req.url));
  }

  // Skip verification for these routes to prevent loops
  if (pathname === "/verify" || pathname === "/profile/create") {
    return res;
  }

  try {
    // Fetch both phone and profile data in parallel with timeout
    const [phoneResponse, profileResponse] = await Promise.all([
      fetchWithTimeout(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/phones?filters[userId][$eq]=${session.user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      ),
      fetchWithTimeout(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles?filters[userId][$eq]=${session.user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      ),
    ]);

    const [phoneData, profileData] = await Promise.all([
      phoneResponse.json(),
      profileResponse.json(),
    ]);

    // Check phone verification
    if (!phoneData?.data?.length && pathname !== "/verify") {
      return NextResponse.redirect(new URL("/verify", req.url));
    }

    // Check profile creation
    if (!profileData?.data?.length) {
      if (pathname !== "/profile/create") {
        return NextResponse.redirect(new URL("/profile/create", req.url));
      }
      return res;
    }

    // Redirect if trying to create profile but already has one
    if (pathname === "/profile/create" && profileData?.data?.length) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, req.url));
    }
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow the request to proceed but log the error
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)"],
};
