"use client";

import { DatePicker } from "@/components/date-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  DatingProfileForm,
  datingProfileFormSchema,
  Profile,
} from "@/schemas/dating-profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Plus, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface TagInputProps {
  value?: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags: number;
}

interface ExistingImage {
  url: string;
  _key: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
}

type ProfileFormProps = {
  initialData?: Partial<Profile> & {
    gallery?: ExistingImage[];
  };
  onSubmit: (values: DatingProfileForm) => void;
  isLoading?: boolean;
  isEditing?: boolean;
};

// Mock TagInput component
const TagInput = ({
  value = [],
  onChange,
  placeholder,
  maxTags,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    if (tag.trim() && !value.includes(tag.trim()) && value.length < maxTags) {
      onChange([...value, tag.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="px-3 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(inputValue);
          }
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

// Personality choice categories
const personalityCategories = [
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

export function ProfileForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing,
}: ProfileFormProps) {
  console.log({ initialData });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    Array<{
      url: string;
      _key: string;
      asset: { _ref: string; _type: "reference" };
    }>
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [deletePhotoIndex, setDeletePhotoIndex] = useState<number | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<DatingProfileForm>({
    resolver: zodResolver(datingProfileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      postcode: "",
      datingPurpose: undefined,
      gallery: [], // Initialize as empty array of Files
      aboutMe: "",
      aboutYou: "",
      height: { feet: 5, inches: 6 },
      weight: { value: 150, unit: "lbs" },
      education: undefined,
      work: "",
      zodiac: undefined,
      poisonsOfChoice: { substances: undefined, frequency: undefined },
      interests: [],
      personalityChoices: personalityCategories.map((category) => ({
        category,
        choice: "optionA",
      })),
      dontShowMe: [],
      dealBreakers: [],
      userId: "",
      // Only include compatible fields from initialData, excluding gallery
      ...(initialData && {
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        postcode: initialData.postcode || "",
        datingPurpose: initialData.datingPurpose,
        aboutMe: initialData.aboutMe || "",
        aboutYou: initialData.aboutYou || "",
        height: initialData.height || { feet: 5, inches: 6 },
        weight: initialData.weight || { value: 150, unit: "lbs" },
        education: initialData.education,
        work: initialData.work || "",
        zodiac: initialData.zodiac,
        poisonsOfChoice: initialData.poisonsOfChoice || {
          substances: undefined,
          frequency: undefined,
        },
        interests: initialData.interests || [],
        personalityChoices:
          initialData.personalityChoices ||
          personalityCategories.map((category) => ({
            category,
            choice: "optionA",
          })),
        dontShowMe: initialData.dontShowMe || [],
        dealBreakers: initialData.dealBreakers || [],
        userId: initialData.userId || "",
      }),
      dateOfBirth: initialData?.dateOfBirth?.toString() || "",
    },
    mode: "onChange",
  }); // Initialize existing images and previews from initialData
  useEffect(() => {
    if (initialData?.gallery && Array.isArray(initialData.gallery)) {
      const existingGallery = initialData.gallery.filter(
        (item: ExistingImage) => item && typeof item === "object" && item.url
      );
      setExistingImages(existingGallery);
      setSelectedPreviews(existingGallery.map((img: ExistingImage) => img.url));

      // Don't set the form gallery field with existing images as it expects File[]
      // The gallery field will be populated with actual files when user uploads
    }
  }, [initialData, form]);

  // Calculate form completion progress
  const calculateProgress = () => {
    const values = form.getValues();
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "postcode",
      "datingPurpose",
      "gallery",
      "aboutMe",
      "aboutYou",
      "height",
      "weight",
      "education",
      "work",
      "poisonsOfChoice",
      "interests",
      "personalityChoices",
    ];

    let filledFields = 0;
    requiredFields.forEach((field) => {
      const value = values[field as keyof typeof values];
      if (
        field === "gallery" &&
        (selectedFiles.length > 0 || existingImages.length > 0)
      ) {
        filledFields++;
      } else if (
        field === "height" &&
        typeof value === "object" &&
        value !== null &&
        "feet" in value &&
        "inches" in value
      ) {
        filledFields++;
      } else if (
        field === "weight" &&
        typeof value === "object" &&
        value !== null &&
        "value" in value &&
        "unit" in value &&
        value.value > 0
      ) {
        filledFields++;
      } else if (
        field === "poisonsOfChoice" &&
        typeof value === "object" &&
        value !== null &&
        "substances" in value &&
        "frequency" in value &&
        value.substances &&
        value.frequency
      ) {
        filledFields++;
      } else if (
        field === "interests" &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        filledFields++;
      } else if (
        field === "personalityChoices" &&
        Array.isArray(value) &&
        value.length === 15
      ) {
        filledFields++;
      } else if (value && typeof value === "string" && value.trim() !== "") {
        filledFields++;
      }
    });

    const progress = Math.round((filledFields / requiredFields.length) * 100);
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
      const totalImages = existingImages.length + selectedFiles.length;
      const availableSlots = 6 - totalImages;
      const filesToAdd = files.slice(0, availableSlots);

      if (filesToAdd.length > 0) {
        const newFiles = [...selectedFiles, ...filesToAdd];
        setSelectedFiles(newFiles);

        const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
        setSelectedPreviews((prev) => [...prev, ...newPreviews]);

        // Set the actual File objects for the form
        form.setValue("gallery", newFiles);
        form.trigger("gallery");
      }
    }
  };
  const removePhoto = (index: number) => {
    setDeletePhotoIndex(null);

    if (index < existingImages.length) {
      const imageToDelete = existingImages[index];
      setImagesToDelete((prev) => [...prev, imageToDelete.asset._ref]);

      const updatedExistingImages = existingImages.filter(
        (_, i) => i !== index
      );
      setExistingImages(updatedExistingImages);

      const updatedPreviews = selectedPreviews.filter((_, i) => i !== index);
      setSelectedPreviews(updatedPreviews);
    } else {
      const fileIndex = index - existingImages.length;
      const updatedFiles = selectedFiles.filter((_, i) => i !== fileIndex);
      setSelectedFiles(updatedFiles);

      const updatedPreviews = selectedPreviews.filter((_, i) => i !== index);
      setSelectedPreviews(updatedPreviews);

      // Update form with the remaining files
      form.setValue("gallery", updatedFiles);
      form.trigger("gallery");
    }
  };
  const handleSubmit = async (values: DatingProfileForm) => {
    const submitData = {
      ...values,
      gallery: selectedFiles, // Replace the gallery with the actual File array
      imagesToDelete,
      existingImages: existingImages.filter(
        (img) => !imagesToDelete.includes(img.asset._ref)
      ),
    };
    onSubmit(submitData);
  };

  console.log(form.formState.errors);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? "Edit Profile" : "Create Profile"}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-600">
              {formProgress}% complete
            </span>
            <Progress value={formProgress} className="w-32 h-2" />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Basic Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(date?.toISOString().split("T")[0])
                          }
                          placeholder="Select your date of birth"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Postcode
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your postcode"
                          className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Dating Purpose */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Dating Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="datingPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        What are you looking for?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select your dating purpose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fun">Fun</SelectItem>
                          <SelectItem value="serious">
                            Serious relationship
                          </SelectItem>
                          <SelectItem value="marriage">Marriage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Photos Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="gallery"
                  render={() => (
                    <FormItem>
                      <div className="space-y-4">
                        {selectedPreviews.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="col-span-2 sm:col-span-2 relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-pink-200 bg-gray-100">
                              <Image
                                src={
                                  selectedPreviews[0] ||
                                  "/placeholder.svg?height=400&width=300"
                                }
                                alt="Main photo"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setDeletePhotoIndex(0)}
                                className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 hover:bg-black/70 transition-all"
                              >
                                <X className="h-4 w-4 text-white" />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                <span className="text-white text-sm font-medium">
                                  Main Photo
                                </span>
                              </div>
                            </div>

                            {selectedPreviews.slice(1).map((photo, index) => {
                              const photoIndex = index + 1;
                              return (
                                <div
                                  key={photoIndex}
                                  className="aspect-[3/4] relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                                >
                                  <Image
                                    src={
                                      photo ||
                                      "/placeholder.svg?height=300&width=225"
                                    }
                                    alt={`Photo ${photoIndex + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeletePhotoIndex(photoIndex)
                                    }
                                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-all"
                                  >
                                    <X className="h-3 w-3 text-white" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {selectedPreviews.length < 6 && (
                          <div className="flex flex-col items-center justify-center">
                            {selectedPreviews.length === 0 ? (
                              <div
                                className="w-full aspect-[3/2] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all bg-gray-50"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <div className="text-center">
                                  <Camera className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
                                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                                    Add your photos
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Upload 1-6 photos to get started
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all bg-gray-50 text-gray-600 hover:text-pink-600"
                              >
                                <Plus className="h-5 w-5" />
                                <span className="font-medium">
                                  Add more photos ({selectedPreviews.length}/6)
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        multiple
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* About Sections */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="aboutMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        About Me
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell others about yourself..."
                          className="resize-none min-h-[120px] border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Describe yourself and your interests</span>
                        <span>{field.value?.length || 0}/1000</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aboutYou"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        {"About You (What you're looking for)"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you're looking for in a partner..."
                          className="resize-none min-h-[120px] border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Describe your ideal partner</span>
                        <span>{field.value?.length || 0}/1000</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Physical Attributes */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Physical Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Height
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Feet"
                              min={3}
                              max={8}
                              value={field.value?.feet || ""}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  feet: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            />
                          </FormControl>
                        </div>
                        <div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Inches"
                              min={0}
                              max={11}
                              value={field.value?.inches || ""}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  inches: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Weight
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Weight"
                              min={50}
                              max={500}
                              value={field.value?.value || ""}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  value: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            />
                          </FormControl>
                        </div>
                        <div>
                          <Select
                            onValueChange={(value) =>
                              field.onChange({
                                ...field.value,
                                unit: value,
                              })
                            }
                            defaultValue={field.value?.unit}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="lbs">lbs</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Background Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Education
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="bachelors">Bachelors</SelectItem>
                          <SelectItem value="hnd">HND</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                          <SelectItem value="leaver">School Leaver</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="work"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Work
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your work/profession"
                          className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zodiac"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Zodiac Sign (Optional)
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select zodiac sign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="aries">Aries</SelectItem>
                          <SelectItem value="taurus">Taurus</SelectItem>
                          <SelectItem value="gemini">Gemini</SelectItem>
                          <SelectItem value="cancer">Cancer</SelectItem>
                          <SelectItem value="leo">Leo</SelectItem>
                          <SelectItem value="virgo">Virgo</SelectItem>
                          <SelectItem value="libra">Libra</SelectItem>
                          <SelectItem value="scorpio">Scorpio</SelectItem>
                          <SelectItem value="sagittarius">
                            Sagittarius
                          </SelectItem>
                          <SelectItem value="capricorn">Capricorn</SelectItem>
                          <SelectItem value="aquarius">Aquarius</SelectItem>
                          <SelectItem value="pisces">Pisces</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Lifestyle Choices */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="poisonsOfChoice.substances"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Substances
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select substance preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="smoker">Smoker</SelectItem>
                          <SelectItem value="drinker">Drinker</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                          <SelectItem value="other_stuff">
                            Other stuff
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poisonsOfChoice.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Frequency
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="lightly">Lightly</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="heavily">Heavily</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add your interests"
                          maxTags={20}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Add 1-20 interests that represent you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Personality Choices */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Personality Choices
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Choose your preference for each scenario
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {personalityCategories.map((category, index) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name={`personalityChoices.${index}.choice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          {category}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="optionA"
                                id={`${index}-a`}
                              />
                              <Label htmlFor={`${index}-a`} className="text-sm">
                                Option A
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="optionB"
                                id={`${index}-b`}
                              />
                              <Label htmlFor={`${index}-b`} className="text-sm">
                                Option B
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Preferences & Deal Breakers */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Preferences & Deal Breakers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="dontShowMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        {"Don't Show Me (Optional)"}
                      </FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add things you don't want to see"
                          maxTags={3}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        {"Add up to 3 things you don't want to see in profiles"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dealBreakers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Deal Breakers (Optional)
                      </FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add your deal breakers"
                          maxTags={3}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Add up to 3 absolute deal breakers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-lg rounded-xl shadow-lg"
                disabled={isLoading}
              >
                {isEditing ? "Update Profile" : "Create Profile"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Delete Photo Confirmation Dialog */}
        <Dialog
          open={deletePhotoIndex !== null}
          onOpenChange={() => setDeletePhotoIndex(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove Photo</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this photo? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeletePhotoIndex(null)}
              >
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
