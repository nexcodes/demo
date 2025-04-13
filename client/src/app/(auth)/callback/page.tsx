"use client";

import { DEFAULT_REDIRECT, SIGN_IN_REDIRECT } from "@/constants/routes";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Create a separate component to handle search params
function CallbackHandler() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Import useSearchParams inside this component
  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    if (!code) {
      router.push(DEFAULT_REDIRECT);
      return;
    }

    const handleAuthCallback = async () => {
      try {
        // Let Supabase automatically handle the code exchange
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data?.session) {
          console.log("Authenticated ✅", data.session);
          router.push(DEFAULT_REDIRECT);
        } else {
          console.warn("No session found ❌");
          router.push(`/${SIGN_IN_REDIRECT}?error=No session found`);
        }
      } catch (err) {
        console.error("Auth error ❌", err);
        router.push(`/${SIGN_IN_REDIRECT}?error=Authentication failed`);
      }
    };

    handleAuthCallback();
  }, [code, router]);

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <div className="text-center p-10 bg-black/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 animate-gradient-shift"></div>

        <h2 className="text-xl font-semibold mb-3 text-white tracking-wide">
          Authenticating
        </h2>

        <div className="relative h-0.5 w-48 mx-auto mb-10 bg-white/20 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>

        <p className="text-gray-300/80 text-sm font-light max-w-xs mx-auto">
          We&apos;re securely connecting your account. This will only take a
          moment.
        </p>

        <div className="mt-8 flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-xl"></div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full max-w-md">
          <div className="text-center p-10 bg-black/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10">
            <h2 className="text-xl font-semibold mb-3 text-white tracking-wide">
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
