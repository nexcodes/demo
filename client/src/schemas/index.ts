import { z } from "zod";
import { differenceInYears } from "date-fns";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  birthday: z
    .date({
      required_error: "Please select a date of birth.",
    })
    .refine(
      (date) => {
        const age = differenceInYears(new Date(), date);
        return age >= 18 && age <= 120;
      },
      {
        message: "You must be at least 18 years old to create a profile.",
      }
    ),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  lookingFor: z.string({
    required_error: "Please select what you're looking for.",
  }),
  relationshipType: z.string({
    required_error: "Please select a relationship type.",
  }),
  photos: z
    .array(z.number())
    .min(1, {
      message: "Please upload at least one photo.",
    })
    .max(6, {
      message: "You can upload a maximum of 6 photos.",
    }),
  aboutMe: z
    .string()
    .min(10, {
      message: "About me must be at least 10 characters.",
    })
    .max(500, {
      message: "About me must not exceed 500 characters.",
    }),
  interestedIn: z.string({
    required_error: "Please select who you're interested in.",
  }),
  ageRange: z.string({
    required_error: "Please select an age range.",
  }),
  smoking: z.string({
    required_error: "Please select your smoking preference.",
  }),
  drinking: z.string({
    required_error: "Please select your drinking preference.",
  }),
  cannabis: z.string({
    required_error: "Please select your cannabis preference.",
  }),
  interests: z
    .array(z.string())
    .min(1, {
      message: "Please select at least one interest.",
    })
    .max(8, {
      message: "You can select a maximum of 8 interests.",
    }),
  lookingForKids: z.string({
    required_error: "Please select your preference about kids.",
  }),
  vaccinationStatus: z.string({
    required_error: "Please select your vaccination status.",
  }),
});
