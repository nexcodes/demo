import { z } from "zod";

// Helper function to validate age (18+)
const validateAge = (dateString: string) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
};

// Enums for better type safety
export const DatingPurpose = z.enum(["fun", "serious", "marriage"]);

export const Education = z.enum([
  "doctorate",
  "masters",
  "bachelors",
  "hnd",
  "college",
  "leaver",
]);

export const ZodiacSign = z.enum([
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
]);

export const Substances = z.enum(["smoker", "drinker", "both", "other_stuff"]);

export const Frequency = z.enum(["none", "lightly", "medium", "heavily"]);

export const WeightUnit = z.enum(["lbs", "kg"]);

export const PersonalityChoice = z.enum(["optionA", "optionB"]);

// Sub-schemas
export const HeightSchema = z.object({
  feet: z.number().min(3).max(8),
  inches: z.number().min(0).max(11),
});

export const WeightSchema = z.object({
  value: z.number().min(50).max(500),
  unit: WeightUnit,
});

export const PoisonsOfChoiceSchema = z.object({
  substances: Substances,
  frequency: Frequency,
});

export const PersonalityChoiceSchema = z.object({
  category: z.string(),
  choice: PersonalityChoice,
});

// Main Profile Schema
export const ProfileSchema = z.object({
  // Basic Information
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  dateOfBirth: z.string().refine(validateAge, {
    message: "Must be at least 18 years old",
  }),

  // Location & Dating Preferences
  postcode: z.string().min(3).max(10),
  datingPurpose: DatingPurpose,

  // Gallery - array of image objects (simplified for Zod as Sanity image structure is complex)
  gallery: z
    .array(
      z.object({
        asset: z.object({
          _ref: z.string(),
          _type: z.literal("reference"),
        }),
        hotspot: z
          .object({
            x: z.number(),
            y: z.number(),
            height: z.number(),
            width: z.number(),
          })
          .optional(),
        crop: z
          .object({
            top: z.number(),
            bottom: z.number(),
            left: z.number(),
            right: z.number(),
          })
          .optional(),
      })
    )
    .min(1)
    .max(6),

  // About Sections
  aboutMe: z.string().min(10).max(1000),
  aboutYou: z.string().min(10).max(1000),

  // Physical Attributes
  height: HeightSchema,
  weight: WeightSchema,

  // Background Information
  education: Education,
  work: z.string().min(1).max(100),
  zodiac: ZodiacSign.optional(),

  // Lifestyle Choices
  poisonsOfChoice: PoisonsOfChoiceSchema,

  // Interests
  interests: z.array(z.string()).min(1).max(20),

  // Personality Choices
  personalityChoices: z
    .array(PersonalityChoiceSchema)
    .length(15)
    .refine(
      (choices) => {
        const expectedCategories = [
          "Too Fat vs. Too Short",
          "Hates Pets vs. Loves Pets Too Much",
          "No Sense of Humor vs. Laughs at Everything",
          "Talks Only About Themselves vs. Never Shares Anything Personal",
          "Average looking and loyal vs. Good looking but disloyal",
          "Addicted to Social Media vs. Has No Online Presence",
          "Always Wants to Stay Home vs. Never Wants to Stay Home",
          "Terrible Taste in Music vs. Judges Your Taste in Music",
          "Mommy Issues vs. Daddy Issues",
          "No Ambition vs. Workaholic",
          'Believes in Every Conspiracy Theory vs. Dismisses Everything as "Fake News"',
          "Know-It-All vs. Knows-Nothing",
          "Spends Too Much Money vs. Excessively Frugal",
          "Smart, highly motivated, and poor vs. Not smart, highly unmotivated, but well-off",
          "Rich but very unethical and immoral vs. Poor but very ethical and moral",
        ];

        const providedCategories = choices.map((choice) => choice.category);
        return expectedCategories.every((category) =>
          providedCategories.includes(category)
        );
      },
      {
        message: "All 15 personality choice categories must be present",
      }
    ),

  // Preferences & Deal Breakers
  dontShowMe: z.array(z.string()).max(3),
  dealBreakers: z.array(z.string()).max(3),

  // User ID (hidden field)
  userId: z.string().optional(),
});

// Type inference
export type Profile = z.infer<typeof ProfileSchema>;
export type Height = z.infer<typeof HeightSchema>;
export type Weight = z.infer<typeof WeightSchema>;
export type PoisonsOfChoice = z.infer<typeof PoisonsOfChoiceSchema>;
export type PersonalityChoiceType = z.infer<typeof PersonalityChoiceSchema>;

// Validation function
export const validateProfile = (data: unknown) => {
  return ProfileSchema.safeParse(data);
};

// Partial schema for updates
export const PartialProfileSchema = ProfileSchema.partial();
export type PartialProfile = z.infer<typeof PartialProfileSchema>;

// Schema for form validation (before image upload)
export const datingProfileFormSchema = ProfileSchema
  .omit({
    gallery: true,
  })
  .extend({
    gallery: z.array(z.instanceof(File)).optional(),
    imagesToDelete: z.array(z.string()).optional(),
    existingImages: z
      .array(
        z.object({
          url: z.string(),
          _key: z.string(),
          asset: z.object({
            _ref: z.string(),
            _type: z.literal("reference"),
          }),
        })
      )
      .optional(),
  });
export type DatingProfileForm = z.infer<typeof datingProfileFormSchema>;

// Example usage:
/*
const profileData = {
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1995-01-15",
  postcode: "12345",
  datingPurpose: "serious",
  gallery: [
    {
      asset: { _ref: "image-123", _type: "reference" }
    }
  ],
  aboutMe: "I love hiking and reading books in my spare time.",
  aboutYou: "Looking for someone who shares similar interests and values.",
  height: { feet: 6, inches: 2 },
  weight: { value: 180, unit: "lbs" },
  education: "bachelors",
  work: "Software Engineer",
  zodiac: "capricorn",
  poisonsOfChoice: {
    substances: "drinker",
    frequency: "lightly"
  },
  interests: ["hiking", "reading", "movies"],
  personalityChoices: [
    { category: "Too Fat vs. Too Short", choice: "optionA" },
    // ... all 15 categories
  ],
  dontShowMe: ["smokers"],
  dealBreakers: ["dishonesty"],
  userId: "user123"
}

const result = validateProfile(profileData)
if (result.success) {
  console.log("Valid profile:", result.data)
} else {
  console.log("Validation errors:", result.error.issues)
}
*/
