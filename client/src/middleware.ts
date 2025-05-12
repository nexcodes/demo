import { NextRequest, NextResponse } from "next/server";
import { authRoutes, publicRoutes, SIGN_IN_REDIRECT } from "./constants/routes";
import { createMiddlewareSupabaseClient } from "./lib/supabase/middleware";

// Add your Sanity project details here
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_API_TOKEN = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
const SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-11";

async function checkSanityRecord(type: string, userId: string) {
  const query = encodeURIComponent(
    `*[_type == "${type}" && userId == "${userId}"][0]{_id}`
  );
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
    },
  });
  const data = await res.json();
  return data.result;
}

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next();

  const pathname: string = req.nextUrl.pathname;

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

  // --- Custom logic for Sanity checks ---
  const userId = session.user.id;
  // 1. Check phone record
  const phoneRecord = await checkSanityRecord("user", userId);
  if (!phoneRecord && pathname !== "/verify") {
    return NextResponse.redirect(new URL("/verify", req.url));
  }
  // 2. Check profile record
  const profileRecord = await checkSanityRecord("profile", userId);
  if (!profileRecord && pathname !== "/profile/create") {
    return NextResponse.redirect(new URL("/profile/create", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
