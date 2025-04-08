"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const supabase = createServerSupabaseClient();

export async function verifyPhoneOtp(phone: string, token: string) {
  try {
    const { data: currentSession } = await supabase.auth.getSession();

    const { error } = await supabase.auth.verifyOtp({
      type: "sms",
      phone: phone,
      token: token,
    });

    if (error) throw new Error(error.message);

    if (currentSession?.session) {
      await supabase.auth.setSession(currentSession.session);
    }

    return { success: true };
  } catch (err) {
    const error = err as Error;
    console.error("Server error:", error);
    return {
      success: false,
      message: error.message || "Failed to verify phone number",
    };
  }
}
