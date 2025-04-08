import { NextRequest, NextResponse } from "next/server";
import {
  authRoutes,
  publicRoutes,
  SIGN_IN_REDIRECT
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

  return res;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
