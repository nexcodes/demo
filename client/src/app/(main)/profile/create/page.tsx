"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { strapiClient } from "@/lib/strapi";
import { profileSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { ProfileForm } from "../_components/profile-form";

export default function CreateProfilePage() {
  const router = useRouter();

  const { user } = useCurrentUser();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (
    data: z.infer<typeof profileSchema>,
    files: File[]
  ) => {
    startTransition(async () => {
      if (!user?.id) return;

      try {
        // Upload files and get media IDs
        const uploadedIds = await uploadToStrapi(files);

        // Create profile with media IDs
        await strapiClient.collection("profiles").create({
          ...data,
          photos: uploadedIds,
          userId: user.id,
        });

        router.push("/");
      } catch (err) {
        console.error("Error:", err);
      }
    });
  };

  // Strapi file upload helper
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
      <ProfileForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
