"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { client } from "@/lib/sanity";
import { DatingProfileForm } from "@/schemas/dating-profile.schema";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ProfileForm } from "../_components/profile-form";
import { nanoid } from "nanoid";

export default function CreateProfilePage() {
  const router = useRouter();

  const { user } = useCurrentUser();

  const [isPending, startTransition] = useTransition();

  const uploadToSanity = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      // Create a unique file name
      const fileExtension = file.name.split(".").pop();
      const fileName = `${nanoid()}.${fileExtension}`;

      // Convert file to array buffer
      const fileBuffer = await file.arrayBuffer();

      // Upload to Sanity
      const document = await client.assets.upload(
        "image",
        new Blob([fileBuffer]),
        {
          filename: fileName,
        }
      );

      // Return the reference with _key added
      return {
        _type: "image",
        _key: nanoid(), // Add unique _key for array items
        asset: {
          _type: "reference",
          _ref: document._id,
        },
      };
    });

    // Wait for all uploads to complete
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (data: DatingProfileForm) => {
    startTransition(async () => {
      if (!user?.id) return;

      try {
        // Upload files and get media references
        const uploadedImageReferences = await uploadToSanity(data.gallery);

        // Create profile with media references
        await client.create({
          _type: "profile",
          ...data,
          gallery: uploadedImageReferences,
          userId: user.id,
        });

        router.push("/");
      } catch (err) {
        console.error("Error:", err);
      }
    });
  };

  return (
    <div className="container mx-auto py-10">
      <ProfileForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
