/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Profile } from "@/data/get-user-profile";
import { useCurrentUser } from "@/hooks/use-current-user";
import { profileSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { ProfileForm } from "../_components/profile-form";

export default function ClientEditProfilePage({
  profile,
}: {
  profile: Profile;
}) {
  const router = useRouter();

  const { user } = useCurrentUser();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (
    data: z.infer<typeof profileSchema>,
    files: File[]
  ) => {
    startTransition(async () => {
      if (!user?.id) {
        console.error("User ID is required");
        return;
      }
      try {
        const uploadedIds = await uploadToStrapi(files);

        data.photos = [...data.photos, ...uploadedIds];

        const { id, documentId, photosUrl, ...dataToSend } = data as any;

        // Update the profile in Strapi using REST API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/profiles/${profile.documentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({ data: dataToSend }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Strapi API error: ${errorData.error?.message || "Unknown error"}`
          );
        }

        // Redirect after successful update
        router.push("/");
      } catch (err) {
        // Handle unexpected errors (network, Strapi errors)
        console.error("Error submitting profile:", err);
      }
    });
  };

  async function uploadToStrapi(files: File[]): Promise<number[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.map((file: { id: number }) => file.id);
  }

  return (
    <div className="container mx-auto py-10">
      <ProfileForm
        initialData={{
          ...profile,
          birthday: new Date(profile.birthday),
          photosUrl: profile.photos?.map((photo) => photo.url),
          photos: profile.photos?.map((photo) => photo.id),
        }}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
