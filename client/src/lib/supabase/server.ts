import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { type SupabaseClient } from "@supabase/supabase-js";

export const createServerSupabaseClient = (): SupabaseClient => {
  return createServerComponentClient(
    {
      cookies: () => cookies(),
    },
    {
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    }
  );
};
