import { currentUser } from "@/lib/auth";
import { strapiClient } from "@/lib/strapi";
import { profileSchema } from "@/schemas";
import { z } from "zod";

const schema = profileSchema.extend({
  birthday: z.string(),
  id: z.number().positive(),
  documentId: z.string(),
  photos: z.array(z.object({ id: z.number(), url: z.string() })).optional(),
});

export type Profile = z.infer<typeof schema>;

export const getUserProfile = async (): Promise<Profile | null> => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const result = await strapiClient.collection("profiles");
    const response = await result.find({
      populate: ["photos"],
      filters: { userId: user?.id },
    });

    if (response.data.length > 0) {
      const data = schema.parse(response.data[0]);
      const { photos, ...rest } = data;

      const formattedPhotos = photos?.map((photo) => {
        return {
          ...photo,
          url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${photo.url}`,
        };
      });
      return { ...rest, photos: formattedPhotos };
    }

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
