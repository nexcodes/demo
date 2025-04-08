"use client";

import { GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import React, { startTransition } from "react";

export default function SignInPage() {
  const handleGoogleSignIn = () => {
    startTransition(async () => {
      try {
        // Sign in with Google using Supabase
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/callback`,
          },
        });

        if (error) {
          throw error;
        }

        console.log("Redirecting to Google auth...", data);
      } catch (err) {
        const error = err as Error;
        console.error("Error signing in with Google:", error.message);
      }
    });
  };

  return (
    <div className="z-10 w-full max-w-lg px-8 py-12 rounded-2xl bg-black/30 backdrop-blur-md shadow-2xl border border-white/10">
      {/* Logo */}
      <div className="flex justify-center mb-12 w-full">
        <div className="w-48 h-24 relative">
          <Image src="/logo.png" alt="Coxee" fill className="object-contain" />
        </div>
      </div>

      {/* Google Login Button */}
      <Button
        size="lg"
        className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-6 flex items-center justify-center gap-3 rounded-xl transition-all duration-300 hover:shadow-lg"
        onClick={handleGoogleSignIn}
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
}
