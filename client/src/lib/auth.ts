import { createServerSupabaseClient } from "./supabase/server";

export const currentUser = async () => {
  const supabase = createServerSupabaseClient();

  try {
    const { data } = await supabase.auth.getUser();

    return data.user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
