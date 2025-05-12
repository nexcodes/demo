import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { type SupabaseClient } from "@supabase/supabase-js";

export const createServerSupabaseClient = (): SupabaseClient => {
  // Call `cookies()` here, not at module level
  const cookieStore = cookies();

  return createServerComponentClient(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    }
  );
};
