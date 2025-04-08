import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { type SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";

export const createMiddlewareSupabaseClient = (
  req: NextRequest,
  res: NextResponse
): SupabaseClient => {
  return createMiddlewareClient(
    { req, res },
    {
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    }
  );
};
