import { z } from "zod";

// Helper function to calculate age
const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// Dating Profile Zod Schema
export const datingProfileSchema = z.object({
  // Basic Information
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),

  dateOfBirth: z
    .string()
    .or(z.date())
    .refine(
      (date) => {
        const birthDate = typeof date === "string" ? new Date(date) : date;
        return calculateAge(birthDate) >= 18;
      },
      {
        message: "Must be at least 18 years old",
      }
    ),

  // Location & Dating Preferences
  postcode: z
    .string()
    .min(3, "Postcode must be at least 3 characters")
    .max(10, "Postcode must be 10 characters or less"),

  datingPurpose: z.enum(["fun", "serious", "marriage"], {
    errorMap: () => ({ message: "Please select a dating purpose" }),
  }),

  // Gallery - Array of image objects or file objects
  gallery: z
    .array(
      z.object({
        url: z.string().url().optional(),
        alt: z.string().optional(),
        asset: z
          .object({
            _ref: z.string().optional(),
            _type: z.literal("reference").optional(),
          })
          .optional(),
      })
    )
    .min(1, "At least 1 image is required")
    .max(6, "Maximum 6 images allowed"),

  // About Sections
  aboutMe: z
    .string()
    .min(10, "About me must be at least 10 characters")
    .max(1000, "About me must be 1000 characters or less"),

  aboutYou: z
    .string()
    .min(10, "About you must be at least 10 characters")
    .max(1000, "About you must be 1000 characters or less"),

  // Physical Attributes
  height: z.object({
    feet: z
      .number()
      .min(3, "Height must be at least 3 feet")
      .max(8, "Height must be 8 feet or less"),
    inches: z
      .number()
      .min(0, "Inches must be 0 or more")
      .max(11, "Inches must be 11 or less"),
  }),

  // Background Information
  education: z.enum(
    ["doctorate", "masters", "bachelors", "hnd", "college", "leaver"],
    {
      errorMap: () => ({ message: "Please select an education level" }),
    }
  ),

  work: z
    .string()
    .min(1, "Work field is required")
    .max(100, "Work description must be 100 characters or less"),

  zodiac: z
    .enum([
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius",
      "capricorn",
      "aquarius",
      "pisces",
    ])
    .optional(),

  // Lifestyle Choices
  poisonsOfChoice: z.object({
    substances: z.enum(["none", "alcohol", "cigarettes_weed", "more_stuff"], {
      errorMap: () => ({ message: "Please select substance preference" }),
    }),
    frequency: z.enum(["none", "lightly", "medium", "heavily"], {
      errorMap: () => ({ message: "Please select frequency" }),
    }),
  }),

  // Interests
  interests: z
    .array(z.string())
    .min(1, "At least 1 interest is required")
    .max(20, "Maximum 20 interests allowed"),

  // Personality Choices
  personalityChoice: z.enum(
    [
      "fat_vs_short",
      "hates_pets_vs_loves_pets",
      "no_humor_vs_laughs_everything",
      "talks_self_vs_never_shares",
      "average_loyal_vs_good_disloyal",
      "social_media_vs_no_presence",
      "stay_home_vs_never_home",
      "bad_taste_vs_judges_taste",
      "mommy_vs_daddy_issues",
      "no_ambition_vs_workaholic",
      "conspiracy_vs_fake_news",
      "know_all_vs_know_nothing",
      "spends_much_vs_frugal",
      "smart_poor_vs_dumb_rich",
      "rich_unethical_vs_poor_ethical",
    ],
    {
      errorMap: () => ({ message: "Please make a personality choice" }),
    }
  ),
  // Preferences & Deal Breakers
  dontShowMe: z
    .array(z.string())
    .max(3, "Maximum 3 entries allowed")
    .optional(),

  dealBreakers: z
    .array(z.string())
    .max(3, "Maximum 3 entries allowed")
    .optional(),
});

// Type inference
export type DatingProfile = z.infer<typeof datingProfileSchema>;

// Partial schema for updates
export const datingProfileUpdateSchema = datingProfileSchema.partial();
export type DatingProfileUpdate = z.infer<typeof datingProfileUpdateSchema>;

// Schema for form validation (before image upload)
export const datingProfileFormSchema = datingProfileSchema
  .omit({
    gallery: true,
  })
  .extend({
    gallery: z.array(z.instanceof(File)).min(1).max(6),
  });
export type DatingProfileForm = z.infer<typeof datingProfileFormSchema>;

