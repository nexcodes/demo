/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { client } from "@/lib/sanity";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ProfileForm } from "../_components/profile-form";

export default function ClientEditProfilePage({ profile }: { profile: any }) {
  const router = useRouter();

  const { user } = useCurrentUser();

  const [isPending, startTransition] = useTransition();
  const handleSubmit = async (data: any) => {
    console.log({ data });

    startTransition(async () => {
      if (!user?.id) {
        console.error("User ID is required");
        return;
      }
      try {
        // Extract files from gallery and other data
        const files = data.gallery || [];
        const imagesToDelete = data.imagesToDelete || [];
        const existingImages = data.existingImages || [];

        console.log("Form data received:", {
          filesCount: files.length,
          imagesToDeleteCount: imagesToDelete.length,
          existingImagesCount: existingImages.length,
          existingImages: existingImages.map((img: any) => ({
            hasKey: !!img?._key,
            hasAsset: !!img?.asset,
            hasAssetRef: !!img?.asset?._ref,
            assetRef: img?.asset?._ref,
          })),
        });

        // Delete images from Sanity if any
        if (imagesToDelete.length > 0) {
          await Promise.all(
            imagesToDelete.map(async (assetRef: string) => {
              try {
                await client.delete(assetRef);
              } catch (error) {
                console.warn(`Failed to delete asset ${assetRef}:`, error);
              }
            })
          );
        }

        // Upload new files and get media references
        const uploadedImageReferences =
          files.length > 0 ? await uploadToSanity(files) : [];

        // Extract fields that shouldn't be sent to Sanity
        const {
          id,
          documentId,
          gallery,
          imagesToDelete: _,
          existingImages: __,
          ...dataToUpdate
        } = data; // Combine existing photos with newly uploaded ones
        // Filter out any invalid existing images (null refs, missing assets, etc.)
        const validExistingImages = existingImages.filter(
          (img: any) =>
            img &&
            img.asset &&
            img.asset._ref &&
            img.asset._ref !== "null" &&
            img.asset._ref !== null &&
            img.asset._ref !== undefined &&
            img._key
        );

        const finalGallery = [
          ...validExistingImages.map((img: any) => ({
            _type: "image",
            _key: img._key,
            asset: {
              _type: "reference",
              _ref: String(img.asset._ref),
            },
          })),
          ...uploadedImageReferences,
        ];

        console.log("Final gallery being sent to Sanity:", finalGallery);

        // Validate that no gallery items have null references before sending to Sanity
        const invalidGalleryItems = finalGallery.filter(
          (item) =>
            !item.asset || !item.asset._ref || item.asset._ref === "null"
        );

        if (invalidGalleryItems.length > 0) {
          console.error("Found invalid gallery items:", invalidGalleryItems);
          throw new Error(
            "Invalid gallery items detected. Cannot update profile."
          );
        }

        // Update the profile in Sanity
        await client
          .patch(profile._id)
          .set({
            ...dataToUpdate,
            gallery: finalGallery,
            userId: user.id,
          })
          .commit();

        // Redirect after successful update
        router.push("/");
      } catch (err) {
        // Handle errors
        console.error("Error updating profile:", err);
      }
    });
  };
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
  return (
    <div className="container mx-auto py-10">
      <ProfileForm
        initialData={{
          ...profile,
          dateOfBirth: profile.dateOfBirth
            ? new Date(profile.dateOfBirth)
            : undefined,
          gallery: (profile.gallery || []).filter(
            (img: any) =>
              img &&
              img.asset &&
              img.asset._ref &&
              img.asset._ref !== "null" &&
              img.asset._ref !== null &&
              img.asset._ref !== undefined &&
              img._key
          ),
        }}
        onSubmit={handleSubmit}
        isLoading={isPending}
        isEditing
      />
    </div>
  );
}
