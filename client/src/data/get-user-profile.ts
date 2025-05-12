import { currentUser } from "@/lib/auth";
import { client, urlFor } from "@/lib/sanity";
import { profileSchema } from "@/schemas";
import { z } from "zod";

const schema = profileSchema.extend({
  birthday: z.string(),
  _id: z.string(),
  documentId: z.string(),
  pictures: z
    .array(
      z.object({
        _key: z.string(),
        asset: z.object({
          _ref: z.string(),
        }),
      })
    )
    .optional(),
});

// Ensure compatibility with existing code that expects id field and photos structure
export type Profile = Omit<z.infer<typeof schema>, "_id"> & {
  id: number | string; // Support both Strapi's number IDs and Sanity's string IDs
  photos?: Array<{ id: string | number; url: string }>; // Support both ID types
};

export const getUserProfile = async (): Promise<Profile | null> => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    // Use GROQ query to fetch profile by userId
    const query = `*[_type == "profile" && userId == $userId][0]{
      _id,
      documentId,
      name,
      gender,
      birthday,
      location,
      lookingFor,
      relationshipType,
      photos[],
      aboutMe,
      interestedIn,
      ageRange,
      smoking,
      drinking,
      cannabis,
      interests,
      lookingForKids,
      vaccinationStatus,
      userId
    }`;

    const profile = await client.fetch(query, { userId: user.id });

    if (profile) {
      const { photos, ...rest } = profile;
      // Convert Sanity image references to URLs
      // Interface for the formatted photo structure
      interface FormattedPhoto {
        id: string;
        url: string;
      }

      // Interface for the Sanity picture structure
      interface SanityPicture {
        _key: string;
        asset: {
          _ref: string;
        };
      }

      const formattedPhotos: FormattedPhoto[] | undefined = photos?.map(
        (picture: SanityPicture) => {
          return {
            id: picture._key,
            url: urlFor(picture).url(),
            asset: {
              _ref: picture.asset._ref,
            },
          };
        }
      );

      return { ...rest, photos: formattedPhotos };
    }

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
