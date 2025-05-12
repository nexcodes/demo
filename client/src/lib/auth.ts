import { createServerSupabaseClient } from "./supabase/server";

const supabase = createServerSupabaseClient();

export const currentUser = async () => {
  try {
    const { data } = await supabase.auth.getUser();

    return data.user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const currentSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
};
