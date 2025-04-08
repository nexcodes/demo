"use client";

import type React from "react";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { X, Info, Camera, Loader2 } from "lucide-react";
import { format, differenceInYears } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/date-picker";
import { profileSchema } from "@/schemas";
import { Profile } from "@/data/get-user-profile";

const interestOptions = [
  { value: "hiking", label: "Hiking", icon: "🥾" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "photography", label: "Photography", icon: "📷" },
  { value: "art", label: "Art", icon: "🎨" },
  { value: "cooking", label: "Cooking", icon: "🍳" },
  { value: "reading", label: "Reading", icon: "📚" },
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "dogs", label: "Dogs", icon: "🐕" },
  { value: "cats", label: "Cats", icon: "🐱" },
  { value: "movies", label: "Movies", icon: "🎬" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "fitness", label: "Fitness", icon: "💪" },
];

const formSchema = profileSchema;

type ProfileFormProps = {
  initialData?: Omit<Profile, "birthday" | "photos"> & {
    birthday: Date;
    photos?: number[];
    photosUrl?: string[];
  };
  onSubmit: (values: z.infer<typeof formSchema>, files: File[]) => void;
  isLoading?: boolean;
};

export function ProfileForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ProfileFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>(
    initialData?.photosUrl || []
  );

  const [showPreview, setShowPreview] = useState(false);
  const [deletePhotoIndex, setDeletePhotoIndex] = useState<number | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          name: "",
          gender: "",
          birthday: undefined,
          location: "",
          lookingFor: "",
          relationshipType: "",
          photos: [],
          aboutMe: "",
          interestedIn: "",
          ageRange: "",
          smoking: "",
          drinking: "",
          cannabis: "",
          interests: [],
          lookingForKids: "",
          vaccinationStatus: "",
        },
    mode: "onChange",
  });

  // Calculate form completion progress
  const calculateProgress = () => {
    const fields = Object.keys(formSchema.shape);
    const values = form.getValues();
    let filledFields = 0;

    fields.forEach((field) => {
      const value = values[field as keyof typeof values];
      if (
        value &&
        (typeof value === "string" ||
          (Array.isArray(value) && value.length > 0) ||
          value instanceof Date)
      ) {
        filledFields++;
      }
    });

    const progress = Math.round((filledFields / fields.length) * 100);
    setFormProgress(progress);
    return progress;
  };

  // Update progress when form values change
  form.watch(() => {
    calculateProgress();
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...files].slice(
        0,
        6 - selectedPreviews.length
      );
      setSelectedFiles(newFiles);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSelectedPreviews((prev) => [...prev, ...newPreviews].slice(0, 6));

      const photos = form.watch("photos");

      if (!photos.length) {
        form.setValue("photos", Array(newFiles.length).fill(0));
        form.trigger("photos");
      }
    }
  };

  // Update removePhoto handler
  const removePhoto = (index: number) => {
    setDeletePhotoIndex(null);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = selectedPreviews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setSelectedPreviews(updatedPreviews);

    const photos = initialData?.photos?.filter((_, i) => i !== index) || [];

    if (!photos.length) {
      form.setValue("photos", Array(updatedFiles.length).fill(0));
      form.trigger("photos");
    } else {
      form.setValue("photos", photos);
      form.trigger("photos");
    }
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = form.getValues("interests") || [];
    if (currentInterests.includes(interest)) {
      form.setValue(
        "interests",
        currentInterests.filter((i) => i !== interest)
      );
    } else {
      if (currentInterests.length < 8) {
        form.setValue("interests", [...currentInterests, interest]);
      }
    }
    form.trigger("interests");
  };

  const isInterestSelected = (interest: string) => {
    return form.getValues("interests")?.includes(interest) || false;
  };

  const handleSubmitWithValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (isValid) {
      setShowPreview(true);
    } else {
      // Find the first error and scroll to it
      const firstError = Object.keys(form.formState.errors)[0];
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const formatPreferenceValue = (key: string, value: string) => {
    const formatMap: Record<string, Record<string, string>> = {
      gender: {
        male: "Male",
        female: "Female",
        "non-binary": "Non-binary",
        other: "Other",
      },
      lookingFor: {
        relationship: "Relationship",
        casual: "Casual",
        friendship: "Friendship",
        "not-sure": "Not sure yet",
      },
      relationshipType: {
        monogamous: "Monogamous",
        "non-monogamous": "Non-monogamous",
        polyamorous: "Polyamorous",
        open: "Open to all",
      },
      interestedIn: {
        men: "Men",
        women: "Women",
        "non-binary": "Non-binary",
        everyone: "Everyone",
      },
      smoking: {
        never: "Never",
        sometimes: "Sometimes",
        often: "Often",
        "prefer-not-to-say": "Prefer not to say",
      },
      drinking: {
        never: "Never",
        sometimes: "Sometimes",
        often: "Often",
        "prefer-not-to-say": "Prefer not to say",
      },
      cannabis: {
        never: "Never",
        sometimes: "Sometimes",
        often: "Often",
        "prefer-not-to-say": "Prefer not to say",
      },
      lookingForKids: {
        want: "Want kids",
        "dont-want": "Don't want kids",
        "have-and-want-more": "Have and want more",
        "have-and-dont-want-more": "Have and don't want more",
        "not-sure": "Not sure yet",
      },
      vaccinationStatus: {
        vaccinated: "Vaccinated",
        "not-vaccinated": "Not vaccinated",
        "prefer-not-to-say": "Prefer not to say",
      },
    };

    return formatMap[key]?.[value] || value;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {initialData ? "Update Profile" : "Create Profile"}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {formProgress}% complete
              </span>
              <Progress value={formProgress} className="w-24 h-2" />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmitWithValidation} className="space-y-8">
              {/* Basics Section */}
              <div id="basics" className="space-y-4">
                <h2 className="text-lg font-semibold">Basics</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription>
                          {"This is how you'll appear to others."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">
                              Non-binary
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Birthday</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>You must be at least 18 years old</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select your birthday"
                            popoverProps={{
                              contentProps: {
                                align: "start",
                              },
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Your age will be calculated from this date.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City, State/Province, Country"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your city or general area.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Intentions Section */}
              <div id="intentions" className="space-y-4">
                <h2 className="text-lg font-semibold">Intentions</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="lookingFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{"I'm looking for"}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select what you're looking for" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="relationship">
                              Relationship
                            </SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="friendship">
                              Friendship
                            </SelectItem>
                            <SelectItem value="not-sure">
                              Not sure yet
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="relationshipType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monogamous">
                              Monogamous
                            </SelectItem>
                            <SelectItem value="non-monogamous">
                              Non-monogamous
                            </SelectItem>
                            <SelectItem value="polyamorous">
                              Polyamorous
                            </SelectItem>
                            <SelectItem value="open">Open to all</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Photos Section */}
              <div id="photos" className="space-y-4">
                <h2 className="text-lg font-semibold">Photos</h2>
                <FormField
                  control={form.control}
                  name="photos"
                  render={() => (
                    <FormItem>
                      <FormDescription>
                        Upload up to 6 photos. First photo will be your main
                        profile picture.
                      </FormDescription>

                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {selectedPreviews.map((photo, index) => (
                          <div
                            key={index}
                            className={cn(
                              "relative aspect-square rounded-md overflow-hidden border-2 border-transparent",
                              index === 0 && "border-pink-500"
                            )}
                          >
                            <Image
                              src={photo || "/placeholder.svg"}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setDeletePhotoIndex(index)}
                              className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1.5 hover:bg-opacity-70 transition-all"
                              aria-label={`Remove photo ${index + 1}`}
                            >
                              <X className="h-4 w-4 text-white" />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-pink-500 text-white text-xs py-1 text-center">
                                Main Photo
                              </div>
                            )}
                          </div>
                        ))}
                        {selectedPreviews.length < 6 && (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-pink-400 transition-colors bg-gray-50"
                          >
                            <Camera className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Add Photo
                            </span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoUpload}
                              multiple
                            />
                          </div>
                        )}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* About Me Section */}
              <div id="about" className="space-y-4">
                <h2 className="text-lg font-semibold">About Me</h2>
                <FormField
                  control={form.control}
                  name="aboutMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Me</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell others about yourself, your interests, and what you're looking for..."
                          className="resize-none min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-gray-500">
                        <FormDescription>
                          Write a short description about yourself.
                        </FormDescription>
                        <span>{field.value.length}/500</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Preferences Section */}
              <div id="preferences" className="space-y-4">
                <h2 className="text-lg font-semibold">Preferences</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="interestedIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interested in</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select who you're interested in" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="non-binary">
                              Non-binary
                            </SelectItem>
                            <SelectItem value="everyone">Everyone</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age range</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select age range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="18-24">18-24</SelectItem>
                            <SelectItem value="25-34">25-34</SelectItem>
                            <SelectItem value="35-44">35-44</SelectItem>
                            <SelectItem value="45-54">45-54</SelectItem>
                            <SelectItem value="55+">55+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Substances Section */}
              <div id="substances" className="space-y-4">
                <h2 className="text-lg font-semibold">Substances</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="smoking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smoking</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select smoking preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="sometimes">Sometimes</SelectItem>
                            <SelectItem value="often">Often</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drinking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drinking</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select drinking preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="sometimes">Sometimes</SelectItem>
                            <SelectItem value="often">Often</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cannabis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cannabis</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cannabis preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="sometimes">Sometimes</SelectItem>
                            <SelectItem value="often">Often</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Interests Section */}
              <div id="interests" className="space-y-4">
                <h2 className="text-lg font-semibold">Interests</h2>
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormDescription>
                        Select up to 8 interests that describe you.
                      </FormDescription>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                        {interestOptions.map((interest) => (
                          <Badge
                            key={interest.value}
                            variant={
                              isInterestSelected(interest.value)
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              "cursor-pointer py-3 justify-center text-sm transition-all",
                              isInterestSelected(interest.value)
                                ? "bg-pink-500 hover:bg-pink-600"
                                : "hover:bg-gray-100"
                            )}
                            onClick={() => toggleInterest(interest.value)}
                          >
                            <span className="mr-1">{interest.icon}</span>{" "}
                            {interest.label}
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Dealbreakers Section */}
              <div id="dealbreakers" className="space-y-4">
                <h2 className="text-lg font-semibold">Dealbreakers</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="lookingForKids"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Looking for kids</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select kids preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="want">Want kids</SelectItem>
                            <SelectItem value="dont-want">
                              {"Don't want kids"}
                            </SelectItem>
                            <SelectItem value="have-and-want-more">
                              Have and want more
                            </SelectItem>
                            <SelectItem value="have-and-dont-want-more">
                              {"Have and don't want more"}
                            </SelectItem>
                            <SelectItem value="not-sure">
                              Not sure yet
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vaccinationStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vaccination status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vaccination status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vaccinated">
                              Vaccinated
                            </SelectItem>
                            <SelectItem value="not-vaccinated">
                              Not vaccinated
                            </SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : initialData ? (
                  "Update Profile"
                ) : (
                  "Create Profile"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Delete Photo Confirmation Dialog */}
      <Dialog
        open={deletePhotoIndex !== null}
        onOpenChange={() => setDeletePhotoIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this photo? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeletePhotoIndex(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletePhotoIndex !== null && removePhoto(deletePhotoIndex)
              }
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profile Preview</DialogTitle>
            <DialogDescription>
              Review your profile before submitting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="flex items-center space-x-4">
              {selectedPreviews.length > 0 && (
                <div className="relative h-20 w-20 rounded-full overflow-hidden">
                  <Image
                    src={selectedPreviews[0] || "/placeholder.svg"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{form.getValues("name")}</h3>
                <p className="text-gray-500">
                  {form.getValues("location")} •{" "}
                  {form.getValues("birthday")
                    ? `${differenceInYears(
                        new Date(),
                        form.getValues("birthday")
                      )} years old`
                    : ""}
                </p>
              </div>
            </div>

            <Separator />

            {/* Photos */}
            {selectedPreviews.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Photos</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedPreviews.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden"
                    >
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Me */}
            <div>
              <h4 className="font-medium mb-2">About Me</h4>
              <p className="text-gray-700">{form.getValues("aboutMe")}</p>
            </div>

            <Separator />

            {/* Details */}
            <Accordion
              type="multiple"
              defaultValue={[
                "basics",
                "intentions",
                "preferences",
                "substances",
                "interests",
                "dealbreakers",
              ]}
            >
              <AccordionItem value="basics">
                <AccordionTrigger>Basics</AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Gender</dt>
                      <dd>
                        {formatPreferenceValue(
                          "gender",
                          form.getValues("gender")
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Birthday</dt>
                      <dd>
                        {form.getValues("birthday")
                          ? format(form.getValues("birthday"), "PPP")
                          : ""}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Location</dt>
                      <dd>{form.getValues("location")}</dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="intentions">
                <AccordionTrigger>Intentions</AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Looking for</dt>
                      <dd>
                        {formatPreferenceValue(
                          "lookingFor",
                          form.getValues("lookingFor")
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Relationship type</dt>
                      <dd>
                        {formatPreferenceValue(
                          "relationshipType",
                          form.getValues("relationshipType")
                        )}
                      </dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="preferences">
                <AccordionTrigger>Preferences</AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Interested in</dt>
                      <dd>
                        {formatPreferenceValue(
                          "interestedIn",
                          form.getValues("interestedIn")
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Age range</dt>
                      <dd>{form.getValues("ageRange")}</dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="substances">
                <AccordionTrigger>Substances</AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Smoking</dt>
                      <dd>
                        {formatPreferenceValue(
                          "smoking",
                          form.getValues("smoking")
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Drinking</dt>
                      <dd>
                        {formatPreferenceValue(
                          "drinking",
                          form.getValues("drinking")
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Cannabis</dt>
                      <dd>
                        {formatPreferenceValue(
                          "cannabis",
                          form.getValues("cannabis")
                        )}
                      </dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="interests">
                <AccordionTrigger>Interests</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {form.getValues("interests").map((interest) => {
                      const interestOption = interestOptions.find(
                        (opt) => opt.value === interest
                      );
                      return (
                        <Badge key={interest} className="bg-pink-500">
                          {interestOption?.icon} {interestOption?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dealbreakers">
                <AccordionTrigger>Dealbreakers</AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Looking for kids</dt>
                      <dd>
                        {formatPreferenceValue(
                          "lookingForKids",
                          form.getValues("lookingForKids")
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Vaccination status</dt>
                      <dd>
                        {formatPreferenceValue(
                          "vaccinationStatus",
                          form.getValues("vaccinationStatus")
                        )}
                      </dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Edit
            </Button>
            <Button
              onClick={() => {
                setShowPreview(false);
                onSubmit(form.getValues(), selectedFiles);
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : initialData ? (
                "Update Profile"
              ) : (
                "Create Profile"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
