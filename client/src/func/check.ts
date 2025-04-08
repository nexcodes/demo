"use client";

import { DEFAULT_REDIRECT } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useCheck = () => {
  const pathname = usePathname();

  const router = useRouter();

  const { user } = useCurrentUser();

  useEffect(() => {
    (async () => {
      try {
        // Fetch phone data using REST API
        const phoneResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/phones?filters[userId][$eq]=${user?.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const phoneData = await phoneResponse.json();

        // Check if phone data exists, if not redirect to verify
        if (!phoneData || !phoneData.data || phoneData.data.length === 0) {
          if (pathname !== "/verify") {
            return router.push("/verify");
          }
          return null;
        }

        // Fetch profile data using REST API
        const profileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles?filters[userId][$eq]=${user?.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const profileData = await profileResponse.json();

        // Check if profile exists, if not redirect to create profile
        if (
          !profileData ||
          !profileData.data ||
          profileData.data.length === 0
        ) {
          // Don't redirect if already at /profile/create to prevent loops
          if (pathname !== "/profile/create") {
            return router.push("/profile/create");
          }
          return null;
        }

        // If at profile creation but profile already exists, redirect to default
        if (
          pathname === "/profile/create" &&
          profileData.data &&
          profileData.data.length > 0
        ) {
          return router.push(DEFAULT_REDIRECT);
        }
      } catch (error) {
        console.error("Middleware error:", error);
        return null;
      }
    })();
  }, [pathname, router, user]);
};
