/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from "@/lib/auth";
import { client, urlFor } from "@/lib/sanity";
import { type Profile as DatingProfile } from "@/schemas/dating-profile.schema";

// Extended type to include Sanity-specific fields
export type SanityDatingProfile = DatingProfile & {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  userId: string;
};

// Profile type with formatted gallery for frontend use
export type FormattedDatingProfile = Omit<SanityDatingProfile, "gallery"> & {
  gallery: Array<{
    _key: string;
    url: string;
    alt?: string;
    asset: {
      _ref: string;
      _type: "reference";
    };
  }>;
};

export const getUserProfile =
  async (): Promise<FormattedDatingProfile | null> => {
    try {
      const user = await currentUser();

      if (!user) {
        return null;
      }      // GROQ query to fetch the dating profile by userId
      const query = `*[_type == "profile" && userId == $userId][0]{
      _id,
      _createdAt,
      _updatedAt,
      firstName,
      lastName,
      dateOfBirth,
      postcode,
      datingPurpose,
      gallery[]{
        _key,
        alt,
        asset->{
          _id,
          _ref,
          url
        }
      },
      aboutMe,
      aboutYou,
      height,
      weight,
      education,
      work,
      zodiac,
      poisonsOfChoice,
      interests,
      personalityChoices,
      dontShowMe,
      dealBreakers,
      userId
    }`;

      const profile = await client.fetch(query, { userId: user.id });

      if (!profile) {
        return null;
      }

      // Format the gallery images with URLs
      const formattedGallery =
        profile.gallery?.map((image: any) => ({
          _key: image._key,
          url: urlFor(image).url(),
          alt: image.alt || "",
          asset: {
            _ref: image.asset._ref,
            _type: "reference" as const,
          },
        })) || [];

      return {
        ...profile,
        gallery: formattedGallery,
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

// Function to get profile by specific user ID (useful for admin or viewing other profiles)
export const getProfileByUserId = async (
  userId: string
): Promise<FormattedDatingProfile | null> => {
  try {
    const query = `*[_type == "profile" && userId == $userId][0]{
      _id,
      _createdAt,
      _updatedAt,
      firstName,
      lastName,
      dateOfBirth,
      postcode,
      datingPurpose,
      gallery[]{
        _key,
        alt,
        asset->{
          _id,
          _ref,
          url
        }
      },
      aboutMe,
      aboutYou,
      height,
      weight,
      education,
      work,
      zodiac,
      poisonsOfChoice,
      interests,
      personalityChoices,
      dontShowMe,
      dealBreakers,
      userId
    }`;

    const profile = await client.fetch(query, { userId });

    if (!profile) {
      return null;
    }

    // Format the gallery images with URLs
    const formattedGallery =
      profile.gallery?.map((image: any) => ({
        _key: image._key,
        url: urlFor(image).url(),
        alt: image.alt || "",
        asset: {
          _ref: image.asset._ref,
          _type: "reference" as const,
        },
      })) || [];

    return {
      ...profile,
      gallery: formattedGallery,
    };
  } catch (error) {
    console.error("Error fetching profile by user ID:", error);
    return null;
  }
};

// Function to check if user has a profile
export const hasUserProfile = async (): Promise<boolean> => {
  try {
    const user = await currentUser();

    if (!user) {
      return false;
    }

    const query = `count(*[_type == "profile" && userId == $userId])`;
    const count = await client.fetch(query, { userId: user.id });

    return count > 0;
  } catch (error) {
    console.error("Error checking if user has profile:", error);
    return false;
  }
};

// Function to get multiple profiles (for matching/discovery)
export const getProfiles = async (
  limit: number = 10,
  excludeUserId?: string
): Promise<FormattedDatingProfile[]> => {
  try {
    const excludeFilter = excludeUserId
      ? ` && userId != "${excludeUserId}"`
      : "";

    const query = `*[_type == "profile"${excludeFilter}][0...${limit}]{
      _id,
      _createdAt,
      _updatedAt,
      firstName,
      lastName,
      dateOfBirth,
      postcode,
      datingPurpose,
      gallery[]{
        _key,
        alt,
        asset->{
          _id,
          _ref,
          url
        }
      },
      aboutMe,
      aboutYou,
      height,
      weight,
      education,
      work,
      zodiac,
      poisonsOfChoice,
      interests,
      personalityChoices,
      dontShowMe,
      dealBreakers,
      userId
    }`;

    const profiles = await client.fetch(query);

    // Format all profiles
    return profiles.map((profile: any) => ({
      ...profile,
      gallery:
        profile.gallery?.map((image: any) => ({
          _key: image._key,
          url: urlFor(image).url(),
          alt: image.alt || "",
          asset: {
            _ref: image.asset._ref,
            _type: "reference" as const,
          },
        })) || [],
    }));
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
};
